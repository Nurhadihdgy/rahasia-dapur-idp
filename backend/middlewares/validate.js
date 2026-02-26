const AppError = require("../utils/appError");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  req.body = value; // gunakan value hasil sanitize
  next();
};

module.exports = validate;
