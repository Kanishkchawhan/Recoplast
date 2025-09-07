const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authenticateToken = require("../middleware/authMiddleware"); // <-- Import JWT middleware
const { uploadPlastic, getUserUploads, getAllUploads, updatePickupDetails, approveOrRejectUpload } = require("../controllers/uploadController");

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Protected routes
router.post("/", upload.single("image"), uploadPlastic);
router.get("/:username", getUserUploads);
router.put("/pickup/:id", updatePickupDetails);

// Public/admin routes (adjust as needed)
router.get("/admin/all-uploads", getAllUploads); // Admin view
router.put("/admin/approve-reject/:id", approveOrRejectUpload); // Admin approve/reject route

module.exports = router;
