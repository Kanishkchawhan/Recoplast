import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { ShoppingCart, Plus, Tag, Coins } from "lucide-react";
import GlassCard from "../components/common/GlassCard";
import AnimatedButton from "../components/common/AnimatedButton";

const ProductCard = ({ product, onAdd }) => (
  <GlassCard hoverEffect className="flex flex-col h-full overflow-hidden p-0">
    <div className="h-48 overflow-hidden relative group">
      <img
        src={product.image.startsWith("http") ? product.image : `http://localhost:5000/${product.image}`}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-emerald-600 shadow-sm flex items-center gap-1">
        <Tag size={12} /> {product.couponCost} Coupons
      </div>
    </div>

    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-lg font-bold text-slate-800 mb-1">{product.name}</h3>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>

      <div className="mt-auto">
        <AnimatedButton
          variant="secondary"
          onClick={() => onAdd(product)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm"
        >
          <Plus size={16} /> Add to Cart
        </AnimatedButton>
      </div>
    </div>
  </GlassCard>
);

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [couponsBalance, setCouponsBalance] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to load products:", err));

    // Fetch user's coupon balance
    axios.get("/upload/stats")
      .then((res) => setCouponsBalance(res.data.couponsBalance || 0))
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Please login first!");
      return;
    }
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex(item => item._id === product._id);

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Eco Shop</h1>
          <p className="text-slate-500">Redeem your hard-earned coupons for sustainable goods.</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Coupon Balance */}
          <GlassCard className="flex items-center gap-2 px-4 py-2 !rounded-full">
            <Coins size={20} className="text-yellow-500" />
            <span className="font-bold text-slate-700">{couponsBalance}</span>
            <span className="text-slate-500 text-sm hidden sm:block">Coupons</span>
          </GlassCard>

          {/* Cart Link */}
          <Link to="/cart">
            <GlassCard className="flex items-center gap-2 px-4 py-2 !rounded-full cursor-pointer hover:bg-emerald-50 transition">
              <ShoppingCart size={20} className="text-emerald-600" />
              <span className="font-semibold text-slate-700 hidden sm:block">My Cart</span>
            </GlassCard>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onAdd={handleAddToCart} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            No products available at the moment. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
