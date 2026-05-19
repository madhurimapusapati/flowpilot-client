import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, Calendar, Circle, Clock, CheckCircle2 } from "lucide-react";

const PRIORITY_STYLES = {
  critical: "text-red-400    bg-red-500/10    border-red-500/30",
  high:     "text-orange-400 bg-orange-500/10 border-orange-500/30",
  medium:   "text-blue-400   bg-blue-500/10   border-blue-500/30",
  low:      "text-slate-400  bg-slate-500/10  border-slate-500/30",
};

const STATUS_META = {
  todo:         { icon: Circle,       color: "text-slate-500",  label: "To Do"       },
  "in-progress":{ icon: Clock,        color: "text-blue-400",   label: "In Progress" },
  done:         { icon: CheckCircle2, color: "text-emerald-400",label: "Done"        },
};

const AVATAR_COLORS = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-pink-500"];

function formatDate(d) {
  if (!d) return null;
  const date = new Date(d);
  const isOverdue = date < new Date() && true;
  const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { label, isOverdue };
}

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus, currentUserId, isAdmin, projectOwnerId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Edit: task creator, project owner, or admin
  // Delete: same rule — enforced on backend too
  const canManage =
    isAdmin ||
    task.createdBy?._id?.toString() === currentUserId ||
    task.createdBy?.toString()       === currentUserId ||
    projectOwnerId                   === currentUserId;

  const status  = STATUS_META[task.status] || STATUS_META.todo;
  const StatusIcon = status.icon;
  const due = task.dueDate ? formatDate(task.dueDate) : null;
  const assignee = task.assignee;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`group bg-slate-800/50 border rounded-xl p-4 transition-all duration-200
      hover:border-slate-600/60 hover:bg-slate-800/70 hover:shadow-lg hover:shadow-black/20
      ${task.status === "done" ? "border-slate-700/30 opacity-75" : "border-slate-700/50"}`}
    >
      {/* Top row — status toggle + title + menu */}
      <div className="flex items-start gap-2.5">
        <button
          onClick={() => onToggleStatus(task)}
          title="Cycle status"
          className={`mt-0.5 flex-shrink-0 transition-transform hover:scale-110 ${status.color}`}
        >
          <StatusIcon size={16} />
        </button>

        <p className={`flex-1 text-sm font-medium leading-snug transition-colors
          ${task.status === "done" ? "line-through text-slate-500" : "text-slate-200 group-hover:text-white"}`}
        >
          {task.title}
        </p>

        {/* Priority badge */}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0
          uppercase tracking-wide ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}
        >
          {task.priority}
        </span>

        {/* Kebab menu — creator, project owner, or admin only */}
        {canManage && (
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600
            hover:text-slate-300 hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-slate-900 border border-slate-700/60
              rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-20">
              <div className="p-1">
                <button
                  onClick={() => { setMenuOpen(false); onEdit(task); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                  text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <Pencil size={12} /> Edit task
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(task); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                  text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-600 mt-2 ml-[26px] line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 ml-[26px]">
        <div className="flex items-center gap-2">
          {due && (
            <div className={`flex items-center gap-1 text-xs ${due.isOverdue && task.status !== "done" ? "text-red-400" : "text-slate-600"}`}>
              <Calendar size={11} />
              <span>{due.label}</span>
            </div>
          )}
          {task.project?.title && (
            <span className="text-xs text-slate-700 truncate max-w-[100px]">
              {due ? "·" : ""} {task.project.title}
            </span>
          )}
        </div>

        {assignee ? (
          <div
            title={assignee.name}
            className={`w-6 h-6 rounded-full ${AVATAR_COLORS[0]} border border-slate-700
            flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0`}
          >
            {getInitials(assignee.name)}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border border-dashed border-slate-700 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
