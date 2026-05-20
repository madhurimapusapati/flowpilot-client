import { useState, useMemo } from "react";
import { Plus, RefreshCw } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectModal from "../components/projects/ProjectModal";
import DeleteConfirmModal from "../components/projects/DeleteConfirmModal";
import ProjectSkeleton from "../components/projects/ProjectSkeleton";
import EmptyState from "../components/projects/EmptyState";
import ProjectFilters from "../components/projects/ProjectFilters";
import useProjects from "../hooks/useProjects";
import { useAuth } from "../context/AuthContext";

const STATUS_SUMMARY_STYLES = {
  Planning:  { dot: "bg-amber-400",   text: "text-amber-400",   bg: "bg-amber-500/8  border-amber-500/20"  },
  Active:    { dot: "bg-emerald-400", text: "text-emerald-400", bg: "bg-emerald-500/8 border-emerald-500/20" },
  Completed: { dot: "bg-blue-400",    text: "text-blue-400",    bg: "bg-blue-500/8   border-blue-500/20"   },
};

export default function Projects() {
  const { projects, loading, submitting, create, update, remove, changeStatus, changeProgress, reload } = useProjects();
  const { user, isAdmin } = useAuth();

  // Modal state
  const [createOpen, setCreateOpen]   = useState(false);
  const [editTarget, setEditTarget]   = useState(null);   // project object
  const [deleteTarget, setDeleteTarget] = useState(null); // project object

  // Filter state
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState("All");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === "All" || p.status === status;
      return matchSearch && matchStatus;
    });
  }, [projects, search, status]);

  // Status summary counts
  const counts = useMemo(() => {
    return ["Planning", "Active", "Completed"].map((s) => ({
      label: s,
      count: projects.filter((p) => p.status === s).length,
    }));
  }, [projects]);

  const handleCreate = async (data) => create(data);
  const handleUpdate = async (data) => update(editTarget._id, data);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
            <p className="text-slate-500 text-sm mt-1">
              {loading ? "Loading..." : `${projects.length} project${projects.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reload}
              className="p-2.5 rounded-xl border border-slate-700/50 text-slate-500 hover:text-slate-300
              hover:bg-slate-800/60 transition-all"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            {isAdmin && (
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold
              px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25
              hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus size={16} />
              New Project
            </button>
            )}
          </div>
        </div>

        {/* Status summary strip */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {counts.map(({ label, count }) => {
              const s = STATUS_SUMMARY_STYLES[label];
              return (
                <button
                  key={label}
                  onClick={() => setStatus(status === label ? "All" : label)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-150
                  ${status === label ? s.bg : "bg-slate-900/40 border-slate-700/40 hover:border-slate-600/50"}`}
                >
                  <div className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`} />
                  <span className="text-xs font-medium text-slate-400">{label}</span>
                  <span className={`ml-auto text-sm font-bold ${s.text}`}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Filters */}
        {!loading && projects.length > 0 && (
          <ProjectFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            total={projects.length}
            filtered={filtered.length}
          />
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProjectSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            filtered={projects.length > 0}
            onCreateClick={() => setCreateOpen(true)}
            isAdmin={isAdmin}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
                onStatusChange={changeStatus}
                onProgressChange={changeProgress}
                currentUserId={user?._id}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      {createOpen && (
        <ProjectModal
          project={null}
          onSubmit={handleCreate}
          onClose={() => setCreateOpen(false)}
          submitting={submitting}
        />
      )}

      {/* Edit modal */}
      {editTarget && (
        <ProjectModal
          project={editTarget}
          onSubmit={handleUpdate}
          onClose={() => setEditTarget(null)}
          submitting={submitting}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirmModal
          project={deleteTarget}
          onConfirm={remove}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </DashboardLayout>
  );
}
