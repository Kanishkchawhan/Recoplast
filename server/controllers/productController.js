const Product = require("../models/Product");
const User = require("../models/User");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Add a new product (Admin only)
const addProduct = async (req, res) => {
  try {
    const { name, description, couponCost } = req.body;
    const image = req.file ? req.file.path : "";

    const newProduct = new Product({
      name,
      description,
      couponCost: parseInt(couponCost),
      image,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// Delete a product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// Purchase a product (User) - deduct coupons
const purchaseProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.coupons < product.couponCost) {
      return res.status(400).json({
        message: "Insufficient coupons",
        required: product.couponCost,
        available: user.coupons
      });
    }

    // Deduct coupons
    user.coupons -= product.couponCost;
    await user.save();

    res.json({
      message: "Purchase successful!",
      product: product.name,
      couponsSpent: product.couponCost,
      remainingCoupons: user.coupons,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ message: "Purchase failed" });
  }
};

module.exports = { getAllProducts, addProduct, deleteProduct, purchaseProduct };
