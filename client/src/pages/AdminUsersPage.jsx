import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Loader, User, Shield, Coins } from "lucide-react";

const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
};

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("/auth/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
                setError("Failed to load users. Please check browser console.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric"
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Manage Users</h1>

            {error && (
                <div className="bg-red-500/20 text-red-300 p-4 rounded-xl">
                    {error}
                </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Coupons</th>
                                <th className="p-4 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader className="animate-spin" size={20} /> Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">
                                                    {getInitials(user.name)}
                                                </div>
                                                <span className="font-medium text-slate-200">{user.name || "Unnamed"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                                                ? "bg-purple-500/20 text-purple-300"
                                                : "bg-blue-500/20 text-blue-300"
                                                }`}>
                                                {user.role === 'admin' && <Shield size={12} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-yellow-300 font-semibold">
                                                <Coins size={14} /> {user.coupons || 0}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {formatDate(user.createdAt)}
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

export default AdminUsersPage;
