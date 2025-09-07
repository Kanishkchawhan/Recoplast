import React, { useState } from "react";
import axios from "../utils/axiosInstance";

const UploadForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    weightInKg: "",
    location: "",
    pickupDate: "",
    pickupTime: "",
    image: null,
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [reward, setReward] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    for (let key in formData) {
      payload.append(key, formData[key]);
    }
    try {
      const res = await axios.post("/upload", payload);
      setSuccessMsg("Plastic uploaded successfully!");
      setReward(res.data.rewardCoupon);
      setFormData({
        username: "",
        weightInKg: "",
        location: "",
        pickupDate: "",
        pickupTime: "",
        image: null,
      });
    } catch (err) {
      setSuccessMsg("");
      setReward("");
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Upload Plastic Waste</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            name="weightInKg"
            type="number"
            placeholder="Weight (kg)"
            value={formData.weightInKg}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            name="location"
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            name="pickupDate"
            type="date"
            value={formData.pickupDate}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            name="pickupTime"
            type="time"
            value={formData.pickupTime}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Submit
        </button>
        {successMsg && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
            {successMsg} 🎉 <br />
            <span className="font-bold">{reward}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadForm;
