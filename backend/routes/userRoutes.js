const router = require("express").Router();
const {
  getUsers,
  getUsersById,
  createUser,
  updateRole,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

const { verifyToken } = require("../middlewares/authMiddlewares");
const { authorizeRoles } = require("../middlewares/roleMiddlewares");
const { apiLimiter } = require("../middlewares/rateLimiters");

router.use(verifyToken);
router.use(authorizeRoles("admin"));
router.use(apiLimiter);

// ==========================================
// USER MANAGEMENT ROUTES
// ==========================================

// Grouping rute berdasarkan path yang sama
router.route("/")
  .get(getUsers)      // GET ALL
  .post(createUser);  // CREATE

router.route("/:id")
  .get(getUsersById)  // GET BY ID
  .put(updateUser)    // UPDATE INFO
  .delete(deleteUser);// DELETE

// Khusus Update Role
router.put("/:id/role", updateRole);

module.exports = router;