export default function ProjectSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-slate-700/60" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-700/60 rounded-lg w-3/5" />
            <div className="h-3 bg-slate-800/80 rounded-lg w-4/5" />
          </div>
          <div className="h-5 w-16 bg-slate-700/60 rounded-full ml-3" />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <div className="h-3 w-14 bg-slate-800/80 rounded" />
            <div className="h-3 w-8 bg-slate-800/80 rounded" />
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full">
            <div className="h-full w-2/5 bg-slate-700/60 rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-slate-700/60 border-2 border-slate-900" />
            ))}
          </div>
          <div className="h-3 w-20 bg-slate-800/80 rounded" />
        </div>
      </div>
    </div>
  );
}
