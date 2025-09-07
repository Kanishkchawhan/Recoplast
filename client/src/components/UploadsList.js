import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const UploadsList = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        // For demo, fetch all uploads (no auth)
        const res = await axios.get("/upload/admin/all-uploads");
        setUploads(res.data);
      } catch (err) {
        console.error("Failed to fetch uploads", err);
      }
    };
    fetchUploads();
  }, []);

  if (!uploads.length)
    return (
      <div className="text-center text-gray-500 py-8">No uploads yet.</div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-12 p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Gallery</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {uploads.map((upload) => (
          <div
            key={upload._id}
            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Weight:</span>
              <span>{upload.weightInKg} kg</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Location:</span>
              <span>{upload.location}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Pickup:</span>
              <span>
                {upload.pickupDate || "-"} @ {upload.pickupTime || "-"}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Status:</span>
              <span
                className={`px-2 py-1 rounded text-sm font-semibold ${
                  upload.pickupStatus === "Completed"
                    ? "bg-green-200 text-green-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {upload.pickupStatus || "Pending"}
              </span>
            </div>
            {upload.rewardCoupon && (
              <div className="mt-2 text-sm text-green-700">
                🎉 Reward: <strong>{upload.rewardCoupon}</strong>
              </div>
            )}
            {upload.imagePath && (
              <div className="mt-4">
                <img
                  src={`http://localhost:5000/${upload.imagePath.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="Uploaded"
                  className="h-40 w-full object-cover rounded"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadsList;
