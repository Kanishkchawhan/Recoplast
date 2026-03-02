import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Check, MapPin, Calendar, Clock, Weight } from "lucide-react";
import GlassCard from "../components/common/GlassCard";
import AnimatedButton from "../components/common/AnimatedButton";

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    weightInKg: "",
    location: "",
    pickupDate: "",
    pickupTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("image", file);
    data.append("weightInKg", formData.weightInKg);
    data.append("location", formData.location);
    data.append("pickupDate", formData.pickupDate);
    data.append("pickupTime", formData.pickupTime);

    try {
      await axios.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
      setTimeout(() => navigate("/my-uploads"), 2000);
    } catch (err) {
      setError("Failed to upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800">Schedule a Pickup</h1>
        <p className="text-slate-500 mt-2">Upload details of your plastic waste and we'll collect it.</p>
      </motion.div>

      <GlassCard className="max-w-2xl mx-auto">
        {success ? (
          <div className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600"
            >
              <Check size={40} />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-800">Upload Successful!</h2>
            <p className="text-slate-500 mt-2">Redirecting to your uploads...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Zone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Waste Image</label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-emerald-500 transition-colors bg-slate-50/50 text-center cursor-pointer group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                {preview ? (
                  <div className="relative w-full h-64 rounded-xl overflow-hidden">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                        setPreview("");
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-red-50"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <UploadCloud size={48} className="mb-4" />
                    <p className="font-medium">Click or Drag to Upload Image</p>
                    <p className="text-sm mt-1">Supports JPG, PNG</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Weight size={16} /> Est. Weight (kg)
                </label>
                <input
                  type="number"
                  name="weightInKg"
                  required
                  min="0.1"
                  step="0.1"
                  className="input-field"
                  placeholder="e.g. 5.5"
                  value={formData.weightInKg}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin size={16} /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  className="input-field"
                  placeholder="Street, Area, City"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Calendar size={16} /> Preferred Date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  required
                  className="input-field"
                  value={formData.pickupDate}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Clock size={16} /> Preferred Time
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  required
                  className="input-field"
                  value={formData.pickupTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <AnimatedButton type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2">
              {loading ? "Scheduling..." : "Confirm Pickup Request"}
            </AnimatedButton>
          </form>
        )}
      </GlassCard>
    </div>
  );
};

export default UploadPage;
