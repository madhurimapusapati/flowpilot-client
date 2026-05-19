export default function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors
          px-3 py-1.5 rounded-lg hover:bg-violet-500/10"
        >
          {action}
        </button>
      )}
    </div>
  );
}
