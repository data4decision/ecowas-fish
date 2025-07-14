import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar'; // Make sure this is your custom admin sidebar
import AdminNavbar from './AdminNavbar';   // The custom navbar we just built

export default function AdminLayout({ user, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Adjust layout based on screen size
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
    <div className="relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={window.innerWidth <= 640}
      />

      {/* Navbar */}
      <AdminNavbar
        user={user}
        collapsed={collapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main
        className={`flex-1 p-4 overflow-x-hidden mt-16 transition-all duration-300 ${
          sidebarOpen
            ? collapsed
              ? "md:ml-20"
              : "md:ml-64"
            : "md:ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
