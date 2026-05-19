import { ArrowUpRight } from "lucide-react";

const statusColors = {
  active: "text-emerald-400 bg-emerald-500/10",
  paused: "text-amber-400 bg-amber-500/10",
  done: "text-blue-400 bg-blue-500/10",
};

export default function ProjectCard({ project }) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 group cursor-pointer">
      {/* Gradient top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${project.color}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                {project.name}
              </h3>
              <ArrowUpRight size={13} className="text-slate-600 group-hover:text-violet-400 transition-colors flex-shrink-0" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{project.description}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${statusColors[project.status]}`}>
            {project.status}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-slate-500">Progress</span>
            <span className="text-xs font-semibold text-slate-300">{project.progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${project.color} rounded-full transition-all duration-700`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Team avatars */}
          <div className="flex -space-x-2">
            {project.team.map((member, i) => (
              <div
                key={i}
                title={member.name}
                className={`w-6 h-6 rounded-full ${member.color} border-2 border-slate-900 flex items-center justify-center text-white text-[9px] font-bold`}
              >
                {member.name[0]}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{project.tasks.done}/{project.tasks.total} tasks</span>
            <span className="text-slate-700">•</span>
            <span>Due {project.due}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
