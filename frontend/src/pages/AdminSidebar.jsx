import {
  ChartNoAxesColumn,
  Users,
  BookOpen,
  Video,
  Menu,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../features/api/authApi";

const AdminSidebar = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Admin nav items
  const navItems = [
    { to: "dashboard", icon: <ChartNoAxesColumn size={20} />, label: "Dashboard" },
    { to: "users", icon: <Users size={20} />, label: "Users" },
    { to: "courses", icon: <BookOpen size={20} />, label: "Courses" },
    { to: "live-meetings", icon: <Video size={20} />, label: "Live Meetings" },
  ];
  const { pathname } = useLocation();
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      navigate("/login");
    }
  }, [isSuccess]);


  

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden absolute top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <nav
        className={`${
          sidebarOpen ? "block" : "hidden"
        } lg:block w-[220px] sm:w-[250px] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md lg:shadow-none p-5 sticky top-0 h-screen transition-all duration-300 z-40`}
        aria-label="Admin sidebar"
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
          <div className="border-t border-gray-300 pt-4">
            <NavLink
          to="/login"
          onClick={logoutHandler}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded w-full justify-center font-medium cursor-pointer"
        >
          
          Logout
        </NavLink>
      </div>
        </div>
      </nav>

      

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminSidebar;
