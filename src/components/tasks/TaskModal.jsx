import { useState, useEffect } from "react";
import { X, Loader2, CheckSquare } from "lucide-react";

const EMPTY = { title: "", description: "", status: "todo", priority: "medium", dueDate: "" };

const STATUS_OPTIONS   = ["todo", "in-progress", "done"];
const PRIORITY_OPTIONS = ["low", "medium", "high", "critical"];

const STATUS_LABELS   = { todo: "To Do", "in-progress": "In Progress", done: "Done" };
const PRIORITY_COLORS = {
  low:      "text-slate-400",
  medium:   "text-blue-400",
  high:     "text-orange-400",
  critical: "text-red-400",
};

function toInputDate(d) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

export default function TaskModal({ task, defaultStatus, onSubmit, onClose, submitting }) {
  const isEdit = !!task;
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title       || "",
        description: task.description || "",
        status:      task.status      || "todo",
        priority:    task.priority    || "medium",
        dueDate:     toInputDate(task.dueDate),
      });
    } else {
      setForm({ ...EMPTY, status: defaultStatus || "todo" });
    }
    setErrors({});
  }, [task, defaultStatus]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())           e.title = "Title is required";
    else if (form.title.length > 150) e.title = "Max 150 characters";
    if (form.description.length > 1000) e.description = "Max 1000 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    const payload = { ...form, dueDate: form.dueDate || null };
    const ok = await onSubmit(payload);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-md
        shadow-2xl shadow-black/60 z-10 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
            <CheckSquare size={16} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              {isEdit ? "Edit task" : "Create new task"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? "Update task details" : "Add a task to this project"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-slate-600 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-6 py-5 space-y-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Task title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Design login screen"
                className={`w-full bg-slate-800/60 border ${errors.title ? "border-red-500/60" : "border-slate-700/60"}
                rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600
                focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all`}
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional details..."
                rows={3}
                className={`w-full bg-slate-800/60 border ${errors.description ? "border-red-500/60" : "border-slate-700/60"}
                rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 resize-none
                focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all`}
              />
              {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5
                  text-sm text-slate-300 focus:outline-none focus:border-violet-500/60
                  focus:ring-1 focus:ring-violet-500/20 transition-all cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-slate-900">{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={`w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5
                  text-sm ${PRIORITY_COLORS[form.priority]} focus:outline-none focus:border-violet-500/60
                  focus:ring-1 focus:ring-violet-500/20 transition-all cursor-pointer`}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p} className="bg-slate-900 text-slate-200 capitalize">{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due date */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Due date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5
                text-sm text-slate-300 focus:outline-none focus:border-violet-500/60
                focus:ring-1 focus:ring-violet-500/20 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-slate-700/50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700/60 text-sm font-medium
              text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
              disabled:from-violet-800 disabled:to-indigo-800 disabled:cursor-not-allowed
              text-white text-sm font-semibold transition-all shadow-lg shadow-violet-500/20"
            >
              {submitting
                ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                : isEdit ? "Save changes" : "Create task"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
