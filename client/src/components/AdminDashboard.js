import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const AdminDashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUploads = async () => {
    try {
      const res = await axios.get("/upload/admin/all-uploads");
      setUploads(res.data);
    } catch (err) {
      console.error("Failed to fetch uploads", err);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      await axios.put(`/upload/admin/approve-reject/${id}`, { action });
      await fetchUploads();
    } catch (err) {
      alert("Failed to update status");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 p-8">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Admin Dashboard
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr className="bg-green-200 text-green-900">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Weight (kg)</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Pickup Date</th>
              <th className="py-3 px-4">Pickup Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Reward</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr
                key={upload._id}
                className="border-b hover:bg-green-50 transition"
              >
                <td className="py-2 px-4">{upload.username}</td>
                <td className="py-2 px-4">{upload.weightInKg}</td>
                <td className="py-2 px-4">{upload.location}</td>
                <td className="py-2 px-4">{upload.pickupDate || "-"}</td>
                <td className="py-2 px-4">{upload.pickupTime || "-"}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      upload.pickupStatus === "Completed"
                        ? "bg-green-200 text-green-700"
                        : upload.pickupStatus === "Approved"
                        ? "bg-blue-200 text-blue-700"
                        : upload.pickupStatus === "Rejected"
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {upload.pickupStatus || "Pending"}
                  </span>
                </td>
                <td className="py-2 px-4 text-green-700 font-bold">
                  {upload.rewardCoupon || "-"}
                </td>
                <td className="py-2 px-4">
                  {upload.imagePath && (
                    <img
                      src={`http://localhost:5000/${upload.imagePath.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Upload"
                      className="h-16 w-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                      disabled={
                        loading || upload.pickupStatus === "Approved"
                      }
                      onClick={() => handleAction(upload._id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                      disabled={loading || upload.pickupStatus === "Rejected"}
                      onClick={() => handleAction(upload._id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
