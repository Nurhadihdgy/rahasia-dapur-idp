const Joi = require("joi");

class RecipeDTO {
  static createSchema() {
    return Joi.object({
      title: Joi.string().min(3).required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      ingredients: Joi.array().items(Joi.string().min(1)).min(1).required(),
      steps: Joi.array().items(Joi.string().min(1)).min(1).required(),
      youtubeUrl: Joi.string().uri().allow(null, '').optional(),
    });
  }

  static updateSchema() {
    return Joi.object({
      title: Joi.string().min(3).optional(),
      description: Joi.string().optional(),
      category: Joi.string().optional(),
      ingredients: Joi.array().items(Joi.string().min(1)).optional(),
      steps: Joi.array().items(Joi.string().min(1)).optional(),
      youtubeUrl: Joi.string().uri().allow(null, '').optional(),
    });
  }

  static paramsIdSchema() {
    return Joi.object({
      id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        .messages({ "string.pattern.base": "Invalid Recipe ID format" }),
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
      customError.statusCode = 400; // Pastikan menggunakan statusCode agar konsisten dengan AppError
      throw customError;
    }
  }
}

module.exports = RecipeDTO;