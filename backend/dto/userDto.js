const Joi = require("joi");
const AppError = require("../utils/appError");

class UserDTO {
  static createSchema() {
    return Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string()
            .valid(Joi.ref("password"))
            .required()
            .strip()
            .messages({
              "any.only": "Confirm password must match password",
            }),
      role: Joi.string().valid("user", "admin").required(),
    });
  }

  static updateSchema() {
  return Joi.object({
    name: Joi.string().min(3).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().optional()
  });
}

  static roleSchema() {
    return Joi.object({
      role: Joi.string().valid("user", "admin").required(),
    });
  }

  static querySchema() {
    return Joi.object({
      search: Joi.string().optional(),
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().min(1).max(50).optional(),
    });
  }

  static paramIdSchema() {
    return Joi.object({
      id: Joi.string().length(24).hex().required(),
    });
  }

  static async validate(schema, data) {
    try {
      // abortEarly: false agar semua error ditampilkan, bukan cuma yang pertama ketemu
      const validated = await schema.validateAsync(data, { 
        abortEarly: false,
        stripUnknown: true // menghapus field yang tidak ada di schema
      });
      return validated;
    } catch (error) {
      // Melempar error agar ditangkap oleh asyncHandler di controller
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      const customError = new Error(errorMessage);
      customError.status = 400;
      throw customError;
    }
  }

}

module.exports = UserDTO;
