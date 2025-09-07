// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import ShopPage from "./pages/ShopPage";
import UploadsList from "./components/UploadsList";
import AdminDashboard from "./components/AdminDashboard";
import MyUploads from "./pages/MyUploads";
import PickupStatusPage from "./pages/PickupStatusPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Helper for protected routes
function RequireAuth({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <HomePage />
                </RequireAuth>
              }
            />
            <Route
              path="/upload"
              element={
                <RequireAuth>
                  <UploadPage />
                </RequireAuth>
              }
            />
            <Route
              path="/shop"
              element={
                <RequireAuth>
                  <ShopPage />
                </RequireAuth>
              }
            />
            <Route
              path="/gallery"
              element={
                <RequireAuth>
                  <UploadsList />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/my-uploads"
              element={
                <RequireAuth>
                  <MyUploads />
                </RequireAuth>
              }
            />
            <Route
              path="/pickup-status"
              element={
                <RequireAuth>
                  <PickupStatusPage />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
