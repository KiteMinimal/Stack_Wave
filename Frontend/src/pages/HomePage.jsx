
import { useEffect, useState } from "react";
import Navbar from "../components/home/Navbar";
import LandingPage from "./LandingPage";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(()=>{

  },[])

  return (
    <div className={darkMode ? "dark bg-gray-800 text-white transition-colors duration-300 relative overflow-hidden" : "bg-gray-100 text-gray-900 transition-colors duration-300 relative"}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="pt-20 w-full">
        <LandingPage/>
        {/* <Outlet/> */}
      </div>
    </div>
  );
}
