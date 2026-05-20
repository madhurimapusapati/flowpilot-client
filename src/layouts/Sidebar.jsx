import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  Users, Settings, ChevronLeft, ChevronRight, LogOut, X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Projects",  icon: FolderKanban,   to: "/projects"  },
  { label: "Tasks",     icon: CheckSquare,    to: "/tasks"     },
  { label: "Team",      icon: Users,          to: "/team"      },
  { label: "Settings",  icon: Settings,       to: "/settings"  },
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();
  const { logout, user, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const displayUser = {
    name:     user?.name  || "User",
    role:     user?.role  || "member",
    initials: getInitials(user?.name),
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? "justify-center px-3" : "px-5"} py-5 border-b border-slate-700/50`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {!collapsed && (
          <span className="ml-2.5 text-lg font-bold text-white tracking-tight">FlowPilot</span>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto lg:hidden text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems
          .filter(({ to }) => to !== "/projects" || isAdmin)
          .map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
              ${isActive
                ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={`flex-shrink-0 ${isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-slate-700/50 pt-3 space-y-1">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500
          hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 border border-transparent
          hover:border-red-500/20 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 mt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {displayUser.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{displayUser.name}</p>
              <p className={`text-xs capitalize font-medium ${
                displayUser.role === "admin"
                  ? "text-violet-400"
                  : "text-slate-500"
              }`}>
                {displayUser.role === "admin" ? "⚡ Admin" : "Member"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-950/80 backdrop-blur-xl border-r border-slate-700/50
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? "w-[68px]" : "w-[220px]"}`}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute left-full top-[72px] ml-[-1px] w-5 h-10 bg-slate-800 border border-slate-700/50
          rounded-r-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-700 transition-all z-10"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-[220px] bg-slate-950 border-r border-slate-700/50 z-50 lg:hidden
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
