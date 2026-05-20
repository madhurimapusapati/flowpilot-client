import { FolderKanban, Plus } from "lucide-react";

export default function EmptyState({ filtered, onCreateClick, isAdmin }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
        <FolderKanban size={36} className="text-violet-400/60" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200 mb-2">
        {filtered ? "No projects match your filters" : "No projects yet"}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs mb-6">
        {filtered
          ? "Try adjusting your search or status filter to find what you're looking for."
          : isAdmin
            ? "Create your first project to start organizing your team's work in one place."
            : "You haven't been added to any projects yet. Ask your admin to add you."}
      </p>
      {!filtered && isAdmin && (
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
          hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold
          px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25
          hover:shadow-violet-500/40 hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Create your first project
        </button>
      )}
    </div>
  );
}
