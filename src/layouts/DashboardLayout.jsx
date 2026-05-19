import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#080b14] overflow-hidden">
      {/* Ambient background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar — relative so collapse toggle can use absolute positioning */}
      <div className="relative flex-shrink-0 z-20">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <Navbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
