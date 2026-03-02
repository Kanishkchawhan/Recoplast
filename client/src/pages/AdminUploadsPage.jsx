import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import AnimatedButton from "../components/common/AnimatedButton";
import { Check, X, Eye, Loader, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminUploadsPage = () => {
    const [uploads, setUploads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUpload, setSelectedUpload] = useState(null);

    const fetchUploads = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/upload/admin/all-uploads");
            setUploads(res.data);
        } catch (err) {
            console.error("Failed to fetch uploads", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploads();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            if (status === 'Approved' || status === 'Rejected') {
                const action = status === 'Approved' ? 'approve' : 'reject';
                await axios.put(`/upload/admin/approve-reject/${id}`, { action });
            } else if (status === 'pickedUp') {
                await axios.put(`/upload/pickup/${id}`, {
                    status: 'pickedUp',
                    pickupDate: new Date().toISOString(),
                    pickupTime: new Date().toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                    })
                });
            }
            // Refresh data from server to get updated couponsAwarded
            fetchUploads();
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-500/20 text-yellow-300";
            case "Approved": return "bg-blue-500/20 text-blue-300";
            case "Rejected": return "bg-red-500/20 text-red-300";
            case "pickedUp": return "bg-emerald-500/20 text-emerald-300";
            default: return "bg-slate-700 text-slate-300";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";
        // If it's already in AM/PM format, return as is
        if (timeString.includes("AM") || timeString.includes("PM")) return timeString;
        // Try to parse as time
        try {
            const [hours, minutes] = timeString.split(":");
            const h = parseInt(hours);
            const m = minutes || "00";
            const period = h >= 12 ? "PM" : "AM";
            const h12 = h % 12 || 12;
            return `${h12}:${m} ${period}`;
        } catch {
            return timeString;
        }
    };

    return (
        <div className="space-y-6">
            {/* Upload Detail Modal */}
            <AnimatePresence>
                {selectedUpload && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedUpload(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Upload Details</h3>
                                <button
                                    onClick={() => setSelectedUpload(null)}
                                    className="p-1 text-slate-400 hover:text-white transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Image */}
                            <div className="rounded-xl overflow-hidden mb-4 bg-slate-700 h-56">
                                <img
                                    src={selectedUpload.imagePath ?
                                        (selectedUpload.imagePath.startsWith("http") ? selectedUpload.imagePath : `http://localhost:5000/${selectedUpload.imagePath}`)
                                        : "https://via.placeholder.com/400"}
                                    alt="Upload"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">User</span>
                                    <span className="text-white font-medium">{selectedUpload.userId?.name || "User"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Email</span>
                                    <span className="text-white font-medium">{selectedUpload.userId?.email || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Weight</span>
                                    <span className="text-white font-bold">{selectedUpload.weightInKg} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Location</span>
                                    <span className="text-white font-medium truncate max-w-[200px]">{selectedUpload.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedUpload.status)}`}>
                                        {selectedUpload.status || "Pending"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Submitted</span>
                                    <span className="text-white">{formatDate(selectedUpload.createdAt)}</span>
                                </div>
                                {selectedUpload.pickupDate && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Picked Up</span>
                                        <span className="text-white">{formatDate(selectedUpload.pickupDate)} {formatTime(selectedUpload.pickupTime)}</span>
                                    </div>
                                )}
                                {selectedUpload.couponsAwarded > 0 && (
                                    <div className="flex justify-between items-center mt-2 p-3 bg-emerald-500/10 rounded-xl">
                                        <span className="text-emerald-400 flex items-center gap-2">
                                            <Coins size={16} /> Coupons Awarded
                                        </span>
                                        <span className="text-emerald-300 font-bold text-lg">{selectedUpload.couponsAwarded}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Uploads</h1>
                <AnimatedButton onClick={fetchUploads} size="sm" variant="secondary">
                    Refresh
                </AnimatedButton>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Image</th>
                                <th className="p-4 font-medium">Weight</th>
                                <th className="p-4 font-medium">Location</th>
                                <th className="p-4 font-medium">Pickup</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader className="animate-spin" size={20} /> Loading uploads...
                                        </div>
                                    </td>
                                </tr>
                            ) : uploads.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        No uploads found.
                                    </td>
                                </tr>
                            ) : (
                                uploads.map((upload) => (
                                    <tr key={upload._id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-medium text-slate-200">
                                            {upload.userId?.name || "User"}
                                        </td>
                                        <td className="p-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 border border-slate-600">
                                                <img
                                                    src={upload.imagePath ? (upload.imagePath.startsWith("http") ? upload.imagePath : `http://localhost:5000/${upload.imagePath}`) : "https://via.placeholder.com/50"}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{upload.weightInKg} kg</td>
                                        <td className="p-4 text-slate-300 truncate max-w-[150px]" title={upload.location}>{upload.location}</td>
                                        <td className="p-4 text-slate-300 text-sm">
                                            <div className="flex flex-col">
                                                <span>{formatDate(upload.pickupDate)}</span>
                                                <span className="text-xs text-slate-500">{formatTime(upload.pickupTime)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(upload.status)}`}>
                                                {upload.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {(!upload.status || upload.status === 'Pending') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(upload._id, 'Approved')}
                                                            className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition"
                                                            title="Approve"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(upload._id, 'Rejected')}
                                                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                                                            title="Reject"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {upload.status === 'Approved' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(upload._id, 'pickedUp')}
                                                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 text-xs font-bold transition"
                                                    >
                                                        Mark Picked Up
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedUpload(upload)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUploadsPage;
