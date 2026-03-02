const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { uploadPlastic, getUserUploads, getAllUploads, updatePickupDetails, approveOrRejectUpload, getUserStats, getAdminStats } = require("../controllers/uploadController");

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// User Routes (Protected)
router.post("/", authenticateToken, upload.single("image"), uploadPlastic);
router.get("/my-uploads", authenticateToken, getUserUploads);
router.get("/stats", authenticateToken, getUserStats);

// Admin Routes (Protected + Role Check)
router.get("/admin/all-uploads", authenticateToken, authorizeRoles("admin"), getAllUploads);
router.get("/admin/stats", authenticateToken, authorizeRoles("admin"), getAdminStats);
router.put("/admin/approve-reject/:id", authenticateToken, authorizeRoles("admin"), approveOrRejectUpload);
router.put("/pickup/:id", authenticateToken, authorizeRoles("admin"), updatePickupDetails);

module.exports = router;
