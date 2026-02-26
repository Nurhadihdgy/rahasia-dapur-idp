const router = require("express").Router();
const {
  getAll,
  getById,
  createRecipe,
  deleteRecipe,
  updateRecipe,
} = require("../controllers/recipeControllers");

const { verifyToken } = require("../middlewares/authMiddlewares");
const { authorizeRoles } = require("../middlewares/roleMiddlewares");
const upload = require("../middlewares/uploadMiddlewares");
const apiLimiter = require("../middlewares/rateLimiters").apiLimiter;

// Public
router.get("/", verifyToken, apiLimiter,authorizeRoles("user","admin"), getAll);
router.get("/:id", verifyToken, apiLimiter,authorizeRoles("user","admin") , getById);

router.post(
  "/",
  verifyToken,
  apiLimiter,
  authorizeRoles("admin"),
  upload.single("media"),
  createRecipe
);

router.put(
  "/:id",
  verifyToken,
apiLimiter,
  authorizeRoles("admin"),
  upload.single("media"),
  updateRecipe
);

router.delete("/:id", verifyToken, apiLimiter, authorizeRoles("admin"), deleteRecipe);
module.exports = router;
