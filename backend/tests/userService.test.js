const UserService = require("../services/userServices");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// 1. Mocking Dependencies
jest.mock("bcryptjs");
jest.mock("../models/User");

describe("UserService Unit Test", () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    // Mock Repository
    mockUserRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByIdRaw: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    userService = new UserService(mockUserRepository);
    jest.clearAllMocks();
  });

  // ==========================================
  // TEST GET USERS (SEARCH & PAGINATION)
  // ==========================================
  describe("getUsers", () => {
    test("Harus memanggil findAll dengan parameter yang benar", async () => {
      mockUserRepository.findAll.mockResolvedValue({ users: [], total: 0 });

      await userService.getUsers({ search: "Hadi", page: "1", limit: "5" });

      expect(mockUserRepository.findAll).toHaveBeenCalledWith(
        { name: { $regex: "Hadi", $options: "i" } },
        1,
        5
      );
    });
  });

  // ==========================================
  // TEST CREATE USER (PASSWORD HASHING)
  // ==========================================
  describe("createUser", () => {
    test("Harus berhasil membuat user dan menghash password", async () => {
      const userData = { name: "Admin", email: "admin@test.com", password: "password123" };
      mockUserRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed_password_abc");
      mockUserRepository.create.mockResolvedValue({ id: "123" });
      mockUserRepository.findById.mockResolvedValue({ id: "123", name: "Admin" });

      const result = await userService.createUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        password: "hashed_password_abc"
      }));
      expect(result.name).toBe("Admin");
    });

    test("Harus throw error jika email sudah terdaftar", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({ email: "exist@test.com" });

      await expect(userService.createUser({ email: "exist@test.com" }))
        .rejects.toThrow(new AppError("Email already registered", 400));
    });
  });

  // ==========================================
  // TEST UPDATE USER
  // ==========================================
  describe("updateUser", () => {
    test("Harus menghash password baru jika password dikirim saat update", async () => {
      const existingUser = { id: "123", name: "Old Name" };
      mockUserRepository.findByIdRaw.mockResolvedValue(existingUser);
      bcrypt.genSalt.mockResolvedValue("salt_abc");
      bcrypt.hash.mockResolvedValue("new_hashed_password");
      mockUserRepository.findById.mockResolvedValue({ id: "123", name: "New Name" });

      // Mocking Mongoose ID Validation
      mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(true);

      const result = await userService.updateUser("123", { password: "newPassword123", name: "New Name" });

      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result.name).toBe("New Name");
    });
  });

  // ==========================================
  // TEST DELETE USER (SECURITY CHECK)
  // ==========================================
  describe("deleteUser", () => {
    test("Harus throw error jika mencoba menghapus akun sendiri", async () => {
      const currentUserId = "user_123";
      const mockUser = { _id: { toString: () => currentUserId } };
      mockUserRepository.findByIdRaw.mockResolvedValue(mockUser);

      await expect(userService.deleteUser(currentUserId, currentUserId))
        .rejects.toThrow(new AppError("You cannot delete your own account", 400));
    });

    test("Harus berhasil menghapus user lain", async () => {
      const currentUserId = "admin_123";
      const targetUserId = "user_456";
      const mockUser = { _id: { toString: () => targetUserId } };
      
      mockUserRepository.findByIdRaw.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(true);

      const result = await userService.deleteUser(targetUserId, currentUserId);

      expect(result).toBe(true);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(targetUserId);
    });
  });
});