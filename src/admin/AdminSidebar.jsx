import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, Upload, Download, BarChart2, LineChart, FileText,
  Bell, HelpCircle, Settings, LogOut, ChevronsLeft, ChevronsRight, Globe2, Edit, Send
} from "lucide-react";
import logoImg from "../assets/logo.png";
import { auth } from "../firebase/firebase";
import { useTranslation } from "react-i18next";

export default function AdminSidebar({
  user,
  collapsed,
  setCollapsed,
  sidebarOpen,
  setSidebarOpen,
  isMobile
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin/login");
  };

  const isAdmin = user?.role === "admin";
  const countryPath = user?.countryCode?.toLowerCase?.() || "nigeria";

  const navItems = [
    { key: "dashboard", icon: Home, to: "/admin/dashboard" },
    { key: "upload_data", icon: Upload, to: "/admin/upload" },
    { key: "download_data", icon: Download, to: "/admin/downloads" },
    { key: "yearly_trends", icon: LineChart, to: "/admin/trends" },
    { key: "kpi_analysis", icon: BarChart2, to: "/admin/kpi-analysis" },
    { key: "report_history", icon: FileText, to: "/admin/reports" },
    { key: "notifications", icon: Bell, to: "/admin/notifications" },
    { key: "help_support", icon: HelpCircle, to: "/admin/help" },
    { key: "settings", icon: Settings, to: "/admin/settings" },
  ];

  const adminItems = [
    { key: "all_countries_data", icon: Globe2, to: "/admin/all-countries" },
    { key: "manage_submissions", icon: Upload, to: "/admin/manage-submissions" },
    { key: "edit_entries", icon: Edit, to: "/admin/edit-entries" },
    { key: "push_updates", icon: Send, to: "/admin/push-updates" },
    { key: "master_reports", icon: Download, to: "/admin/master-reports" }
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
        {navItems.map(({ key, icon: Icon, to }) => (
          <NavLink key={key} to={to} className={linkClass}>
            <Icon size={18} />
            {!collapsed && <span>{t(`admin_sidebar.${key}`)}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Admin Navigation */}
      {isAdmin && (
        <>
          <div className={`px-4 mt-6 mb-2 text-xs text-gray-500 uppercase ${collapsed ? "text-center" : ""}`}>
  {!collapsed ? t("admin_sidebar.admin_tools") : "⚙️"}
</div>

          <nav className="flex flex-col gap-1 px-2">
            {adminItems.map(({ key, icon: Icon, to }) => (
              <NavLink key={key} to={to} className={linkClass}>
                <Icon size={18} />
                {!collapsed && <span>{t(`admin_sidebar.${key}`)}</span>}
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
          {!collapsed && <span>{t("admin_sidebar.logout")}</span>}
        </button>
      </div>
    </aside>
  );
}
