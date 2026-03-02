import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Users, Upload, Clock, CheckCircle, XCircle, FileCheck } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl flex items-center gap-4">
        <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalUploads: 0,
        pendingUploads: 0,
        approvedUploads: 0,
        completedPickups: 0,
        rejectedUploads: 0,
        recentUploads: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("/upload/admin/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short", day: "numeric",
            hour: "numeric", minute: "2-digit",
            hour12: true
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={loading ? "..." : stats.totalUsers}
                    icon={Users}
                    color={{ bg: "bg-blue-500/20", text: "text-blue-400" }}
                />
                <StatCard
                    title="Total Uploads"
                    value={loading ? "..." : stats.totalUploads}
                    icon={Upload}
                    color={{ bg: "bg-emerald-500/20", text: "text-emerald-400" }}
                />
                <StatCard
                    title="Pending Requests"
                    value={loading ? "..." : stats.pendingUploads}
                    icon={Clock}
                    color={{ bg: "bg-yellow-500/20", text: "text-yellow-400" }}
                />
                <StatCard
                    title="Completed Pickups"
                    value={loading ? "..." : stats.completedPickups}
                    icon={CheckCircle}
                    color={{ bg: "bg-purple-500/20", text: "text-purple-400" }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                {/* Recent Activity */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                    {stats.recentUploads && stats.recentUploads.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentUploads.map((upload) => (
                                <div key={upload._id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl">
                                    <div className={`p-2 rounded-lg ${upload.status === 'pickedUp' ? 'bg-emerald-500/20 text-emerald-400' :
                                            upload.status === 'Approved' ? 'bg-blue-500/20 text-blue-400' :
                                                upload.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {upload.status === 'pickedUp' ? <CheckCircle size={16} /> :
                                            upload.status === 'Rejected' ? <XCircle size={16} /> :
                                                upload.status === 'Approved' ? <FileCheck size={16} /> :
                                                    <Clock size={16} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white font-medium">
                                            {upload.userId?.name || "User"} — {upload.weightInKg}kg
                                        </p>
                                        <p className="text-xs text-slate-400">{formatDate(upload.createdAt)}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${upload.status === 'pickedUp' ? 'bg-emerald-500/20 text-emerald-300' :
                                            upload.status === 'Approved' ? 'bg-blue-500/20 text-blue-300' :
                                                upload.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                                                    'bg-yellow-500/20 text-yellow-300'
                                        }`}>
                                        {upload.status || "Pending"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-slate-400 text-center py-8 border-t border-slate-700/50">
                            No recent activity yet.
                        </div>
                    )}
                </div>

                {/* System Health + Quick Stats */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                            <span className="text-slate-300">Approved (Awaiting Pickup)</span>
                            <span className="font-bold text-blue-400">{stats.approvedUploads}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                            <span className="text-slate-300">Rejected</span>
                            <span className="font-bold text-red-400">{stats.rejectedUploads}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                            <span className="text-slate-300">Completed Pickups</span>
                            <span className="font-bold text-emerald-400">{stats.completedPickups}</span>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 font-bold py-4 border-t border-slate-700/50">
                        <CheckCircle size={20} />
                        All Systems Operational
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
