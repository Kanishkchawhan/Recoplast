import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "/icons/upload.png",
    title: "Upload Waste",
    desc: "Capture and submit your plastic waste images with details.",
  },
  {
    icon: "/icons/reward.png",
    title: "Earn Coupons",
    desc: "Receive reward coupons based on the weight you submit.",
  },
  {
    icon: "/icons/shop.png",
    title: "Shop Eco Products",
    desc: "Use your rewards to purchase recycled plastic products.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl md:text-6xl font-extrabold text-green-700 mb-6 drop-shadow-lg">
        Welcome to RECOPLAST
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-10 font-medium">
        RECOPLAST is your eco-friendly partner to reduce plastic waste. Upload
        plastic waste photos, schedule pickups, earn coupons, and shop eco
        products — all in one place.
      </p>
      <div className="flex gap-6 flex-wrap justify-center mb-10">
        <Link
          to="/upload"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 text-xl font-semibold"
        >
          Upload Plastic
        </Link>
        <Link
          to="/shop"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 text-xl font-semibold"
        >
          Visit Shop
        </Link>
        <Link
          to="/gallery"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 text-xl font-semibold"
        >
          View Uploads
        </Link>
      </div>
      <section className="py-12 px-6 bg-white rounded-2xl shadow-xl w-full max-w-5xl mb-10">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col items-center">
              <img
                src={f.icon}
                alt={f.title}
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                {f.title}
              </h3>
              <p className="text-base text-gray-600 font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="mt-10 text-sm text-gray-600">
        © {new Date().getFullYear()} RECOPLAST. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
