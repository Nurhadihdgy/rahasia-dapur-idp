const asyncHandler = require("../utils/asyncHandler");
const UserRepository = require("../repository/userRepository");
const UserService = require("../services/userServices");
const User = require("../models/User");
const ApiResponse = require("../utils/response");
const UserDTO = require("../dto/userDto");
const logActivity = require("../utils/activityLogger");
const userRepository = new UserRepository(User);
const userService = new UserService(userRepository);
class UserController {

  getUsers = asyncHandler(async (req, res) => {
    const validatedQuery = await UserDTO.validate(UserDTO.querySchema(),req.query);

    const result = await userService.getUsers(validatedQuery);

    return ApiResponse.success(res, result, "Users retrieved successfully", 200);
  });

  // =============================
  // GET USER BY ID
  // =============================
  getUsersById = asyncHandler(async (req, res) => {
    const validatedParams = await UserDTO.validate(UserDTO.paramIdSchema(),req.params);

    const user = await userService.getUserById(validatedParams.id);

    return ApiResponse.success(res, user, "User retrieved successfully", 200);
  });

  // =============================
  // CREATE USER (ADMIN)
  // =============================
  createUser = asyncHandler(async (req, res) => {
    const validated = await UserDTO.validate(UserDTO.createSchema(),req.body);

    const user = await userService.createUser(validated);

    await logActivity({
      userId: req.user.id,
      action: "CREATE_USER",
      type: "USER",
      referenceId: user._id,
      description: `User "${user.name}" created`,
    });

    return ApiResponse.success(res, user, "User created", 201);
  });

  // =============================
  // UPDATE USER
  // =============================
  updateUser = asyncHandler(async (req, res) => {
    const validatedParams = await UserDTO.validate(UserDTO.paramIdSchema(),req.params);
    const validated = await UserDTO.validate(UserDTO.updateSchema(),req.body);

    const user = await userService.updateUser(
      validatedParams.id,
      validated
    );

    await logActivity({
      userId: req.user.id,
      action: "UPDATE_USER",
      type: "USER",
      referenceId: validatedParams.id,
      description: `User "${user.name}" updated`,
    })

    return ApiResponse.success(res, user, "User updated", 200);
  });

  // =============================
  // UPDATE ROLE
  // =============================
  updateRole = asyncHandler(async (req, res) => {
    const validated = await UserDTO.validate(UserDTO.roleSchema(),req.body);

    const validatedParams = await UserDTO.validate(UserDTO.paramIdSchema(),req.params);

    const user = await userService.updateUserRole(
      validatedParams.id,
      validated.role
    );

    return ApiResponse.success(res, user, "Role updated", 200);
  });

  // =============================
  // DELETE USER
  // =============================
  deleteUser = asyncHandler(async (req, res) => {
    const validatedParams = await UserDTO.validate(UserDTO.paramIdSchema(),req.params);

    await userService.deleteUser(
      validatedParams.id,
      req.user.id
    );

    await logActivity({
      userId: req.user.id,
      action: "DELETE_USER",
      type: "USER",
      referenceId: validatedParams.id,
      description: `User with ID "${validatedParams.id}" deleted`,
    });

    return ApiResponse.success(res, null, "User deleted successfully", 200);
  });
}

module.exports = new UserController();
