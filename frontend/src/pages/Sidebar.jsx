import {
  ChartNoAxesColumn,
  SquareLibrary,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const navItems = [
    { to: "course", icon: <SquareLibrary size={20} />, label: "Courses" },
    { to: "messages", icon: <MessageCircle size={20} />, label: "Messages" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Mobile Toggle Button - absolutely positioned to avoid layout shift */}
      <button
        className="lg:hidden absolute top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } lg:block w-[220px] sm:w-[250px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md lg:shadow-none p-5 sticky top-0 h-screen transition-all duration-300 z-40`}
      >
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                pathname.includes(item.to)
                  ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.icon}
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
