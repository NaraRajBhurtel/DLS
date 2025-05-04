import { ChartNoAxesColumn, SquareLibrary, MessageCircle, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <div
        className={`lg:block ${sidebarOpen ? 'block' : 'hidden'} w-[220px] sm:w-[250px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen transition-all ease-in-out duration-300`}
      >
        <div className="space-y-4">
          {/* Dashboard Link */}
          <Link to="dashboard" className="flex items-center gap-3 hover:bg-gray-200 p-2 rounded-lg">
            <ChartNoAxesColumn size={20} />
            <span className="hidden lg:inline">Dashboard</span>
          </Link>

          {/* Courses Link */}
          <Link to="course" className="flex items-center gap-3 hover:bg-gray-200 p-2 rounded-lg">
            <SquareLibrary size={20} />
            <span className="hidden lg:inline">Courses</span>
          </Link>

          {/* Messages Link */}
          <Link to="messages" className="flex items-center gap-3 hover:bg-gray-200 p-2 rounded-lg">
            <MessageCircle size={20} />
            <span className="hidden lg:inline">Messages</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-10 transition-all ease-in-out duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
