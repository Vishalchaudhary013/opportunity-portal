import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();
  const hideLayout = ["/login", "/signup", "/forget-password" ,"/choose-signup"];
  const isAdminRoute =
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/super-admin-dashboard");

  const showNavBar = !hideLayout.includes(location.pathname) && !isAdminRoute;

  return (
    <>
      {showNavBar && <NavBar />}
      <AppRoutes />
      {!showNavBar ? null : <Footer />}
    </>
  );
};

export default App;
