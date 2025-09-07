import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import Cart from "../components/Cart";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      setCheckoutMsg("Please login to add items to cart.");
      return;
    }
    setCart((prev) => [...prev, product]);
    setCheckoutMsg("");
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const handleCheckout = () => {
    if (!user) {
      setCheckoutMsg("Please login to checkout.");
      return;
    }
    // For demo: just clear cart and show message
    setCart([]);
    setCheckoutMsg("Checkout successful! Your order will be processed.");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 relative">
      <h1 className="text-3xl font-bold text-center mb-10">♻️ Shop Recycled Products</h1>
      {checkoutMsg && <div className="text-center text-green-700 font-semibold mb-4">{checkoutMsg}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition duration-300"
          >
            <img
              src={product.image.startsWith("http") ? product.image : `http://localhost:5000/${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            <div className="text-green-600 font-bold mt-3 mb-4">Coupon Cost: {product.couponCost}</div>
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition duration-300"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <Cart cart={cart} onCheckout={handleCheckout} onRemove={handleRemove} />
    </div>
  );
};

export default ShopPage;
