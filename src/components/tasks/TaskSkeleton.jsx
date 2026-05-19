export default function TaskSkeleton() {
  return (
    <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 animate-pulse space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="h-3.5 bg-slate-700/60 rounded w-3/5" />
        <div className="h-5 w-14 bg-slate-700/60 rounded-full flex-shrink-0" />
      </div>
      <div className="h-3 bg-slate-800 rounded w-4/5" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 w-20 bg-slate-800 rounded" />
        <div className="w-6 h-6 rounded-full bg-slate-700/60" />
      </div>
    </div>
  );
}
