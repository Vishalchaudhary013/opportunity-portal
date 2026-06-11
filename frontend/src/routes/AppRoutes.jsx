import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import GlobalProgramPage from "../pages/GlobalProgramPage";
import InternshipPage from "../pages/InternshipPage";
import InternshipDetailsPage from "../pages/InternshipDetailsPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgetPassword from "../pages/auth/ForgetPassword";

import ProfilePage from "../pages/ProfilePage";
import FavoritesPage from "../pages/FavoritesPage";

import AdminDashboard from "../pages/AdminDashboard";
import AdminOpportunityFormPage from "../pages/AdminOpportunityFormPage";
import ApplicationFormBuilderPage from "../pages/ApplicationFormBuilderPage";
import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/intership" element={<InternshipPage />} />
      <Route path="/internship" element={<InternshipPage />} />
      <Route path="/intership/:id" element={<InternshipDetailsPage />} />
      <Route path="/internship/:id" element={<InternshipDetailsPage />} />
      <Route path="/global-program" element={<GlobalProgramPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forget-password" element={<ForgetPassword />} />

      {/* Protected Routes (Any logged in user) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/create-internship" element={<AdminOpportunityFormPage />} />
        <Route path="/admin-dashboard/create-global-program" element={<AdminOpportunityFormPage />} />
        <Route path="/admin-dashboard/edit-opportunity/:id" element={<AdminOpportunityFormPage />} />
        <Route path="/admin-dashboard/build-form/:id" element={<ApplicationFormBuilderPage />} />
      </Route>

      {/* Super Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
        <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
        <Route path="/super-admin-dashboard/create-internship" element={<AdminOpportunityFormPage />} />
        <Route path="/super-admin-dashboard/create-global-program" element={<AdminOpportunityFormPage />} />
        <Route path="/super-admin-dashboard/edit-opportunity/:id" element={<AdminOpportunityFormPage />} />
        <Route path="/super-admin-dashboard/build-form/:id" element={<ApplicationFormBuilderPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
