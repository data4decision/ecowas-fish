import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // ✅ Required for rendering nested route components
import Sidebar from './DashboardSidebar';
import Navbar from './DashboardNavbar';

export default function DashboardLayout({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setCollapsed(true);
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <Sidebar
        user={user}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Navbar */}
        <Navbar
          user={user}
          collapsed={collapsed}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page Content */}
        <main
          className={`p-4 mt-16 ml-19 transition-all duration-300 overflow-x-hidden ${
            sidebarOpen ? (collapsed ? "md:ml-20" : "md:ml-64") : "md:ml-0"
          }`}
        >
          {/* ✅ This is the key part that renders whichever nested route is matched under DashboardLayout */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
