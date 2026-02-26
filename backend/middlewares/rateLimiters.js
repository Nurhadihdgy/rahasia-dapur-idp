const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 10, // max 10 request
  message: {
    status: 429,
    success: false,
    message: "Too many requests, please try again later.",
  },
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100, // max 100 request
  message: {
    status: 429,
    success: false,
    message: "Too many requests, please try again later.",
  },
});

module.exports = { authLimiter, apiLimiter };
