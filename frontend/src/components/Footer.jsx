import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <>
      <div className="bg-[#F8FAFC]">
        <div className="w-full max-w-350 mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mb-8 sm:mb-10">
            <div>
              <Link to="/" className="flex items-center gap-1 mb-5">
                
                <span className="text-2xl font-medium">edeco</span>
              </Link>

              <p className="max-w-xl text-[15px] font-medium text-black/55">
                Connecting students with global opportunities and
                career-defining internships.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ul className="space-y-3">
                <li className="font-medium mb-5">Platform</li>
                <li className="text-black/55">Internships</li>
                <li className="text-black/55">Global Programs</li>
              </ul>
              <ul className="space-y-3">
                <li className="font-medium mb-5">Legal</li>
                <li className="text-black/55">Privacy Policy</li>
                <li className="text-black/55">Terms of Service</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-black/55 pt-5 border-t border-black/5 text-sm sm:text-base">© 2026 Edeco. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
