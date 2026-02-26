const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // JANGAN return AppError langsung. Gunakan next(new AppError(...))
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("Authorization header missing or invalid", 401));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        req.user = decoded;
        next();
    } catch (error) {
        // Tangkap error JWT (expired/invalid) dan kirim ke handler
        return next(new AppError("Invalid or expired token", 401));
    }
};