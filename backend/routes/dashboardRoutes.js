const router = require("express").Router();
const { getDashboardStats } = require("../controllers/dashboardControllers");

const { verifyToken } = require("../middlewares/authMiddlewares");
const { authorizeRoles } = require("../middlewares/roleMiddlewares");

router.use(verifyToken); 
router.use(authorizeRoles("admin")); 

router.get("/", getDashboardStats);

module.exports = router;