const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repository/userRepository");
const User = require("../models/User");
const logActivity = require("../utils/activityLogger");
const AppError = require("../utils/appError");

class AuthService {
  constructor() {
    this.userRepository = new UserRepository(User);
  }
  generateAccessToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
  }

  generateRefreshToken(user) {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
  }
  async register(data) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    if (!data.password) {
      throw new AppError("Password is Required", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: "user",
    });

    await logActivity({
      userId: user._id,
      action: "REGISTER",
      type: "USER",
      referenceId: user._id,
      description: `User ${user.name} registered`,
    });

    return user;
  }

  async login({ email, password, device }) {
    const user = await this.userRepository.findByEmailAndPassword(email);

    if (!user) throw new AppError("User not found", 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid password", 400);

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // hapus refresh token jika ada token dengan device sama
    await this.userRepository.removeRefreshTokenByDevice(
      user._id,
      device || "unknown",
    );
    // simpan refresh token (multi device)
    await this.userRepository.addRefreshToken(user._id, {
      token: refreshToken,
      device: device || "unknown",
      createdAt: new Date(),
    });

    const userResponse = await this.userRepository.findById(user._id);

    await logActivity({
      userId: user._id,
      action: "LOGIN",
      type: "USER",
      referenceId: user._id,
      description: `User ${user.name} sudah berhasil login`,
    });

    return { accessToken, refreshToken, userResponse };
  }

  async refreshToken(oldToken) {
    if (!oldToken) throw new AppError("No refresh token", 401);

    let decoded;
    try {
        decoded = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        // --- PENANGANAN EXPIRED TOKEN ---
        if (err.name === 'TokenExpiredError') {
            // Dekode secara paksa tanpa verifikasi untuk mendapatkan userId
            const expiredPayload = jwt.decode(oldToken);
            
            if (expiredPayload && expiredPayload.id) {
                // Hapus token yang expired ini dari database secara otomatis
                await this.userRepository.removeSpecificToken(expiredPayload.id, oldToken);
            }
            throw new AppError("Refresh token expired. Please login again.", 401);
        }
        
        throw new AppError("Invalid refresh token", 403);
    }

    const user = await this.userRepository.findByIdWithRefreshToken(decoded.id);
    if (!user) throw new AppError("User not found", 404);

    const existingToken = user.refreshTokens.find((rt) => rt.token === oldToken);

    // Reuse detected (Token sah menurut JWT tapi tidak ada di DB)
    if (!existingToken) {
        await this.userRepository.clearAllTokens(user._id);
        throw new AppError("Suspicious activity detected. Logged out from all devices.", 403);
    }

    // Rotasi Token: Hapus yang lama, buat yang baru
    const newRefreshToken = this.generateRefreshToken(user);
    const newAccessToken = this.generateAccessToken(user);

    // Gunakan atomik update (lebih aman & cepat dibanding .save())
    await this.userRepository.rotateToken(user._id, oldToken, {
        token: newRefreshToken,
        device: existingToken.device,
        createdAt: new Date(),
    });

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
}

  async logout(refreshToken) {
    if (!refreshToken) {
      throw new AppError("No refresh token provided", 400);
    }

    try {
      // 1. Verifikasi token untuk mendapatkan userId
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      // 2. Gunakan repository untuk menghapus token spesifik tersebut
      await this.userRepository.removeSpecificToken(decoded.id, refreshToken);

      return true;
    } catch (error) {
      // Jika token sudah expired, kita tetap ingin logout berhasil di sisi client
      // tapi di server mungkin token sudah tidak ada
      return true;
    }
  }

  async logoutAll(userId) {
    // Langsung set array refreshTokens menjadi kosong di database
    await this.userRepository.clearAllTokens(userId);
    return true;
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    return user;
  }

  async updateProfile(userId, data) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.name = data.name;
    if (data.email) user.email = data.email;

    await this.userRepository.save(user);
    await logActivity({
      userId: user._id,
      action: "UPDATE_PROFILE",
      type: "USER",
      referenceId: user._id,
      description: `User ${user.name} berhasil di update`,
    });
    return user;
  }

  async changePassword(userId, data) {
    // 1. Ambil user beserta password hash-nya
    const user = await this.userRepository.findByIdWithPassword(userId);
    if (!user) throw new AppError("User not found", 404);

    // 2. Verifikasi password saat ini menggunakan bcrypt
    const isMatch = await bcrypt.compare(data.currentPassword, user.password);

    if (!isMatch) {
      throw new AppError("Current password is incorrect", 400);
    }

    // 3. Cek agar password baru tidak sama dengan password lama (Opsional tapi disarankan)
    const isSamePassword = await bcrypt.compare(
      data.newPassword,
      user.password,
    );
    if (isSamePassword) {
      throw new AppError(
        "New password cannot be the same as old password",
        400,
      );
    }

    // 4. Hash password baru
    const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

    await this.userRepository.updatePassword(userId, hashedNewPassword);

    return true;
  }
}

module.exports = new AuthService();
