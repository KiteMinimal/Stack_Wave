import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserCircle } from "lucide-react";

export default function Test() {
  const user = useSelector((state) => state?.auth?.user);
  const navigate = useNavigate();

  const handleProtectedNav = (path) => {
    if (!user) {
      navigate("/login");
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
      <h1
        className="text-2xl font-bold text-orange-500 dark:text-orange-400 cursor-pointer"
        onClick={() => navigate("/")}
      >
        StackWave
      </h1>

      {/* Navigation Links */}
      <div className="flex items-center gap-6 text-gray-700 dark:text-gray-200 font-medium">
        <button
          onClick={() => handleProtectedNav("/home")}
          className="hover:text-orange-500 dark:hover:text-orange-400 transition"
        >
          Home
        </button>
        <Link
          to="/questions"
          className="hover:text-orange-500 dark:hover:text-orange-400 transition"
        >
          Questions
        </Link>
        <Link
          to="/rooms"
          className="hover:text-orange-500 dark:hover:text-orange-400 transition"
        >
          Rooms
        </Link>
      </div>

      {/* Right Side: Auth */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Login
            </Link>
            <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700">
              Signup free
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-800 dark:text-gray-200">
              Welcome, {user.name}
            </span>
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-10 h-10 text-gray-500 dark:text-white" />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
