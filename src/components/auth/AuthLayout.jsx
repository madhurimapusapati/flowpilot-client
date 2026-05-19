import { Link } from "react-router-dom";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#080b14] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Ambient background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-purple-700/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow duration-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">FlowPilot</span>
        </Link>

        {/* Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/40">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-slate-400 text-sm mt-1.5">{subtitle}</p>
          </div>
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Protected by FlowPilot Security
        </p>
      </div>
    </div>
  );
}
