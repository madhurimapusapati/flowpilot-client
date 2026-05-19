import { Search, X } from "lucide-react";

const STATUSES = ["All", "Planning", "Active", "Completed"];

export default function ProjectFilters({ search, setSearch, status, setStatus, total, filtered }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl pl-9 pr-9 py-2.5
          text-sm text-slate-300 placeholder-slate-600
          focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-700/50 rounded-xl p-1">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              status === s
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Count */}
      <span className="text-xs text-slate-600 whitespace-nowrap ml-auto sm:ml-0">
        {filtered} of {total}
      </span>
    </div>
  );
}
