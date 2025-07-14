import React, { useState, useEffect } from 'react';
import Sidebar from './DashboardSidebar';
import Navbar from './DashboardNavbar';

export default function DashboardLayout({ user, children }) {
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
    <div>
      <Sidebar
        user={user}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Navbar
        user={user}
        collapsed={collapsed}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main
            className={`flex-1 p-4 ml-17 overflow-x-hidden mt-16 transition-all duration-300 ${
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
