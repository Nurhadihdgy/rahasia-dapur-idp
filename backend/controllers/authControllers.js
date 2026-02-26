const asyncHandler = require("../utils/asyncHandler");
const AuthService = require("../services/authServices");
const AuthDTO = require("../dto/authDto");
const ApiResponse = require("../utils/response");

class AuthController {
  constructor() {
    this.authService = AuthService;
  }

  register = asyncHandler(async (req, res) => {
    const validated = await AuthDTO.validate(
      AuthDTO.registerSchema(),
      req.body,
    );
    await this.authService.register(validated);

    const responseData = {
      name: validated.name,
      email: validated.email,
    };

    return ApiResponse.success(
      res,
      responseData,
      "Registration successful",
      201,
    );
  });

  login = asyncHandler(async (req, res) => {
    const validated = await AuthDTO.validate(AuthDTO.loginSchema(), req.body);
    const { accessToken, refreshToken, userResponse } =
      await this.authService.login({
        ...validated,
        device: req.headers["user-agent"],
      });

    if (userResponse.role !== "user") {
      // (Opsional) Hapus session/refresh token yang baru saja dibuat oleh service jika perlu
      if (refreshToken) await this.authService.logout(refreshToken);
      
      return ApiResponse.error(
        res, 
        "Login Gagal, User tidak ditemukan.", 
        403
      );
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 hari
    });

    return ApiResponse.success(
      res,
      { accessToken, userResponse },
      "Login successful",
      200,
    );
  });

  loginAdmin = asyncHandler(async (req, res) => {
    const validated = await AuthDTO.validate(AuthDTO.loginSchema(), req.body);

    const { accessToken, refreshToken, userResponse } = await this.authService.login({
      ...validated,
      device: req.headers["user-agent"],
    });

    if (userResponse.role !== "admin") {
      if (refreshToken) await this.authService.logout(refreshToken);
      
      return ApiResponse.error(
        res, 
        "Access denied. Only admin can login here.", 
        403
      );
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 hari
    });
    
    return ApiResponse.success(
      res,
      { accessToken, userResponse },
      "Admin login successful",
      200,
    );
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const tokens = await this.authService.refreshToken(refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return ApiResponse.success(res, tokens, "Refresh Token Successfully", 200);
  });

  logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
        return ApiResponse.success(res, null, "Already logged out", 200);
    }

    await this.authService.logout(refreshToken);

    // Bersihkan cookie di browser
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return ApiResponse.success(res, null, "Logout successful", 200);
  });

  logoutAll = asyncHandler(async (req, res) => {
    // Gunakan req.user.id yang didapat dari middleware verifyToken
    await this.authService.logoutAll(req.user.id);

    res.clearCookie("refreshToken");
    return ApiResponse.success(res, null, "Logged out from all devices", 200);
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = await this.authService.getProfile(req.user.id);

    return ApiResponse.success(
      res,
      { user },
      "Profile retrieved successfully",
      200,
    );
  });

  updateProfile = asyncHandler(async (req, res) => {
    const validated = await AuthDTO.validate(
      AuthDTO.updateProfileSchema(),
      req.body,
    );
    const user = await this.authService.updateProfile(req.user.id, validated);

    return ApiResponse.success(res, user, "Update Profile Success", 200);
  });

  changePassword = asyncHandler(async (req, res) => {
    const validated = await AuthDTO.validate(
      AuthDTO.changePasswordSchema(),
      req.body,
    );

    await this.authService.changePassword(req.user.id, validated);

    return ApiResponse.success(res, null, "Password changed successfully", 200);
  });
}

module.exports = new AuthController();
