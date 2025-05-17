import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; // Create this if you haven't
import { Outlet } from "react-router-dom";
import React from "react";

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mt-12 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
