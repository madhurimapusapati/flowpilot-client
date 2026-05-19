import { Trash2, X, AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({ project, onConfirm, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-black/60 z-10">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-300 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>

        <h2 className="text-base font-semibold text-white mb-1">Delete project?</h2>
        <p className="text-sm text-slate-400 mb-1">
          You're about to permanently delete{" "}
          <span className="text-white font-medium">"{project.title}"</span>.
        </p>
        <p className="text-xs text-slate-600 mb-6">This action cannot be undone.</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700/60 text-sm font-medium
            text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(project._id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
            bg-red-500/15 border border-red-500/30 text-sm font-semibold text-red-400
            hover:bg-red-500/25 hover:text-red-300 transition-all"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
