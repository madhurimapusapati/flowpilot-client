export default function ActivityItem({ item }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div
        className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}
      >
        {item.user[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 leading-snug">
          <span className="font-medium text-white">{item.user}</span>{" "}
          <span className="text-slate-500">{item.action}</span>{" "}
          <span className="text-violet-400 font-medium">{item.target}</span>
        </p>
        <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
      </div>
    </div>
  );
}
