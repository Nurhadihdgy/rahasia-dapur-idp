const Joi = require("joi");

class TipsDTO {
  static createSchema() {
    return Joi.object({
      title: Joi.string().min(3).max(150).required().messages({
        "string.empty": "Judul tips harus diisi",
        "string.min": "Judul minimal 3 karakter",
      }),
      description: Joi.string().min(5).required().messages({
        "string.empty": "Deskripsi tips harus diisi",
      }),
      youtubeUrl: Joi.string().uri().optional().allow(null, ""),
    });
  }

  static updateSchema() {
    return Joi.object({
      title: Joi.string().min(3).max(150).optional(),
      description: Joi.string().min(5).optional(),
      youtubeUrl: Joi.string().uri().optional().allow(null, ""),
    });
  }

  static querySchema() {
    return Joi.object({
      search: Joi.string().optional().allow(""),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(50).default(6),
    });
  }

  static paramIdSchema() {
    return Joi.object({
      id: Joi.string().length(24).hex().required().messages({
        "string.length": "Format ID tidak valid",
      }),
    });
  }

  static async validate(schema, data) {
    try {
      return await schema.validateAsync(data, { 
        abortEarly: false, 
        stripUnknown: true 
      });
    } catch (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      const customError = new Error(errorMessage);
      customError.status = 400;
      throw customError;
    }
  }
}

module.exports = TipsDTO;