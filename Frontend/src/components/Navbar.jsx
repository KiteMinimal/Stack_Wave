import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = ({setDarkMode,darkMode}) => {

  const {user} = useSelector((state) => state.user)

  return (
    <nav className={ darkMode ? "w-full bg-gray-800 text-white shadow-sm flex items-center gap-2 border-b-[1px] py-2 fixed top-0 left-0" : "w-full bg-white text-black py-2 shadow-sm flex items-center gap-2 fixed top-0 left-0"}>
      <div className="w-[90%] lg:w-[85%] mx-auto navbar flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="md:hidden">
            <RxHamburgerMenu size={25}/>
          </span>
          <p className="text-base md:text-xl">
            Stack <strong>Wave</strong>
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-8 font-semibold">
          <Link to="/" className="hover:text-orange-400">HOME</Link>
          <Link to="/questions" className="hover:text-orange-400">QUESTIONS</Link>
          <Link to="/rooms" className="hover:text-orange-400">ROOMS</Link>
        </div>

        <div className="flex flex-row-reverse md:flex-row items-center md:gap-4">
          <input
            type="text"
            placeholder="Search"
            className={`hidden bg-transparent md:block input input-bordered w-28 md:w-96 ${darkMode && "border border-white"} `}
          />

          {user ? <div className={`dropdown dropdown-end ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"} `}>
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul tabIndex={0} className={`menu menu-sm dropdown-content ${darkMode ? "bg-black" : "bg-base-100"} rounded-box z-1 mt-3 w-52 p-2 shadow`}>
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
          </div> : <button type="button" className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 cursor-pointer shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
              Signup
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button> }

          <div className="themeController mx-6">
          <label className="toggle text-base-content">
              <input type="checkbox" value="synthwave" className="theme-controller" onChange={(e) => setDarkMode(!darkMode)} />

              <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></g></svg>

              <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></g></svg>

          </label>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
