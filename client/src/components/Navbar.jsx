import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/upload", label: "Upload" },
  { to: "/my-uploads", label: "My Uploads" },
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/pickup-status", label: "Pickup Status" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-green-800 via-green-600 to-green-500 shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-extrabold tracking-wide text-white flex items-center gap-2 drop-shadow-lg hover:scale-105 transition-transform">
          <span className="inline-block bg-white text-green-700 rounded-full px-3 py-1 mr-2 shadow-lg hover:shadow-xl transition-all">♻️</span>
          RECOPLAST
        </Link>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:bg-white hover:text-green-700 hover:shadow-lg transform hover:-translate-y-0.5 ${
                location.pathname === link.to 
                  ? "bg-white text-green-700 shadow-lg" 
                  : "text-white hover:ring-2 hover:ring-white hover:ring-opacity-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:bg-white hover:text-green-700 hover:shadow-lg transform hover:-translate-y-0.5 ${
                location.pathname === "/admin"
                  ? "bg-white text-green-700 shadow-lg" 
                  : "text-white hover:ring-2 hover:ring-white hover:ring-opacity-50"
              }`}
            >
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <>
              <span className="text-white font-semibold ml-2">{user.name || user.email}</span>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className={`px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:bg-white hover:text-green-700 hover:shadow-md ${
                  location.pathname === "/login" ? "bg-white text-green-700 shadow" : "text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className={`px-3 py-2 rounded-xl font-semibold transition-all duration-200 hover:bg-white hover:text-green-700 hover:shadow-md ${
                  location.pathname === "/register" ? "bg-white text-green-700 shadow" : "text-white"
                }`}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
