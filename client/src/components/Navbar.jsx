import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Upload, ShoppingBag, Image, Truck, LogOut, User, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/my-uploads", label: "My Uploads", icon: Image },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/cart", label: "My Cart", icon: ShoppingCart },
  { to: "/pickup-status", label: "Status", icon: Truck },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 px-4 py-3">
      <div className="glass-panel max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">♻️</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Recoplast
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 ${isActive
                  ? "text-emerald-700 font-semibold bg-emerald-50"
                  : "text-slate-600 hover:text-emerald-600 hover:bg-white/50"
                  }`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-emerald-100/50 rounded-xl -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-emerald-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center text-white font-bold">
                  {user.name ? user.name[0].toUpperCase() : <User size={16} />}
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-lg shadow-emerald-500/30 transition-all">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 z-40"
          >
            <div className="glass-panel p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${location.pathname === link.to
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-slate-100 my-2 pt-2">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 w-full hover:bg-red-50 rounded-xl"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login" className="text-center py-2 text-slate-600">Login</Link>
                    <Link to="/register" className="text-center py-2 bg-emerald-500 text-white rounded-xl">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
