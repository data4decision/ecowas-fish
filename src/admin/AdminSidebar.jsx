import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Upload, Download, BarChart2, LineChart, FileText,
  Bell, HelpCircle, Settings, LogOut, ChevronsLeft, ChevronsRight, Globe2, Edit, Send
} from "lucide-react";
import logoImg from "../assets/logo.png";
import { auth } from "../firebase/firebase";

export default function AdminSidebar({
  user,
  collapsed,
  setCollapsed,
  sidebarOpen,
  setSidebarOpen,
  isMobile
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin/login");
  };

  const isAdmin = user?.role === "admin";
  const countryPath = user?.countryCode?.toLowerCase?.() || "nigeria";

 
const navItems = [
  { label: "Dashboard", icon: Home, to: "/admin/dashboard" },
  { label: "Upload Data", icon: Upload, to: "/admin/upload" },
  { label: "Download Data", icon: Download, to: "/admin/downloads" },
  { label: "Monthly Trends", icon: LineChart, to: "/admin/trends" },
  { label: "KPI Analysis", icon: BarChart2, to: "/admin/kpi-analysis" },
  { label: "Report History", icon: FileText, to: "/admin/reports" },
  { label: "Notifications", icon: Bell, to: "/admin/notifications" },
  { label: "Help & Support", icon: HelpCircle, to: "/admin/help" },
  { label: "Settings", icon: Settings, to: "/admin/settings" },
];

  const adminItems = [
    { label: "All Countries Data", icon: Globe2, to: "/admin/all-countries" },
    { label: "Manage Submissions", icon: Upload, to: "/admin/manage-submissions" },
    { label: "Edit Data Entries", icon: Edit, to: "/admin/edit-entries" },
    { label: "Push Dashboard Updates", icon: Send, to: "/admin/push-updates" },
    { label: "Download Master Reports", icon: Download, to: "/admin/master-reports" }
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded transition-all ${
      isActive ? "bg-[#0b0b5c] text-white" : "text-[#0b0b5c] hover:bg-[#f47b20]/20"
    }`;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 bg-white shadow-md transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <img src={logoImg} alt="Logo" className="w-10 h-8 mr-2" />
          {!collapsed && (
            <span className="text-sm font-bold text-[#0b0b5c] whitespace-nowrap">
              Data4Decision Intl
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#0b0b5c]"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>

      {/* User Country (if not collapsed) */}
      {!collapsed && (
        <div className="px-4 mt-4 mb-2 text-xs text-gray-500">
          {user?.country?.toUpperCase()}
        </div>
      )}

      {/* Regular Navigation */}
      <nav className="mt-2 flex flex-col gap-1 px-2">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink key={label} to={to} className={linkClass}>
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Admin Navigation */}
      {isAdmin && (
        <>
          {!collapsed && (
            <div className="px-4 mt-6 mb-2 text-xs text-gray-500 uppercase">
              Admin Tools
            </div>
          )}
          <nav className="flex flex-col gap-1 px-2">
            {adminItems.map(({ label, icon: Icon, to }) => (
              <NavLink key={label} to={to} className={linkClass}>
                <Icon size={18} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </>
      )}

      {/* Logout */}
      <div className="absolute bottom-0 w-full px-2 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
