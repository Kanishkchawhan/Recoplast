const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number, // or String if you're using something like "20 Coins"
  image: String, // Path to image (e.g., "uploads/product1.png")
});

module.exports = mongoose.model("Product", productSchema);
