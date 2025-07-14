import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Upload, Download, BarChart2, LineChart, FileText,
  Bell, HelpCircle, Settings, LogOut, ChevronsLeft, ChevronsRight
} from "lucide-react";
import logoImg from "../assets/logo.png";
import { auth } from "../firebase/firebase";

export default function Sidebar({
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

  const countryPath = user?.countryCode?.toLowerCase?.() || "nigeria";

  const navItems = [
    { label: "Dashboard", icon: Home, to: `/${countryPath}/dashboard` },
    { label: "Upload Data", icon: Upload, to: `/${countryPath}/upload` },
    { label: "Download Data", icon: Download, to: `/${countryPath}/downloads` },
    { label: "Monthly Trends", icon: LineChart, to: `/${countryPath}/trends` },
    { label: "KPI Analysis", icon: BarChart2, to: `/${countryPath}/kpi-analysis` },
    { label: "Report History", icon: FileText, to: `/${countryPath}/reports` },
    { label: "Notifications", icon: Bell, to: `/${countryPath}/notifications` },
    { label: "Help & Support", icon: HelpCircle, to: `/${countryPath}/help` },
    { label: "Settings", icon: Settings, to: `/${countryPath}/settings` }
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded transition-all ${
      isActive ? "bg-[#0b0b5c] text-white" : "text-[#0b0b5c] hover:bg-[#f47b20]"
    }`;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40 bg-white shadow-md transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
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

      <nav className="mt-4 flex flex-col gap-1 px-2">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink key={label} to={to} className={linkClass}>
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

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
