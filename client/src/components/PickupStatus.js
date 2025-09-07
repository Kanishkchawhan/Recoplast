import React from "react";

const PickupStatus = ({ upload }) => {
  return (
    <div className="mt-4 text-sm text-gray-700">
      <p>
        <strong>Pickup Status:</strong>{" "}
        <span
          className={`font-semibold ${
            upload.pickupStatus === "Completed" ? "text-green-600" : "text-orange-500"
          }`}
        >
          {upload.pickupStatus || "Pending"}
        </span>
      </p>
      {upload.pickupDate && (
        <p>
          <strong>Date:</strong> {new Date(upload.pickupDate).toLocaleDateString()}
        </p>
      )}
      {upload.pickupTime && (
        <p>
          <strong>Time:</strong> {upload.pickupTime}
        </p>
      )}
    </div>
  );
};

export default PickupStatus;
