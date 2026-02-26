const Joi = require("joi");

class AuthDTO {
  static registerSchema() {
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
    });
  }

  static loginSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
  }

  static updateProfileSchema() {
    return Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().optional(),
    });
  }

  static changePasswordSchema() {
  return Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref("newPassword")) // Membandingkan dengan newPassword
      .messages({
        "any.only": "Confirm password must match new password", // Update pesan agar jelas
      }),
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

module.exports = AuthDTO;
