import { useState, useEffect } from "react";
import { X, Loader2, FolderKanban, UserPlus, Search, XCircle } from "lucide-react";
import { fetchAllUsers } from "../../services/projectService";
import { useAuth } from "../../context/AuthContext";

const EMPTY = { title: "", description: "", status: "Planning", dueDate: "", progress: 0 };
const STATUS_OPTIONS = ["Planning", "Active", "Completed"];
const STATUS_COLORS  = { Planning: "text-amber-400", Active: "text-emerald-400", Completed: "text-blue-400" };

const AVATAR_COLORS = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-pink-500","bg-cyan-500"];
function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function toInputDate(d) {
  if (!d) return "";
  return new Date(d).toISOString().split("T")[0];
}

export default function ProjectModal({ project, onSubmit, onClose, submitting }) {
  const isEdit = !!project;
  const { user: currentUser } = useAuth();

  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [members, setMembers]   = useState([]);   // selected member objects
  const [search, setSearch]     = useState("");

  // Load all users once
  useEffect(() => {
    fetchAllUsers()
      .then(({ data }) => setAllUsers(data))
      .catch(() => {});
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (project) {
      setForm({
        title:       project.title       || "",
        description: project.description || "",
        status:      project.status      || "Planning",
        dueDate:     toInputDate(project.dueDate),
        progress:    project.progress    ?? 0,
      });
      // Pre-fill existing members (exclude creator — backend handles that)
      const existing = (project.members || []).filter(
        (m) => (m._id || m).toString() !== project.createdBy?._id?.toString() &&
               (m._id || m).toString() !== project.createdBy?.toString()
      );
      setMembers(existing.map((m) => typeof m === "object" ? m : { _id: m }));
    } else {
      setForm(EMPTY);
      setMembers([]);
    }
    setErrors({});
    setSearch("");
  }, [project]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())             e.title       = "Title is required";
    else if (form.title.length > 100)   e.title       = "Max 100 characters";
    if (form.description.length > 500)  e.description = "Max 500 characters";
    if (form.progress < 0 || form.progress > 100) e.progress = "Must be 0–100";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "progress" ? Number(value) : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const addMember = (u) => {
    if (members.find((m) => m._id === u._id)) return;
    setMembers((prev) => [...prev, u]);
    setSearch("");
  };

  const removeMember = (id) => setMembers((prev) => prev.filter((m) => m._id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
      members: members.map((m) => m._id),
    };
    const ok = await onSubmit(payload);
    if (ok) onClose();
  };

  // Filter users: exclude self (admin/creator) and already added members
  const suggestions = allUsers.filter((u) => {
    if (u._id === currentUser?._id) return false;
    if (members.find((m) => m._id === u._id)) return false;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-lg
        shadow-2xl shadow-black/60 z-10 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
            <FolderKanban size={17} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              {isEdit ? "Edit project" : "Create new project"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? "Update project details & team" : "Fill in the details and add teammates"}
            </p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-600 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-6 py-5 space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Project title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. FlowPilot Web App"
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
                placeholder="What is this project about?"
                rows={3}
                className={`w-full bg-slate-800/60 border ${errors.description ? "border-red-500/60" : "border-slate-700/60"}
                rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 resize-none
                focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all`}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? <p className="text-xs text-red-400">{errors.description}</p> : <span />}
                <span className="text-xs text-slate-700">{form.description.length}/500</span>
              </div>
            </div>

            {/* Status + Due date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5
                  text-sm ${STATUS_COLORS[form.status]} focus:outline-none focus:border-violet-500/60
                  focus:ring-1 focus:ring-violet-500/20 transition-all cursor-pointer`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
                  ))}
                </select>
              </div>
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

            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-300">Progress</label>
                <span className="text-sm font-semibold text-violet-400">{form.progress}%</span>
              </div>
              <input
                type="range"
                name="progress"
                min={0} max={100}
                value={form.progress}
                onChange={handleChange}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-700 accent-violet-500"
              />
              <div className="flex justify-between text-xs text-slate-700 mt-1">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
              {errors.progress && <p className="text-xs text-red-400 mt-1">{errors.progress}</p>}
            </div>

            {/* ── Team Members ── */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <UserPlus size={14} className="text-violet-400" />
                Add teammates
              </label>

              {/* Search input */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-8 pr-4 py-2.5
                  text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500/60
                  focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>

              {/* Suggestions dropdown */}
              {search.trim() && suggestions.length > 0 && (
                <div className="mt-1 bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl max-h-40 overflow-y-auto">
                  {suggestions.slice(0, 6).map((u, i) => (
                    <button
                      key={u._id}
                      type="button"
                      onClick={() => addMember(u)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700/60 transition-colors text-left"
                    >
                      <div className={`w-7 h-7 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                        {getInitials(u.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-200 truncate">{u.name}</p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                        u.role === "admin"
                          ? "text-violet-400 border-violet-500/30 bg-violet-500/10"
                          : "text-slate-400 border-slate-600/40 bg-slate-700/30"
                      }`}>{u.role}</span>
                    </button>
                  ))}
                </div>
              )}

              {search.trim() && suggestions.length === 0 && (
                <p className="text-xs text-slate-600 mt-2 pl-1">No users found</p>
              )}

              {/* Selected members chips */}
              {members.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {members.map((m, i) => (
                    <div key={m._id} className="flex items-center gap-1.5 bg-slate-800 border border-slate-700/50 rounded-full pl-1 pr-2 py-1">
                      <div className={`w-5 h-5 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[9px] font-bold`}>
                        {getInitials(m.name || "")}
                      </div>
                      <span className="text-xs text-slate-300">{m.name || m.email || "Member"}</span>
                      <button type="button" onClick={() => removeMember(m._id)} className="text-slate-600 hover:text-red-400 transition-colors ml-0.5">
                        <XCircle size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                : isEdit ? "Save changes" : "Create project"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
