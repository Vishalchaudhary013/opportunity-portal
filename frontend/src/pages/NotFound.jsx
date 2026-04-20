import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
    
      <div className="w-350 max-w-[95%] mx-auto py-16">
        <div className="bg-white border border-black/10 rounded-2xl p-8 md:p-12 text-center">
          <p className="text-slate-500 text-sm font-semibold tracking-widest mb-3">
            ERROR 404
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            The page you are trying to access does not exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
