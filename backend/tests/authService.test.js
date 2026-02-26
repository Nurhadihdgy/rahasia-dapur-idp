const authService = require("../services/authServices");
const UserRepository = require("../repository/userRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

// 1. Mocking Dependencies
jest.mock("../repository/userRepository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../utils/activityLogger", () => jest.fn().mockResolvedValue(true));

describe("AuthService Unit Test", () => {
  let mockUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = {
      _id: "user123",
      name: "Hadi",
      email: "hadi@test.com",
      password: "hashedPassword",
      role: "user",
      refreshTokens: [{ token: "oldRefreshToken", device: "web" }],
    };
  });

  // --- TEST REGISTER ---
  describe("register()", () => {
    test("Harus berhasil register jika data valid", async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      UserRepository.prototype.create.mockResolvedValue(mockUser);

      const result = await authService.register({
        name: "Hadi",
        email: "hadi@test.com",
        password: "password123",
      });

      expect(result).toEqual(mockUser);
      expect(UserRepository.prototype.create).toHaveBeenCalled();
    });

    test("Harus throw error jika email sudah ada", async () => {
      UserRepository.prototype.findByEmail.mockResolvedValue(mockUser);
      
      await expect(authService.register({ email: "hadi@test.com" }))
        .rejects.toThrow(new AppError("Email already registered", 400));
    });
  });

  // --- TEST LOGIN ---
  describe("login()", () => {
    test("Harus berhasil login dan memberikan token", async () => {
      UserRepository.prototype.findByEmailAndPassword.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token123");
      UserRepository.prototype.findById.mockResolvedValue(mockUser);

      const result = await authService.login({ email: "hadi@test.com", password: "password123" });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(UserRepository.prototype.addRefreshToken).toHaveBeenCalled();
    });

    test("Harus throw error jika password salah", async () => {
      UserRepository.prototype.findByEmailAndPassword.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login({ email: "hadi@test.com", password: "wrong" }))
        .rejects.toThrow(new AppError("Invalid password", 400));
    });
  });

  // --- TEST REFRESH TOKEN (Kunci Keamanan) ---
  describe("refreshToken()", () => {
    test("Harus rotasi token jika token valid dan ada di DB", async () => {
      jwt.verify.mockReturnValue({ id: "user123" });
      UserRepository.prototype.findByIdWithRefreshToken.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("newTokens");

      const result = await authService.refreshToken("oldRefreshToken");

      expect(result).toHaveProperty("accessToken", "newTokens");
      expect(UserRepository.prototype.rotateToken).toHaveBeenCalled();
    });

    test("Harus hapus semua token jika terjadi Reuse Detection (Token tidak di DB)", async () => {
      jwt.verify.mockReturnValue({ id: "user123" });
      UserRepository.prototype.findByIdWithRefreshToken.mockResolvedValue(mockUser);
      
      // Kirim token yang tidak ada di list refreshTokens user
      await expect(authService.refreshToken("tokenPalsu"))
        .rejects.toThrow(new AppError("Suspicious activity detected. Logged out from all devices.", 403));
      
      expect(UserRepository.prototype.clearAllTokens).toHaveBeenCalled();
    });
  });

  // --- TEST CHANGE PASSWORD ---
  describe("changePassword()", () => {
    test("Harus berhasil ganti password", async () => {
      UserRepository.prototype.findByIdWithPassword.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValueOnce(true); // Current match
      bcrypt.compare.mockResolvedValueOnce(false); // New not same as old
      bcrypt.hash.mockResolvedValue("newHashedPassword");

      const result = await authService.changePassword("user123", {
        currentPassword: "old",
        newPassword: "new",
      });

      expect(result).toBe(true);
      expect(UserRepository.prototype.updatePassword).toHaveBeenCalled();
    });
  });

  // --- TEST LOGOUT ---
  describe("logout()", () => {
    test("Harus memanggil removeSpecificToken", async () => {
      jwt.verify.mockReturnValue({ id: "user123" });
      
      const result = await authService.logout("validToken");
      expect(result).toBe(true);
      expect(UserRepository.prototype.removeSpecificToken).toHaveBeenCalled();
    });
  });
});