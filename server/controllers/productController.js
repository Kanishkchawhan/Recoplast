const Product = require("../models/Product");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// (Optional) Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, description, image, couponCost } = req.body;
    const newProduct = new Product({ name, description, image, couponCost });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

module.exports = { getAllProducts, addProduct };
