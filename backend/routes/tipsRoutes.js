const router = require("express").Router();
const {
  getAll,
  getById,
  create,
  update,
  deleteTip,
  getTrending,
  toggleLike,
} = require("../controllers/tipsControllers");

const { verifyToken } = require("../middlewares/authMiddlewares");
const { authorizeRoles } = require("../middlewares/roleMiddlewares");
const upload = require("../middlewares/uploadMiddlewares");
const { apiLimiter } = require("../middlewares/rateLimiters");

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get("/", apiLimiter, getAll);
router.get("/trending", apiLimiter, getTrending); // Tetap di atas :id
router.get("/:id", apiLimiter, getById);

// ==========================================
// USER ROUTES (AUTHENTICATED)
// ==========================================
router.post("/:id/like", verifyToken, authorizeRoles("user"), toggleLike);

// ==========================================
// ADMIN ROUTES (PROTECTED)
// ==========================================
router.post("/", verifyToken, authorizeRoles("admin"), upload.single("media"), create);

router.put(
  "/:id",
  verifyToken,
  apiLimiter,
  authorizeRoles("admin"),
  upload.single("media"),
  update
);

router.delete("/:id", verifyToken, apiLimiter, authorizeRoles("admin"), deleteTip);

module.exports = router;