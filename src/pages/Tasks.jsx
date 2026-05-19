import { useState, useMemo } from "react";
import { Plus, RefreshCw, LayoutGrid } from "lucide-react";
import DashboardLayout    from "../layouts/DashboardLayout";
import TaskColumn         from "../components/tasks/TaskColumn";
import TaskModal          from "../components/tasks/TaskModal";
import DeleteConfirmModal from "../components/projects/DeleteConfirmModal";
import useTasks           from "../hooks/useTasks";
import useProjects        from "../hooks/useProjects";
import { useAuth }        from "../context/AuthContext";

const STATUSES = ["todo", "in-progress", "done"];

export default function Tasks() {
  const { projects, loading: projectsLoading } = useProjects();
  const { user, isAdmin } = useAuth();

  // Active project selection — default to first project
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const activeProjectId = selectedProjectId || projects[0]?._id || null;

  const { tasks, loading, submitting, create, update, remove, toggleStatus, reload } =
    useTasks(activeProjectId);

  // Derive project owner ID for permission checks
  const activeProject  = projects.find((p) => p._id === activeProjectId);
  const projectOwnerId = activeProject?.createdBy?._id?.toString()
                      || activeProject?.createdBy?.toString()
                      || null;

  // Modal state
  const [createStatus, setCreateStatus] = useState(null); // column status that triggered add
  const [editTarget,   setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Group tasks by status for kanban columns
  const grouped = useMemo(() => {
    const map = { todo: [], "in-progress": [], done: [] };
    tasks.forEach((t) => { if (map[t.status]) map[t.status].push(t); });
    return map;
  }, [tasks]);

  const handleCreate = async (data) => create(data);
  const handleUpdate = async (data) => update(editTarget._id, data);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <LayoutGrid size={22} className="text-violet-400" />
              Tasks
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {loading
                ? "Loading…"
                : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} in this project`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Project selector */}
            {!projectsLoading && projects.length > 0 && (
              <select
                value={activeProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-slate-900/60 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm
                text-slate-300 focus:outline-none focus:border-violet-500/50 transition-all cursor-pointer
                [color-scheme:dark]"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id} className="bg-slate-900">{p.title}</option>
                ))}
              </select>
            )}

            <button
              onClick={reload}
              className="p-2.5 rounded-xl border border-slate-700/50 text-slate-500
              hover:text-slate-300 hover:bg-slate-800/60 transition-all"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>

            <button
              onClick={() => setCreateStatus("todo")}
              disabled={!activeProjectId}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
              text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200
              shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>

        {/* No projects state */}
        {!projectsLoading && projects.length === 0 && (
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-16 flex flex-col items-center gap-3">
            <p className="text-slate-400 text-sm">No projects found.</p>
            <p className="text-slate-600 text-xs">Create a project first, then add tasks to it.</p>
          </div>
        )}

        {/* Task summary strip */}
        {!loading && tasks.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "To Do",       count: grouped.todo.length,           color: "text-slate-400",   dot: "bg-slate-500"   },
              { label: "In Progress", count: grouped["in-progress"].length,  color: "text-blue-400",    dot: "bg-blue-400"    },
              { label: "Done",        count: grouped.done.length,            color: "text-emerald-400", dot: "bg-emerald-400" },
            ].map(({ label, count, color, dot }) => (
              <div key={label} className="bg-slate-900/40 border border-slate-700/40 rounded-xl px-4 py-3 flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
                <span className="text-xs text-slate-500">{label}</span>
                <span className={`ml-auto text-sm font-bold ${color}`}>{count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Kanban board */}
        {activeProjectId && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <TaskColumn
                key={status}
                status={status}
                tasks={grouped[status]}
                loading={loading}
                onAdd={() => setCreateStatus(status)}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onToggleStatus={toggleStatus}
                currentUserId={user?._id}
                isAdmin={isAdmin}
                projectOwnerId={projectOwnerId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      {createStatus !== null && (
        <TaskModal
          task={null}
          defaultStatus={createStatus}
          onSubmit={handleCreate}
          onClose={() => setCreateStatus(null)}
          submitting={submitting}
        />
      )}

      {/* Edit modal */}
      {editTarget && (
        <TaskModal
          task={editTarget}
          defaultStatus={null}
          onSubmit={handleUpdate}
          onClose={() => setEditTarget(null)}
          submitting={submitting}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirmModal
          project={{ _id: deleteTarget._id, title: deleteTarget.title }}
          onConfirm={(id) => remove(id)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </DashboardLayout>
  );
}
