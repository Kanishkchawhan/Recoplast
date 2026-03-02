import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import AnimatedButton from "../components/common/AnimatedButton";
import { Package, Plus, Trash2, Loader, Coins, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "", couponCost: "" });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.couponCost) {
            setError("Product name and coupon cost are required.");
            return;
        }

        setSubmitting(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("couponCost", formData.couponCost);
            if (imageFile) {
                data.append("image", imageFile);
            }

            await axios.post("/products", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setFormData({ name: "", description: "", couponCost: "" });
            setImageFile(null);
            setShowForm(false);
            fetchProducts();
        } catch (err) {
            console.error("Failed to add product:", err);
            setError(err.response?.data?.message || "Failed to add product.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await axios.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error("Failed to delete product:", err);
            alert("Failed to delete product.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Products</h1>
                <AnimatedButton onClick={() => setShowForm(!showForm)} size="sm">
                    <Plus size={16} className="mr-1" /> Add Product
                </AnimatedButton>
            </div>

            {/* Add Product Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">Add New Product</h3>
                                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            {error && (
                                <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Product Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                                        placeholder="e.g. Recycled Plastic Bucket"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Coupon Cost *</label>
                                    <input
                                        type="number"
                                        value={formData.couponCost}
                                        onChange={(e) => setFormData({ ...formData, couponCost: e.target.value })}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                                        placeholder="e.g. 100"
                                        min="1"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-slate-400 text-sm mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
                                        rows={3}
                                        placeholder="Describe the recycled product..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:text-emerald-400 file:font-semibold file:text-sm"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <AnimatedButton type="submit" className="w-full" disabled={submitting}>
                                        {submitting ? "Adding..." : "Add Product"}
                                    </AnimatedButton>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader className="animate-spin text-slate-400" size={32} />
                </div>
            ) : products.length === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-12 rounded-2xl text-center">
                    <Package size={48} className="mx-auto text-slate-500 mb-4" />
                    <p className="text-slate-400 text-lg">No products added yet.</p>
                    <p className="text-slate-500 text-sm mt-1">Click "Add Product" to create your first item.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden group">
                            <div className="h-48 overflow-hidden bg-slate-700 relative">
                                {product.image ? (
                                    <img
                                        src={product.image.startsWith("http") ? product.image : `http://localhost:5000/${product.image}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <Package size={48} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-emerald-400 flex items-center gap-1">
                                    <Coins size={12} /> {product.couponCost} Coupons
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description || "No description"}</p>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition text-sm font-medium"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;
