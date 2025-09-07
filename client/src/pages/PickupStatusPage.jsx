import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import PickupStatus from "../components/PickupStatus";

const PickupStatusPage = () => {
  const [uploads, setUploads] = useState([]);
  const username = "Ram"; // Hardcoded for demo, replace with dynamic if needed

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await axios.get(`/upload/${username}`);
        setUploads(res.data);
      } catch (err) {
        setUploads([]);
      }
    };
    fetchUploads();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Pickup Status</h1>
        {uploads.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No pickups found.</div>
        ) : (
          <div className="space-y-6">
            {uploads.map((upload) => (
              <div key={upload._id} className="border rounded-xl p-4 shadow bg-green-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-semibold text-lg text-green-800 mb-1">{upload.location}</div>
                    <div className="text-gray-700 text-sm mb-2">Weight: {upload.weightInKg} kg</div>
                    <PickupStatus upload={upload} />
                  </div>
                  {upload.imagePath && (
                    <img
                      src={`http://localhost:5000/${upload.imagePath.replace(/\\/g, "/")}`}
                      alt="Plastic"
                      className="w-32 h-32 object-cover rounded-xl border"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupStatusPage;
