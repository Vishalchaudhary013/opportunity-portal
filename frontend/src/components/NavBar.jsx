import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useOpportunities } from "../context/OpportunitiesContext";
import { FiMenu, FiSearch, FiX } from "react-icons/fi";

const resolveUserInitial = (user) => {
  const emailInitial = String(user?.email || "").trim().charAt(0);

  if (emailInitial) {
    return emailInitial.toUpperCase();
  }

  const nameInitial = String(user?.fullName || user?.name || "")
    .trim()
    .charAt(0);

  return nameInitial ? nameInitial.toUpperCase() : "U";
};

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useOpportunities();
  const isAdmin = ["admin", "super_admin"].includes(user?.role);
  const dashboardPath =
    user?.role === "super_admin" ? "/super-admin-dashboard" : "/admin-dashboard";
  const userInitial = resolveUserInitial(user);
  const [hover, setHover] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white py-3 sm:py-4 border-b border-black/10">
        <div className="w-full max-w-350 mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
           <div className="flex items-center gap-4 lg:gap-17.5 min-w-0">
             <Link to="/" className="flex items-center gap-1 text-xl sm:text-2xl font-medium pb-0.5 shrink-0">
              
              edeco.
             
            </Link>

            <ul className="hidden md:flex items-center gap-4 lg:gap-5">
              <li className="text-black/60 font-medium">
                <Link to="/intership">Interships</Link>
              </li>
              <li className="text-black/60 font-medium">
                <Link to="/global-program">Global Program</Link>
              </li>
              {isAdmin && (
                <li className="text-black/60 font-medium">
                  <Link to={dashboardPath}>Admin Dashboard</Link>
                </li>
              )}
            </ul>
           </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
              <div
                className="relative hidden md:flex items-center"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <input
                  type="text"
                  placeholder="What do you want to search?"
                  className={`absolute right-[-4.5px] transition-all  duration-300 ease-in-out ${hover ? "w-80 opacity-100 px-4 " : "w-0 opacity-0 px-0"} h-10 rounded-full border  py-5 border-gray-300 outline-none bg-white shadow-md`}
                />

                <div className="relative z-10 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer">
                  <FiSearch size={20} />
                </div>
              </div>

              {user ? (
                <div className="relative group">
                  <button
                    type="button"
                    className="h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center"
                    aria-label="Open account menu"
                  >
                    {userInitial}
                  </button>

                  <div className="absolute right-0 mt-2 w-47.5 bg-white shadow-lg rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-black/5">
                    <ul className="flex flex-col text-sm text-gray-700">
                      {!isAdmin && (
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                      )}

                      {!isAdmin && (
                        <Link
                          to="/favorites"
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          Favorites
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to={dashboardPath}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-4 py-2 hover:bg-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="text-left px-4 py-2 hover:bg-gray-100 rounded-b-xl text-red-500"
                      >
                        Logout
                      </button>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium text-blue-600 hover:underline transition text-sm sm:text-base"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium bg-blue-600 text-white py-1.5 px-2.5 sm:px-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg border border-black/15 text-slate-700"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="mt-3 md:hidden rounded-xl border border-black/10 bg-white overflow-hidden">
              <ul className="flex flex-col text-sm">
                <li>
                  <Link
                    to="/intership"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-black/70 font-medium hover:bg-slate-50"
                  >
                    Interships
                  </Link>
                </li>
                <li>
                  <Link
                    to="/global-program"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-black/70 font-medium hover:bg-slate-50"
                  >
                    Global Program
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      to={dashboardPath}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-black/70 font-medium hover:bg-slate-50"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="h-21.5 sm:h-22 md:h-21" aria-hidden="true" />
     
    </>
  );
};

export default NavBar;
