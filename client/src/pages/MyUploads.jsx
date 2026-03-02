import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Calendar, MapPin, Weight, Clock, Activity } from "lucide-react";
import GlassCard from "../components/common/GlassCard";
import { motion } from "framer-motion";

const StatusBadge = ({ status }) => {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-blue-100 text-blue-700",
    pickedUp: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[status] || colors.Pending}`}>
      {status || "Pending"}
    </span>
  );
};

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUploads = async () => {
      if (!user) return;
      try {
        const res = await axios.get("/upload/my-uploads");
        setUploads(res.data);
      } catch (err) {
        console.error("Error fetching uploads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return <div className="text-center p-10">Please log in to view uploads.</div>;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">My Contributions</h1>
        <p className="text-slate-500 mt-2">Track your impact and pickup status.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : uploads.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-slate-500">You haven't uploaded any waste details yet.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploads.map((upload, index) => (
            <motion.div
              key={upload._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="h-full flex flex-col p-0 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={upload.imagePath ? (upload.imagePath.startsWith("http") ? upload.imagePath : `http://localhost:5000/${upload.imagePath}`) : "https://via.placeholder.com/300"}
                    alt="Upload"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={upload.status} />
                  </div>
                </div>

                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Weight size={18} className="text-emerald-500" />
                    <span className="font-semibold">{upload.weightInKg} kg</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-500 text-sm">
                    <MapPin size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{upload.location}</span>
                  </div>

                  {upload.pickupDate && (
                    <div className="flex items-center gap-4 text-xs text-slate-400 border-t pt-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(upload.pickupDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {upload.pickupTime}
                      </div>
                    </div>
                  )}

                  {upload.adminComment && (
                    <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 mt-2">
                      <span className="font-bold text-slate-800">Admin Note:</span> {upload.adminComment}
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
