import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";
import GlassCard from "../components/common/GlassCard";

const StatusTimeline = ({ status }) => {
  const steps = [
    { id: "Pending", label: "Pending", icon: Clock },
    { id: "Approved", label: "Approved", icon: CheckCircle },
    { id: "pickedUp", label: "Picked Up", icon: Truck },
  ];

  const currentStep = steps.findIndex(s => s.id === (status || "Pending"));
  const isRejected = status === "Rejected";

  if (isRejected) {
    return (
      <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 p-2 rounded-lg justify-center">
        <XCircle size={20} /> Request Rejected
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between relative mt-4">
      {/* Connector Line */}
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -z-10" />

      {steps.map((step, index) => {
        const isCompleted = index <= currentStep;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex flex-col items-center gap-1 bg-white px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300 text-slate-300"
              }`}>
              <Icon size={14} />
            </div>
            <span className={`text-xs font-medium ${isCompleted ? "text-emerald-600" : "text-slate-400"}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const PickupStatusPage = () => {
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

  if (!user) return <div className="text-center p-10">Please log in to view status.</div>;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">Tracking Board</h1>
        <p className="text-slate-500 mt-2">Real-time updates on your pickup requests.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : uploads.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-slate-500">No active pickup requests.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {uploads.map((upload) => (
            <GlassCard key={upload._id} className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src={upload.imagePath ? (upload.imagePath.startsWith("http") ? upload.imagePath : `http://localhost:5000/${upload.imagePath}`) : "https://via.placeholder.com/150"}
                alt="Upload"
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800">{upload.location}</h3>
                    <p className="text-sm text-slate-500">{new Date(upload.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{upload.weightInKg} kg</span>
                </div>

                <StatusTimeline status={upload.status} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default PickupStatusPage;
