import { Circle, CheckCircle2, Clock } from "lucide-react";

const priorityColors = {
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
  high: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  medium: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  low: "text-slate-400 bg-slate-500/10 border-slate-500/30",
};

const statusIcons = {
  todo: Circle,
  "in-progress": Clock,
  done: CheckCircle2,
};

export default function TaskRow({ task }) {
  const StatusIcon = statusIcons[task.status];

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/40 transition-colors group cursor-pointer border border-transparent hover:border-slate-700/50">
      <div className="flex-shrink-0">
        <StatusIcon
          size={16}
          className={`${
            task.status === "done"
              ? "text-emerald-400"
              : task.status === "in-progress"
              ? "text-blue-400"
              : "text-slate-600"
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 font-medium truncate group-hover:text-white transition-colors">
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-600">{task.project}</span>
          <span className="text-slate-700">•</span>
          <span className="text-xs text-slate-600">{task.due}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
        <div
          className={`w-7 h-7 rounded-full ${task.assignee.color} flex items-center justify-center text-white text-xs font-semibold`}
        >
          {task.assignee.name.split(" ")[0][0]}
          {task.assignee.name.split(" ")[1]?.[0]}
        </div>
      </div>
    </div>
  );
}
