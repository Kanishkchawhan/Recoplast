// src/components/CouponDisplay.js
import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance";

function CouponDisplay() {
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    const username = "Ram"; // 🔁 Replace with dynamic logic later if needed
    axios
      .get(`http://localhost:5000/api/upload/coupon/${username}`)
      .then((res) => {
        if (res.data.coupon) {
          setCoupon(res.data.coupon);
        }
      })
      .catch((err) => {
        console.error("Error fetching coupon:", err);
      });
  }, []);

  if (!coupon) return null;

  return (
    <div className="bg-gradient-to-r from-green-200 to-green-100 border border-green-400 text-green-900 px-6 py-4 rounded-2xl shadow-md mb-6 max-w-xl mx-auto text-center">
      <p className="text-lg font-semibold">
        🎁 Your Reward Coupon: <span className="text-green-700">{coupon}</span>
      </p>
    </div>
  );
}

export default CouponDisplay;
