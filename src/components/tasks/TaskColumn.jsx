import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskSkeleton from "./TaskSkeleton";

const COLUMN_STYLES = {
  todo:          { label: "To Do",       dot: "bg-slate-500",   header: "text-slate-400",  border: "border-slate-700/40"  },
  "in-progress": { label: "In Progress", dot: "bg-blue-400",    header: "text-blue-400",   border: "border-blue-500/20"   },
  done:          { label: "Done",        dot: "bg-emerald-400", header: "text-emerald-400",border: "border-emerald-500/20"},
};

export default function TaskColumn({ status, tasks, loading, onAdd, onEdit, onDelete, onToggleStatus, currentUserId, isAdmin, projectOwnerId }) {
  const col = COLUMN_STYLES[status];

  return (
    <div className={`flex flex-col bg-slate-900/40 border ${col.border} rounded-2xl overflow-hidden min-h-[400px]`}>
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-700/40">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${col.dot}`} />
          <span className={`text-sm font-semibold ${col.header}`}>{col.label}</span>
          <span className="text-xs font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
            {loading ? "—" : tasks.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-600
          hover:text-slate-300 hover:bg-slate-800 transition-all"
          title={`Add task to ${col.label}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <TaskSkeleton key={i} />)
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-xs text-slate-700">No tasks here</p>
            <button
              onClick={onAdd}
              className="text-xs text-slate-600 hover:text-violet-400 mt-1 transition-colors"
            >
              + Add one
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              projectOwnerId={projectOwnerId}
            />
          ))
        )}
      </div>
    </div>
  );
}
