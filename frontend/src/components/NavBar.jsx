import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useOpportunities } from "../context/OpportunitiesContext";
import { CiLocationOn, CiSearch } from "react-icons/ci";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  IoHomeOutline,
  IoLanguageSharp,
  IoLocationSharp,
  IoPlayCircleSharp,
} from "react-icons/io5";
import { FaLocationArrow, FaWhatsapp } from "react-icons/fa6";
import { Home } from "lucide-react";

const NavBar = () => {
  const [showExplore, setShowExplore] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreLeftOffset, setExploreLeftOffset] = useState(0);
  const exploreButtonRef = useRef(null);

  useEffect(() => {
    const updateOffset = () => {
      if (exploreButtonRef.current) {
        const rect = exploreButtonRef.current.getBoundingClientRect();
        setExploreLeftOffset(rect.left);
      }
    };

    if (showExplore) {
      updateOffset();
      window.addEventListener("resize", updateOffset);
    }

    return () => {
      window.removeEventListener("resize", updateOffset);
    };
  }, [showExplore]);

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
              includedLanguages: "en,hi,pa,fr,es,de,zh,ja",
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element",
          );
        }
      };

      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const changeLanguage = (langCode) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      // If the specific language code is not found, setting the value won't work,
      // and it will remain whatever it was. To revert to the original language (English),
      // we can set the value to empty string or 'en'
      if (langCode === "en" && select.value !== "en") {
        select.value = "en";
      }
      // Trigger the change event for google translate to pick it up
      select.dispatchEvent(new Event("change"));
    } else {
      // Fallback
      if (langCode === "en") {
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" +
          window.location.hostname +
          "; path=/;";
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;
      }
      window.location.reload();
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const resolveUserInitial = (user) => {
    const emailInitial = String(user?.email || "")
      .trim()
      .charAt(0);
    if (emailInitial) return emailInitial.toUpperCase();
    const nameInitial = String(user?.fullName || user?.name || "")
      .trim()
      .charAt(0);
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

        <div className="border-b border-gray-50 py-2">
          <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto ">
            <div className="flex justify-between items-center text-[15px]">
              <ul className="">
                <li>
                  {/* <Link to="/" className="text-[14px] font-semibold">
                    Home
                  </Link> */}
                </li>
              </ul>
              <ul className="flex items-center gap-5">
                
                <li className="group relative overflow-hidden rounded-lg p-[1.5px]">
                  {/* Rotating border */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute inset-[-150%] bg-red-600 group-hover:animate-spin"></div>
                  </div>

                  {/* Content */}
                  <button
                    onClick={() => navigate("/locate-us")}
                    className="relative z-10 bg-white shadow-sm rounded-lg py-1.5 px-3 flex items-center gap-1 cursor-pointer hover:bg-slate-50 transition-colors outline-none"
                  >
                    <IoLocationSharp size={16} />
                    <span className="pr-1 text-[13px] font-medium text-gray-800">
                      Find Us
                    </span>
                  </button>
                </li>

                <li>
                  <a 
                    href="https://wa.me/+918219263983?text=Hello!%20I%20am%20exploring%20the%20edeco%20platform%20and%20I%20have%20a%20query." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-[13px] text-green-800 gap-1.5 font-medium border border-green-400 rounded-lg px-3 py-1 bg-green-200 hover:bg-green-300 transition-colors shadow-sm cursor-pointer"
                  >
                     <FaWhatsapp size={16}/> Whatsapp
                  </a>
                </li>

                <li className="text-[13px] font-medium flex items-center gap-2">
                  <button
                    onClick={() => changeLanguage("en")}
                    className="hover:text-red-600 transition-colors"
                  >
                    ENG
                  </button>
                  <span className="text-[12px]">|</span>
                  <button
                    onClick={() => changeLanguage("hi")}
                    className="hover:text-red-600 transition-colors"
                  >
                    HINDI
                  </button>
                </li>

                 <li className="flex gap-4 items-center">
                  {user ? (
                    <div className="relative group">
                      <button className="h-9 w-9 rounded-full bg-red-600 text-white text-2xl font-semibold flex items-center justify-center shadow-sm hover:ring-2 hover:ring-blue-100 transition-all">
                        {userInitial}
                      </button>
                      <div className="absolute right-0 mt-2 w-56 bg-white shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 py-2">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Signed in as
                          </p>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.fullName || user.email}
                          </p>
                        </div>
                        {isAdmin ? (
                          <Link
                            to={dashboardPath}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-red-600 transition-colors"
                          >
                            <i className="bi bi-grid-1x2"></i> Admin Dashboard
                          </Link>
                        ) : (
                          <>
                            <Link
                              to="/profile"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-red-600 transition-colors"
                            >
                              <i className="bi bi-person"></i> Profile
                            </Link>
                            <Link
                              to="/favorites"
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-red-600 transition-colors"
                            >
                              <i className="bi bi-heart"></i> Favorites
                            </Link>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50"
                        >
                          <i className="bi bi-box-arrow-right"></i> Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-[16px] font-semibold hover:underline"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/choose-signup"
                        className=" text-white px-4 py-1 rounded-4xl text-[17px] font-semibold bg-red-600  transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </li>
               
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1350px] px-4 md:px-6 mx-auto ">
          <div className="flex items-center justify-between h-[60px]">
            {/* LEFT SECTION */}
            <div className="flex items-center ">
              {/* LOGO */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    navigate("/");
                  }
                }}
              >
                <span className="font-display font-extrabold text-3xl tracking-tight leading-none transition-colors duration-300 text-[#1F2853]">
                  edeco
                </span>
              </div>

              {/*  EXPLORE DROPDOWN  */}
            </div>

            <div className="hidden lg:flex items-center mt-0.5">
              <div
                className="group"
                ref={exploreButtonRef}
                onMouseEnter={() => setShowExplore(true)}
                onMouseLeave={() => setShowExplore(false)}
              >
                {/* EXPLORE BUTTON */}
                <button
                  className={`flex items-center gap-1 text-[16px] text-gray-700 border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
                  hover:text-red-600 hover:bg-blue-50
                  ${showExplore ? "text-red-600 bg-blue-50" : ""}
                `}
                >
                  Career Services
                  <MdKeyboardArrowDown
                    size={25}
                    className=""
                    style={{
                      transform: showExplore
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                  {/* <i
                      className="bi bi-chevron-down"
                      
                    ></i> */}
                </button>

                {/* MEGA DROPDOWN */}
                {showExplore && (
                  <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t border-gray-100 z-50">
                    {/* HOVER BRIDGE (IMPORTANT – invisible) */}
                    <div className="absolute -top-[20px] left-0 w-full h-[20px]"></div>

                    <div 
                      className="w-full flex flex-col" 
                      style={{ paddingLeft: `${exploreLeftOffset}px` }}
                    >
                      <div className="w-[880px]">
                        <div className="grid grid-cols-5 gap-5 p-7">
                      {/* COLUMN 1 */}
                      <div>
                        <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                          Internships
                        </h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                          <li className="hover:underline cursor-pointer">
                            Summer Internships
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Remote Internships
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Global Internships
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Paid Internships
                          </li>
                        </ul>
                      </div>

                      {/* COLUMN 2 */}
                      <div>
                        <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                          Apprenticeships
                        </h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                          <li className="hover:underline cursor-pointer">
                            Tech Apprenticeships
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Management Apprenticeships
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Finance Apprenticeships
                          </li>
                        </ul>
                      </div>

                      {/* COLUMN 3 */}
                      <div>
                        <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                          Jobs
                        </h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                          <li className="hover:underline cursor-pointer">
                            Full-time Roles
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Part-time Roles
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Fresher Jobs
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Remote Jobs
                          </li>
                        </ul>
                      </div>

                      {/* COLUMN 4 */}
                      <div>
                        <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                          Bootcamps
                        </h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                          <li className="hover:underline cursor-pointer">
                            Coding Bootcamps
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Data Science Bootcamps
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Design Bootcamps
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Marketing Bootcamps
                          </li>
                        </ul>
                      </div>

                      {/* COLUMN 5 */}
                      <div>
                        <h4 className="font-semibold text-[14px] mb-3 text-gray-900">
                          PG Programs
                        </h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                          <li className="hover:underline cursor-pointer">
                            PG Diplomas
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Executive Programs
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Hybrid Programs
                          </li>
                          <li className="hover:underline cursor-pointer">
                            Online Masters
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* BOTTOM STRIP */}
                    <div className="border-t border-gray-100 px-8 py-4 text-sm text-gray-600 bg-gray-50/50 w-[880px]">
                      Not sure where to begin?
                      <span className="text-red-600 ml-2 hover:underline cursor-pointer">
                        Browse all programs →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
              </div>

              {/* DEGREES */}
              <NavLink
                to="/degrees"
                className={({ isActive }) =>
                  `text-[16px] border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer hover:bg-blue-50 hover:text-red-600 ${isActive ? "text-red-600 bg-blue-50" : "text-gray-700"}`
                }
              >
                Degree Programs
              </NavLink>
              {/* <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    `text-sm border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
     hover:bg-blue-50 hover:text-red-600
     ${isActive ? "text-red-600 bg-blue-50" : "text-gray-700"}`
                  }
                >
                  Events
                </NavLink> */}

              <a
                href="https://frontend-jfhdav2px-vishal-chaudharys-projects-57aced94.vercel.app/"
                className="text-[16px] border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer hover:bg-blue-50 hover:text-red-600 text-gray-700"
              >
                Global Services
              </a>

              <a
                href="https://frontend-c9kuk4dfn-vishal-chaudharys-projects-57aced94.vercel.app/"
                className="text-[16px] border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer hover:bg-blue-50 hover:text-red-600 text-gray-700"
              >
                After K12
              </a>
              <a
                href="https://event-r6amjwiws-vishal-chaudharys-projects-57aced94.vercel.app/"
                className="text-[16px] border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer hover:bg-blue-50 hover:text-red-600 text-gray-700"
              >
                Events
              </a>

              {/* <NavLink
                  to="/global-services"
                  className={({ isActive }) =>
                    `text-sm border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
     hover:bg-blue-50 hover:text-red-600
     ${isActive ? "text-red-600 bg-blue-50" : "text-gray-700"}`
                  }
                >
                  Global Services
                </NavLink> */}

              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `text-[16px] border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
     hover:bg-blue-50 hover:text-red-600
     ${isActive ? "text-red-600 bg-blue-50" : "text-gray-700"}`
                }
              >
                Resources
              </NavLink>
              {/* <NavLink
                  to="/more"
                  className={({ isActive }) =>
                    `text-sm border border-transparent px-[15px] py-[12px] rounded-[7px] cursor-pointer
     hover:bg-blue-50 hover:text-red-600
     ${isActive ? "text-red-600 bg-blue-50" : "text-gray-700"}`
                  }
                >
                  More
                </NavLink> */}
            </div>
            {/* RIGHT ACTIONS */}
           <div className="border border-black/10 bg-[#1F2853] text-white rounded-lg py-1.5 px-5 flex items-center gap-1.5">

            <IoPlayCircleSharp size={20}/> Expert



           </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
              <div className="lg:hidden absolute top-[110px] left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col px-6 py-4 gap-4 z-40">
                <Link
                  to="/degrees"
                  className="text-gray-800 font-medium py-2 border-b border-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Degree Programs
                </Link>
                <Link
                  to="/events"
                  className="text-gray-800 font-medium py-2 border-b border-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Events
                </Link>
                <Link
                  to="/resources"
                  className="text-gray-800 font-medium py-2 border-b border-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resources
                </Link>
                <Link
                  to="/more"
                  className="text-gray-800 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  More
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="h-[72px]" aria-hidden="true"></div>
    </>
  );
};

export default NavBar;
