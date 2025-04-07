import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = ({ setDarkMode, darkMode }) => {
  const { user } = useSelector((state) => state.user);
  const [dropdown,setDropDown] = useState(false);

  return (
    <nav
      className={
        darkMode
          ? "w-full bg-gray-800 text-white shadow-sm flex items-center gap-2 border-b-[1px] py-2 fixed top-0 left-0 z-10"
          : "w-full bg-white text-black py-2 shadow-sm flex items-center gap-2 fixed top-0 left-0 z-10"
      }
    >
      <div className="w-[90%] lg:w-[85%] mx-auto navbar flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="md:hidden relative">
              <RxHamburgerMenu size={25} onClick={()=> setDropDown(!dropdown)} />
              {dropdown && <ul className={`absolute font-medium text-gray-600 menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 border border-gray-600 shadow-sm ${darkMode ? "bg-gray-800 text-white border border-white" : ""} `}>
                <li>
                  <Link to="/" onClick={()=> setDropDown(false)} >Home</Link>
                  <Link to="/questions" onClick={()=> setDropDown(false)} >Questions</Link>
                  <Link to="/rooms" onClick={()=> setDropDown(false)} >Rooms</Link>
                </li>
              </ul>}
          </span>
          <div className="text-base md:text-xl">
            Stack <strong className="text-orange-400">Wave</strong>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 font-semibold">
          <Link to="/" className="hover:text-orange-400">
            HOME
          </Link>
          <Link to="/questions" className="hover:text-orange-400">
            QUESTIONS
          </Link>
          <Link to="/rooms" className="hover:text-orange-400">
            ROOMS
          </Link>
        </div>

        <div className="flex flex-row-reverse md:flex-row items-center md:gap-4">
          <input
            type="text"
            placeholder="Search"
            className={`hidden bg-transparent md:block input input-bordered w-28 md:w-96 ${
              darkMode && "border border-white"
            } `}
          />

            <div
              className={`dropdown dropdown-end ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              } `}
            >
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={user?.avatar}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className={`menu menu-sm dropdown-content ${
                  darkMode ? "bg-black" : "bg-base-100"
                } rounded-box z-1 mt-3 w-52 p-2 shadow`}
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>

          <div className="themeController mx-6">
            <label className="toggle text-base-content">
              <input
                type="checkbox"
                value="synthwave"
                className="theme-controller"
                onChange={(e) => setDarkMode(!darkMode)}
              />

              <svg
                aria-label="sun"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="10" cy="10" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </g>
              </svg>

              <svg
                aria-label="moon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </g>
              </svg>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
