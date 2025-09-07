import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const CouponStatus = () => {
  const [coupons, setCoupons] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    axios.get(`/upload/${user.name || user.username || user.email}`)
      .then(res => {
        const rewards = res.data.filter(u => u.rewardCoupon).map(u => u.rewardCoupon);
        setCoupons(rewards);
      });
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-green-700">Your Coupons</h2>
      {coupons.length === 0 ? (
        <div className="text-gray-500">No coupons earned yet.</div>
      ) : (
        <ul className="space-y-2">
          {coupons.map((coupon, idx) => (
            <li key={idx} className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
              {coupon}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CouponStatus;
