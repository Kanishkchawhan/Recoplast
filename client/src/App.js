// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import ShopPage from "./pages/ShopPage";
import MyUploads from "./pages/MyUploads";
import CartPage from "./pages/CartPage";
import PickupStatusPage from "./pages/PickupStatusPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUploadsPage from "./pages/AdminUploadsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import PageTransition from "./components/common/PageTransition";

// Helper for protected routes
function RequireAuth({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 ${isAdminRoute ? 'flex' : ''}`}>
      {!isAdminRoute && <Navbar />}

      <main className={`flex-1 ${!isAdminRoute ? 'max-w-7xl mx-auto p-4 sm:p-6 lg:p-8' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

            {/* User Routes */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <PageTransition><HomePage /></PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/upload"
              element={
                <RequireAuth>
                  <PageTransition><UploadPage /></PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/shop"
              element={
                <RequireAuth>
                  <PageTransition><ShopPage /></PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/my-uploads"
              element={
                <RequireAuth>
                  <PageTransition><MyUploads /></PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <PageTransition><CartPage /></PageTransition>
                </RequireAuth>
              }
            />
            <Route
              path="/pickup-status"
              element={
                <RequireAuth>
                  <PageTransition><PickupStatusPage /></PageTransition>
                </RequireAuth>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <RequireAuth role="admin">
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="uploads" element={<AdminUploadsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
