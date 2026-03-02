import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, ArrowRight, ShoppingBag, Coins, CheckCircle, X, PartyPopper } from "lucide-react";
import GlassCard from "../components/common/GlassCard";
import AnimatedButton from "../components/common/AnimatedButton";
import axios from "../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [couponsBalance, setCouponsBalance] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Load cart from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);

        // Fetch coupon balance
        axios.get("/upload/stats")
            .then(res => setCouponsBalance(res.data.couponsBalance || 0))
            .catch(err => console.error("Failed to load stats:", err));
    }, []);

    const removeItem = (id) => {
        const newCart = cartItems.filter(item => item._id !== id);
        setCartItems(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const updateQuantity = (id, delta) => {
        const newCart = cartItems.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCartItems(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const total = cartItems.reduce((acc, item) => acc + (item.couponCost || 0) * item.quantity, 0);

    const handleCheckout = async () => {
        if (total > couponsBalance) {
            setError(`Insufficient coupons! You need ${total} but have ${couponsBalance}.`);
            return;
        }

        setCheckoutLoading(true);
        setError("");

        try {
            // Purchase each item
            for (const item of cartItems) {
                for (let i = 0; i < item.quantity; i++) {
                    await axios.post(`/products/purchase/${item._id}`);
                }
            }

            // Clear cart
            setCartItems([]);
            localStorage.setItem("cart", JSON.stringify([]));
            setCouponsBalance(prev => prev - total);
            setShowSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || "Checkout failed. Please try again.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowSuccess(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="bg-white rounded-3xl p-10 max-w-md mx-4 text-center shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <PartyPopper size={40} className="text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-3">
                                🌍 Congratulations!
                            </h2>
                            <p className="text-lg text-emerald-600 font-semibold mb-2">
                                You just saved the Earth a little more!
                            </p>
                            <p className="text-slate-500 mb-6">
                                Your eco-friendly products are on the way. Every purchase supports a greener planet. Keep recycling!
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Link to="/shop">
                                    <AnimatedButton variant="secondary">Continue Shopping</AnimatedButton>
                                </Link>
                                <Link to="/">
                                    <AnimatedButton>Go Home</AnimatedButton>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                    <ShoppingBag size={32} />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-800">My Cart</h1>
                    <p className="text-slate-500">Review your eco-friendly picks.</p>
                </div>
                <GlassCard className="flex items-center gap-2 px-4 py-2 !rounded-full">
                    <Coins size={18} className="text-yellow-500" />
                    <span className="font-bold text-slate-700">{couponsBalance}</span>
                    <span className="text-slate-500 text-sm">Coupons</span>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.length === 0 ? (
                        <GlassCard className="text-center py-12">
                            <p className="text-slate-500 text-lg mb-4">Your cart is empty.</p>
                            <Link to="/shop">
                                <AnimatedButton>Start Shopping</AnimatedButton>
                            </Link>
                        </GlassCard>
                    ) : (
                        cartItems.map((item) => (
                            <GlassCard key={item._id} className="flex gap-4 items-center">
                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                    <img
                                        src={item.image && item.image.startsWith("http") ? item.image : `http://localhost:5000/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                                    <p className="text-emerald-600 font-semibold flex items-center gap-1">
                                        <Coins size={14} /> {item.couponCost} Coupons
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-slate-100 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item._id, -1)}
                                            className="px-3 py-1 text-slate-600 hover:text-slate-800 font-bold"
                                        >−</button>
                                        <span className="font-semibold text-slate-700 min-w-[20px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, 1)}
                                            className="px-3 py-1 text-slate-600 hover:text-slate-800 font-bold"
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </GlassCard>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="lg:col-span-1">
                        <GlassCard className="sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-4 text-slate-600">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <span>{item.name} x{item.quantity}</span>
                                        <span>{item.couponCost * item.quantity} Coupons</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-3 mb-2">
                                <div className="flex justify-between font-bold text-slate-800 text-lg">
                                    <span>Total</span>
                                    <span className="flex items-center gap-1"><Coins size={16} /> {total} Coupons</span>
                                </div>
                                <div className={`text-sm mt-1 ${total > couponsBalance ? 'text-red-500' : 'text-emerald-600'}`}>
                                    Your balance: {couponsBalance} Coupons
                                    {total > couponsBalance && " (insufficient)"}
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-3">
                                    {error}
                                </div>
                            )}

                            <AnimatedButton
                                className="w-full flex justify-center items-center gap-2"
                                onClick={handleCheckout}
                                disabled={checkoutLoading || total > couponsBalance}
                            >
                                {checkoutLoading ? "Processing..." : <>Checkout <ArrowRight size={18} /></>}
                            </AnimatedButton>
                        </GlassCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
