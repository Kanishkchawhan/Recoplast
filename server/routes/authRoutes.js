const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require("../controllers/authController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", authenticateToken, authorizeRoles("admin"), getAllUsers);

module.exports = router;
