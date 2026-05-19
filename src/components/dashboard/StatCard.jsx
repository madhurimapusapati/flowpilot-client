import {
  Folders, CheckSquare, Users, TrendingUp, ArrowUpRight, Minus,
} from "lucide-react";

const iconMap = { Folders, CheckSquare, Users, TrendingUp };

const colorMap = {
  violet: {
    icon: "bg-violet-500/15 text-violet-400",
    glow: "hover:shadow-violet-500/10",
    badge: "text-violet-400",
    border: "hover:border-violet-500/30",
  },
  blue: {
    icon: "bg-blue-500/15 text-blue-400",
    glow: "hover:shadow-blue-500/10",
    badge: "text-blue-400",
    border: "hover:border-blue-500/30",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-400",
    glow: "hover:shadow-emerald-500/10",
    badge: "text-emerald-400",
    border: "hover:border-emerald-500/30",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-400",
    glow: "hover:shadow-amber-500/10",
    badge: "text-amber-400",
    border: "hover:border-amber-500/30",
  },
};

export default function StatCard({ label, value, change, trend, color, icon }) {
  const Icon = iconMap[icon];
  const c = colorMap[color];

  return (
    <div
      className={`bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 ${c.border}
      rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300
      hover:shadow-xl ${c.glow} hover:-translate-y-0.5 cursor-default`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center`}>
          {Icon && <Icon size={18} />}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${c.badge}`}>
          {trend === "up" ? <ArrowUpRight size={13} /> : <Minus size={13} />}
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
