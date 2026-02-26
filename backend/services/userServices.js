const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUsers({ search, page = 1, limit = 10 }) {
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    return this.userRepository.findAll(
      query,
      parseInt(page),
      parseInt(limit)
    );
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new AppError("User not found", 404);

    return user;
  }

  async createUser(data) {
    const existing = await this.userRepository.findByEmail(data.email);

    if (existing)
      throw new AppError("Email already registered", 400);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || "user",
    });

    const userResponse = await this.userRepository.findById(user.id);

    return userResponse;
  }

  async updateUser(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid User ID", 400);
  }

  const user = await this.userRepository.findByIdRaw(id);
  if (!user) throw new AppError("User not found", 404);

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  Object.assign(user, data);

  await this.userRepository.save(user);

  const UserResponse = await this.userRepository.findById(user.id);

  return UserResponse;
  }

  async updateUserRole(id, role) {
    const user = await this.userRepository.findByIdRaw(id);

    if (!user) throw new AppError("User not found", 404);

    user.role = role;

     await this.userRepository.save(user);
     return user;
  }

  async deleteUser(id, currentUserId) {
    const user = await this.userRepository.findByIdRaw(id);

    if (!user) throw new AppError("User not found", 404);

    if (user._id.toString() === currentUserId) {
      throw new AppError(
        "You cannot delete your own account",
        400
      );
    }

    await this.userRepository.delete(id);

    return true;
  }
}

module.exports = UserService;
