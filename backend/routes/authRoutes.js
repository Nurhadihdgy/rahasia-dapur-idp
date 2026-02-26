const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

const { authLimiter, apiLimiter } = require("../middlewares/rateLimiters");
const { verifyToken } = require("../middlewares/authMiddlewares");

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post('/admin/login',authLimiter, authController.loginAdmin);
router.get("/profile", apiLimiter, verifyToken, authController.getProfile);
router.put("/profile", apiLimiter, verifyToken, authController.updateProfile);
router.post("/refresh-token", apiLimiter, authLimiter, authController.refreshToken);
router.put("/change-password", apiLimiter, verifyToken, authController.changePassword);
//logout per device
router.post("/logout", verifyToken, authController.logout);
//logout all device
router.post("/logout-all", verifyToken, authController.logoutAll);

module.exports = router;
