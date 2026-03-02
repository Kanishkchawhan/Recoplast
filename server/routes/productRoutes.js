const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllProducts, addProduct, deleteProduct, purchaseProduct } = require("../controllers/productController");

// Multer storage for product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, "product-" + Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Public - get all products
router.get("/", getAllProducts);

// Admin - add product with image
router.post("/", authenticateToken, authorizeRoles("admin"), upload.single("image"), addProduct);

// Admin - delete product
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteProduct);

// User - purchase product with coupons
router.post("/purchase/:id", authenticateToken, purchaseProduct);

module.exports = router;
