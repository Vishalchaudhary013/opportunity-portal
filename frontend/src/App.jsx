import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";

import GlobalProgramPage from "./pages/GlobalProgramPage";
import InternshipPage from "./pages/InternshipPage";
import InternshipDetailsPage from "./pages/InternshipDetailsPage";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminOpportunityFormPage from "./pages/AdminOpportunityFormPage";
import NotFound from "./pages/NotFound";
import ForgetPassword from "./components/auth/ForgetPassword";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import ApplicationFormBuilderPage from "./pages/ApplicationFormBuilderPage";

const App = () => {
   const location = useLocation();
  const hideLayout = ["/login", "/signup", "/forget-password"];
  const isAdminRoute =
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/super-admin-dashboard");

  const showNavBar = !hideLayout.includes(location.pathname) && !isAdminRoute;

  return (
    <>
     {showNavBar && <NavBar />}
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intership" element={<InternshipPage />} />
        <Route path="/internship" element={<InternshipPage />} />
        <Route path="/intership/:id" element={<InternshipDetailsPage />} />
        <Route path="/internship/:id" element={<InternshipDetailsPage />} />
        <Route path="/global-program" element={<GlobalProgramPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route
          path="/admin-dashboard/create-internship"
          element={<AdminOpportunityFormPage />}
        />
        <Route
          path="/admin-dashboard/create-global-program"
          element={<AdminOpportunityFormPage />}
        />
        <Route
          path="/admin-dashboard/edit-opportunity/:id"
          element={<AdminOpportunityFormPage />}
        />
        <Route
          path="/super-admin-dashboard/create-internship"
          element={<AdminOpportunityFormPage />}
        />
        <Route
          path="/super-admin-dashboard/create-global-program"
          element={<AdminOpportunityFormPage />}
        />
        <Route
          path="/super-admin-dashboard/edit-opportunity/:id"
          element={<AdminOpportunityFormPage />}
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/super-admin-dashboard"
          element={<SuperAdminDashboard />}
        />
        <Route
          path="/admin-dashboard/build-form/:id"
          element={<ApplicationFormBuilderPage />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
     {!showNavBar ? null : <Footer />}


    </>
  );
};

export default App;
