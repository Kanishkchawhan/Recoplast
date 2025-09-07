import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import CouponStatus from "../components/CouponStatus";

const MyUploads = () => {
  const [uploads, setUploads] = useState([]);
  const username = "Ram"; // Hardcoded for demo

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await axios.get(`/upload/${username}`);
        setUploads(res.data);
      } catch (err) {
        console.error("Error fetching uploads:", err);
      }
    };
    fetchUploads();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-green-700">My Plastic Uploads</h2>
      <CouponStatus />
      {uploads.length === 0 ? (
        <p className="text-center text-gray-600">No uploads yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploads.map((upload) => (
            <div key={upload._id} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src={`http://localhost:5000/${upload.imagePath}`}
                alt="Plastic"
                className="w-full h-52 object-cover"
              />
              <div className="p-4 space-y-2">
                <p><span className="font-semibold">Weight:</span> {upload.weightInKg} kg</p>
                <p><span className="font-semibold">Location:</span> {upload.location}</p>
                {upload.pickupDate && (
                  <p><span className="font-semibold">Pickup:</span> {upload.pickupDate.slice(0, 10)} at {upload.pickupTime}</p>
                )}
                <p><span className="font-semibold">Status:</span> {upload.pickupStatus || "Pending"}</p>
                {upload.rewardCoupon && (
                  <p className="text-green-600 font-semibold">{upload.rewardCoupon}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
