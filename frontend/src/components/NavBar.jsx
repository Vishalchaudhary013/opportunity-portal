import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useOpportunities } from "../context/OpportunitiesContext";
import { CiSearch } from "react-icons/ci";
const NavBar = () => {
  const [showExplore, setShowExplore] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isImpersonating } = useOpportunities();

  const isAdmin = ["admin", "super_admin"].includes(user?.role);
  // If a super admin is impersonating another admin, the dashboard link
  // should point to the admin dashboard (impersonated view). Only link
  // to the super admin dashboard when not impersonating.
  const dashboardPath =
    user?.role === "super_admin" && !isImpersonating
      ? "/super-admin-dashboard"
      : "/admin-dashboard";

  useEffect(() => {
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "hi,pa,fr,es,de,zh,ja",
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            },
            "google_translate_element"
          );
        }
      };

      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const resolveUserInitial = (user) => {
    const emailInitial = String(user?.email || "").trim().charAt(0);
    if (emailInitial) return emailInitial.toUpperCase();
    const nameInitial = String(user?.fullName || user?.name || "").trim().charAt(0);
    return nameInitial ? nameInitial.toUpperCase() : "U";
  };

  const userInitial = resolveUserInitial(user);

  return (
    <>
      <header className="top-0 fixed left-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm ">
        {showExplore && (
          <div className="fixed left-0 right-0 bottom-0 top-[144px] bg-black/40 z-40 pointer-events-none"></div>
        )}

        {/*MAIN NAVBAR  */}
        
          <div className="border-b border-black/10 py-3">

            <div className="max-w-[1400px] mx-auto px-6">
              <div className="flex justify-between items-center text-[15px]">
                <ul className="">
                  <li><Link to='/'>
                  Home
                  </Link></li>
                </ul>
                <ul className="flex items-center gap-5">
                  <li className="">EN | HINDI</li>
                  <li className="">Login</li>
                </ul>

              </div>
            </div>
           
          </div>

          <div className="max-w-[1400px] mx-auto px-6 ">

            <div className="flex items-center justify-between h-[70px]">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-[50px]">

              {/* LOGO */}
              <div
                className="flex items-center cursor-pointer select-none"
                onClick={() => {
                  setShowExplore(false);

                  if (location.pathname !== "/") {
                    navigate("/");
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                {/* STATIC BRAND */}
                <span className="text-[22px] font-extrabold text-black tracking-tight">
                  edeco
                </span>

                <span className="mx-[2px] text-[22px] font-extrabold text-black">.</span>

                {/* ROTATING WORDS */}
                <div className="edeco-rotator">
                  <div className="edeco-rotator-inner">
                    <div>Internships</div>
                    <div>Jobs</div>
                    <div>Eduversity</div>
                    <div>Global</div>
                    <div>Innovations</div>
                    <div>Events</div>
                  </div>
                </div>
              </div>




              {/*  EXPLORE DROPDOWN  */}
              <div className="flex items-center mt-0.5">
                <div
                  className="relative"
                  onMouseEnter={() => setShowExplore(true)}
                  onMouseLeave={() => setShowExplore(false)}
                >
                  {/* EXPLORE BUTTON */}
                  <button
                    className={`flex items-center gap-[10px] text-sm text-gray-700 border border-transparent px-[15px] py-6 rounded-[7px] cursor-pointer
                  hover:text-blue-600 hover:bg-blue-50
                  ${showExplore ? "text-blue-600 bg-blue-50" : ""}
                `}
                  >
                    Career Services
                    <i
                      className="bi bi-chevron-down"
                      style={{
                        fontSize: "10px",
                        WebkitTextStroke: "0.7px",
                        transform: showExplore ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    ></i>
                  </button>

                  {/* MEGA DROPDOWN */}
                  {showExplore && (
                    <div className="absolute left-[-350px] top-[58px] w-[1670px] bg-white shadow-xl border border-gray-200 z-50">

                      {/* HOVER BRIDGE (IMPORTANT – invisible) */}
                      <div className="absolute -top-[20px] left-0 w-full h-[20px]"></div>

                      <div className="grid grid-cols-5 gap-8 p-8 w-[1000px] mx-auto">

                        {/* COLUMN 1 */}
                        <div>
                          <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                            Internships & Work
                          </h4>
                          <ul className="space-y-2 text-[13px] text-gray-600">
                            <li className="hover:underline cursor-pointer">Internships</li>
                            <li className="hover:underline cursor-pointer">Work Experience</li>
                            <li className="hover:underline cursor-pointer">Campus Ambassador</li>
                            <li className="hover:underline cursor-pointer">Live Projects</li>
                          </ul>
                        </div>

                        {/* COLUMN 2 */}
                        <div>
                          <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                            Master Classes
                          </h4>
                          <ul className="space-y-2 text-[13px] text-gray-600">
                            <li className="hover:underline cursor-pointer">Technology</li>
                            <li className="hover:underline cursor-pointer">Management</li>
                            <li className="hover:underline cursor-pointer">Design</li>
                            <li className="hover:underline cursor-pointer">Marketing</li>
                          </ul>
                        </div>

                        {/* COLUMN 3 */}
                        <div>
                          <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                            Postgraduate Programs
                          </h4>
                          <ul className="space-y-2 text-[13px] text-gray-600">
                            <li className="hover:underline cursor-pointer">PG Diplomas</li>
                            <li className="hover:underline cursor-pointer">Executive Programs</li>
                            <li className="hover:underline cursor-pointer">Hybrid Programs</li>
                          </ul>
                        </div>

                        {/* COLUMN 4 */}
                        <div>
                          <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                            Master Degree
                          </h4>
                          <ul className="space-y-2 text-[13px] text-gray-600">
                            <li className="hover:underline cursor-pointer">MBA</li>
                            <li className="hover:underline cursor-pointer">M.Tech</li>
                            <li className="hover:underline cursor-pointer">M.Sc</li>
                          </ul>
                        </div>

                        {/* COLUMN 5 */}
                        <div>
                          <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                            Global Programs
                          </h4>
                          <ul className="space-y-2 text-[13px] text-gray-600">
                            <li className="hover:underline cursor-pointer">Study Abroad</li>
                            <li className="hover:underline cursor-pointer">Global Internships</li>
                            <li className="hover:underline cursor-pointer">Exchange Programs</li>
                          </ul>
                        </div>
                      </div>

                      {/* BOTTOM STRIP */}
                      <div className="border-t-2 border-[#e6e0e0d6] px-8 py-4 text-sm text-gray-600 w-[1000px] mx-auto">
                        Not sure where to begin?
                        <span className="text-blue-600 ml-2 hover:underline cursor-pointer">
                          Browse all programs →
                        </span>
                      </div>
                    </div>
                  )}
                </div>


                {/* DEGREES */}
                <NavLink
                  to="/degrees"
                  className={({ isActive }) =>
                    `text-sm border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
     hover:bg-blue-50 hover:text-blue-600
     ${isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                    }`
                  }
                >
                  Degree Programs
                </NavLink>
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    `text-sm border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
     hover:bg-blue-50 hover:text-blue-600
     ${isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                    }`
                  }
                >
                  Events
                </NavLink>

                <NavLink
                  to="/resources"
                  className={({ isActive }) =>
                    `text-sm border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
     hover:bg-blue-50 hover:text-blue-600
     ${isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                    }`
                  }
                >
                  Resources
                </NavLink>
                <NavLink
                  to="/more"
                  className={({ isActive }) =>
                    `text-sm border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
     hover:bg-blue-50 hover:text-blue-600
     ${isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700"
                    }`
                  }
                >
                  More
                </NavLink>



              </div>
            </div>


            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-4">
              <div
                className="relative flex items-center h-[40px]"
                onMouseEnter={() => setIsSearchOpen(true)}
                onMouseLeave={() => { if (!searchValue) setIsSearchOpen(false); }}
              >
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search..."
                  className={`
                  absolute -right-1 h-[40px]
                  rounded-full border border-gray-300
                  px-4 pr-10 text-sm
                  transition-all duration-300 ease-in-out
                  focus:outline-none bg-white
                  ${isSearchOpen ? "w-[250px] opacity-100" : "w-[40px] opacity-0 pointer-events-none"}
                `}
                  onFocus={() => setIsSearchOpen(true)}
                />
                <button
                  className="relative z-10 h-[36px] w-[36px] rounded-full bg-[#1944f1] text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
                  onClick={() => { if (!searchValue) setIsSearchOpen(true); }}
                >
                  <CiSearch size={25} />
                </button>
              </div>

              {/* Google Translate Widget */}
              {/* <div id="google_translate_element" className="flex items-center bg-[#002761] translate-widget-wrapper"></div> */}

              {user ? (
                <div className="relative group">
                  <button className="h-9 w-9 rounded-full bg-[#1944f1] text-white text-2xl font-semibold flex items-center justify-center shadow-sm hover:ring-2 hover:ring-blue-100 transition-all">
                    {userInitial}
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 py-2">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.fullName || user.email}</p>
                    </div>
                    {isAdmin ? (
                      <Link to={dashboardPath} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <i className="bi bi-grid-1x2"></i> Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <i className="bi bi-person"></i> Profile
                        </Link>
                        <Link to="/favorites" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <i className="bi bi-heart"></i> Favorites
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50">
                      <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-[17px] text-[#0F2A4D] font-semibold hover:underline">Log In</Link>
                  <Link to="/choose-signup" className=" text-white px-[15px] py-[7px] rounded-[7px] text-[17px] font-semibold bg-[#1E40AF] transition-colors">Sign up</Link>
                </>
              )}
            </div>
          </div>

           </div>
          
        



      </header>

      <div className="h-[72px]" aria-hidden="true"></div>
    </>
  );
};

export default NavBar;
