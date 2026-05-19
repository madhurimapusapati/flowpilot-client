import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, Calendar, ArrowUpRight, ChevronRight, Minus, Plus } from "lucide-react";

const STATUSES = ["Planning", "Active", "Completed"];

const STATUS_STYLES = {
  Planning:  {
    pill: "text-amber-400 bg-amber-500/10 border-amber-500/25 hover:bg-amber-500/20",
    bar:  "from-amber-500 to-orange-500",
    top:  "from-amber-500 to-orange-500",
  },
  Active: {
    pill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25 hover:bg-emerald-500/20",
    bar:  "from-violet-500 to-indigo-500",
    top:  "from-violet-500 to-indigo-500",
  },
  Completed: {
    pill: "text-blue-400 bg-blue-500/10 border-blue-500/25 hover:bg-blue-500/20",
    bar:  "from-blue-500 to-cyan-500",
    top:  "from-blue-500 to-cyan-500",
  },
};

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500",  "bg-pink-500", "bg-cyan-500",
];

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function ProjectCard({
  project, onEdit, onDelete, onStatusChange, onProgressChange,
  currentUserId, isAdmin,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef  = useRef(null);
  const style    = STATUS_STYLES[project.status] || STATUS_STYLES.Planning;

  const canManage =
    isAdmin ||
    project.createdBy?._id?.toString() === currentUserId ||
    project.createdBy?.toString()       === currentUserId;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cycleStatus = (e) => {
    e.stopPropagation();
    if (!canManage) return;
    const next = STATUSES[(STATUSES.indexOf(project.status) + 1) % STATUSES.length];
    onStatusChange(project._id, next);
  };

  const members        = project.members || [];
  const visibleMembers = members.slice(0, 4);
  const extraMembers   = members.length - visibleMembers.length;

  return (
    <div className="group bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl
      overflow-hidden hover:border-slate-600/60 transition-all duration-300 hover:-translate-y-0.5
      hover:shadow-xl hover:shadow-black/30 flex flex-col">

      {/* Gradient top accent */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${style.top} flex-shrink-0`} />

      <div className="p-5 flex flex-col flex-1 gap-4">

        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                {project.title}
              </h3>
              <ArrowUpRight size={12} className="text-slate-700 group-hover:text-violet-500 transition-colors flex-shrink-0" />
            </div>
            {project.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Actions menu — always visible on mobile, hover on desktop */}
          {canManage && (
            <div className="relative flex-shrink-0" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600
                hover:text-slate-300 hover:bg-slate-800 transition-all
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <MoreHorizontal size={15} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-slate-900 border border-slate-700/60
                  rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-20">
                  <div className="p-1">
                    <button
                      onClick={() => { setMenuOpen(false); onEdit(project); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                      text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <Pencil size={13} /> Edit project
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); onDelete(project); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
                      text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status badge — clickable cycle for owners/admins */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleStatus}
            disabled={!canManage}
            title={canManage ? `Click to advance status` : project.status}
            className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full
            border transition-all duration-150 ${style.pill}
            ${canManage ? "cursor-pointer" : "cursor-default"}`}
          >
            {project.status}
            {canManage && <ChevronRight size={10} className="opacity-60" />}
          </button>
        </div>

        {/* Progress — inline stepper for owners/admins */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">Progress</span>
            <div className="flex items-center gap-1">
              {canManage && (
                <button
                  onClick={(e) => { e.stopPropagation(); onProgressChange(project._id, Math.max(0, (project.progress ?? 0) - 5)); }}
                  className="w-5 h-5 rounded flex items-center justify-center text-slate-500
                  hover:text-slate-200 hover:bg-slate-700 transition-all"
                  title="-5%"
                >
                  <Minus size={10} />
                </button>
              )}
              <span className="text-xs font-semibold text-slate-300 w-8 text-center">
                {project.progress ?? 0}%
              </span>
              {canManage && (
                <button
                  onClick={(e) => { e.stopPropagation(); onProgressChange(project._id, Math.min(100, (project.progress ?? 0) + 5)); }}
                  className="w-5 h-5 rounded flex items-center justify-center text-slate-500
                  hover:text-slate-200 hover:bg-slate-700 transition-all"
                  title="+5%"
                >
                  <Plus size={10} />
                </button>
              )}
            </div>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${style.bar} rounded-full transition-all duration-300`}
              style={{ width: `${project.progress ?? 0}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {/* Member avatars */}
          <div className="flex -space-x-2">
            {visibleMembers.map((member, i) => (
              <div
                key={member._id || i}
                title={member.name}
                className={`w-6 h-6 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]}
                border-2 border-slate-900 flex items-center justify-center text-white text-[9px] font-bold`}
              >
                {initials(member.name)}
              </div>
            ))}
            {extraMembers > 0 && (
              <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900
                flex items-center justify-center text-slate-400 text-[9px] font-bold">
                +{extraMembers}
              </div>
            )}
          </div>

          {/* Due date */}
          {project.dueDate && (
            <div className="flex items-center gap-1 text-xs text-slate-600">
              <Calendar size={11} />
              <span>{formatDate(project.dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
