import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, User, LogOut, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";
}

export default function Navbar({ setMobileOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const displayUser = {
    name:     user?.name  || "User",
    email:    user?.email || "",
    initials: getInitials(user?.name),
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="h-14 bg-slate-950/70 backdrop-blur-xl border-b border-slate-700/50 flex items-center px-4 gap-3 flex-shrink-0 sticky top-0 z-30">
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-sm
            text-slate-300 placeholder-slate-600 focus:outline-none focus:border-violet-500/50
            focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-slate-800/60
            transition-all border border-transparent hover:border-slate-700/50"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {displayUser.initials}
            </div>
            <span className="text-sm font-medium text-slate-300 hidden sm:block">
              {displayUser.name.split(" ")[0]}
            </span>
            <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-700/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-700/50">
                <p className="text-sm font-semibold text-white">{displayUser.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{displayUser.email}</p>
              </div>
              <div className="p-1.5">
                {[
                  { icon: User,     label: "Profile",  to: "/settings" },
                  { icon: Settings, label: "Settings", to: "/settings" },
                ].map(({ icon: Icon, label, to }) => (
                  <button
                    key={label}
                    onClick={() => { setDropdownOpen(false); navigate(to); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                    text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
                <div className="border-t border-slate-700/50 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                    text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
