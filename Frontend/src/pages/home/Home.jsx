
import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Search, User, PlusCircle, ArrowUp, MessageSquare } from "lucide-react";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark bg-gray-950 text-white transition-colors duration-300" : "bg-gray-100 text-gray-900 transition-colors duration-300"}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-orange-500 dark:text-orange-400">StackWave</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search questions..."
              className="pl-8 pr-4 py-2 rounded-lg border focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Link to="/ask" className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 transition px-4 py-2 rounded-lg shadow-md text-white">
            <PlusCircle /> Ask Question
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:scale-110 transition-transform">
            {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
          </button>
          <Link to="/profile" className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-md hover:scale-110 transition-transform">
            <User />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row p-4 gap-6">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-1/4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h3 className="font-bold text-lg">Popular Tags</h3>
          <ul className="mt-2 space-y-2">
            {["JavaScript", "React", "Node.js", "MongoDB", "CSS", "Next.js"].map(tag => (
              <li key={tag} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer">{tag}</li>
            ))}
          </ul>
        </aside>

        {/* Questions List */}
        <main className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Latest Questions</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((q) => (
              <div key={q} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 hover:shadow-xl transition flex gap-4">
                <div className="flex flex-col items-center">
                  <ArrowUp className="text-gray-600 dark:text-gray-300 cursor-pointer hover:scale-125 transition-transform" />
                  <span className="font-bold text-lg">15</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">How to optimize React performance?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Asked by John Doe • 2 hours ago</p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-blue-500 text-white rounded-lg">React</span>
                    <span className="px-2 py-1 bg-gray-500 text-white rounded-lg">Performance</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <MessageSquare className="text-gray-600 dark:text-gray-300" />
                  <span className="text-sm">5 Answers</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
