const ApiResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  return ApiResponse.error(
    res,
    err.message || "Internal Server Error",
    statusCode,
    { stack: process.env.NODE_ENV === "production" ? null : err.stack }
  );
};

module.exports = errorHandler;

