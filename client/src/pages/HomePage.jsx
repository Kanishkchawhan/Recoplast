import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Upload, ShoppingBag, Truck, ArrowRight, Leaf, Coins, UploadCloud } from "lucide-react";
import GlassCard from "../components/common/GlassCard";
import AnimatedButton from "../components/common/AnimatedButton";
import axios from "../utils/axiosInstance";

const DashboardStat = ({ icon: Icon, label, value, color }) => (
  <GlassCard className="flex items-center gap-4 border-l-4" style={{ borderLeftColor: color }}>
    <div className={`p-3 rounded-full bg-opacity-20`} style={{ backgroundColor: color + '20' }}>
      <Icon className="w-6 h-6" style={{ color: color }} />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </GlassCard>
);

const ActionCard = ({ to, title, desc, icon: Icon, gradient }) => (
  <Link to={to} className="block group h-full">
    <GlassCard hoverEffect className="h-full relative overflow-hidden flex flex-col justify-between">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${gradient} rounded-bl-3xl`}>
        <Icon size={64} />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 shadow-lg`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-4">{desc}</p>
        <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
          Get Started <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </GlassCard>
  </Link>
);

const HomePage = () => {
  const [stats, setStats] = useState({
    totalWeight: 0,
    couponsBalance: 0,
    totalUploads: 0
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/upload/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Hello, {user ? user.name : "Eco-Warrior"}! 👋
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Ready to make the planet greener today?
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm text-slate-400">Current Impact</p>
          <div className="flex items-center justify-end gap-2">
            <span className="text-xl font-bold text-emerald-600">
              {stats.totalWeight >= 50 ? "🌳 Eco Champion" :
                stats.totalWeight >= 20 ? "🌿 Green Warrior" :
                  stats.totalWeight >= 5 ? "🌱 Rising Recycler" : "🌱 Getting Started"
              }
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardStat
          icon={Leaf}
          label="Total Recycled"
          value={`${stats.totalWeight} kg`}
          color="#10b981"
        />
        <DashboardStat
          icon={Coins}
          label="Coupon Balance"
          value={`${stats.couponsBalance} Coupons`}
          color="#eab308"
        />
        <DashboardStat
          icon={UploadCloud}
          label="Total Uploads"
          value={stats.totalUploads}
          color="#3b82f6"
        />
      </div>

      {/* Main Actions */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            to="/upload"
            title="Upload Waste"
            desc="Submit photos of your plastic waste to schedule a pickup."
            icon={Upload}
            gradient="from-emerald-400 to-emerald-600"
          />
          <ActionCard
            to="/shop"
            title="Redeem Rewards"
            desc="Use your earned coupons to get eco-friendly products."
            icon={ShoppingBag}
            gradient="from-teal-400 to-teal-600"
          />
          <ActionCard
            to="/pickup-status"
            title="Track Pickups"
            desc="Monitor the status of your scheduled pickups in real-time."
            icon={Truck}
            gradient="from-blue-400 to-blue-600"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
