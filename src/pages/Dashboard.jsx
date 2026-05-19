import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Plus, FolderKanban, Layers, Circle, Clock, CheckCircle2, Calendar } from "lucide-react";

import DashboardLayout    from "../layouts/DashboardLayout";
import StatCard           from "../components/dashboard/StatCard";
import SectionHeader      from "../components/dashboard/SectionHeader";
import { useAuth }        from "../context/AuthContext";
import useDashboardStats  from "../hooks/useDashboardStats";
import { fetchRecentTasks } from "../services/taskService";

// ── Skeleton helpers ──────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5 animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="w-10 h-10 rounded-xl bg-slate-700/60" />
        <div className="w-24 h-4 rounded-lg bg-slate-700/60" />
      </div>
      <div className="space-y-2">
        <div className="w-16 h-8 rounded-lg bg-slate-700/60" />
        <div className="w-28 h-3 rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}

function ProjectRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-slate-700/60 rounded w-2/5" />
        <div className="h-2.5 bg-slate-800 rounded w-1/4" />
      </div>
      <div className="w-16 h-1.5 bg-slate-800 rounded-full" />
      <div className="w-12 h-5 bg-slate-700/60 rounded-full" />
    </div>
  );
}

// ── Status badge config ───────────────────────────────────────────────────────
const STATUS_STYLES = {
  Planning:  { pill: "text-amber-400  bg-amber-500/10  border-amber-500/25",  bar: "from-amber-500  to-orange-500" },
  Active:    { pill: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", bar: "from-violet-500 to-indigo-500" },
  Completed: { pill: "text-blue-400   bg-blue-500/10   border-blue-500/25",   bar: "from-blue-500   to-cyan-500"   },
};

const AVATAR_COLORS = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-pink-500","bg-cyan-500"];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Greeting helper ───────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user }           = useAuth();
  const { stats, loading } = useDashboardStats();
  const navigate           = useNavigate();

  // Recent tasks — real data
  const [recentTasks, setRecentTasks]       = useState([]);
  const [tasksLoading, setTasksLoading]     = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchRecentTasks()
      .then(({ data }) => { if (!cancelled) setRecentTasks(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTasksLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const firstName = user?.name?.split(" ")[0] || "there";

  // Build stat cards from real data
  const statCards = [
    {
      id: "total",
      label: "Total Projects",
      value: String(stats.totalProjects),
      change: `${stats.byStatus.Active} active`,
      trend: "up",
      color: "violet",
      icon: "Folders",
    },
    {
      id: "tasks",
      label: "Total Tasks",
      value: String(stats.totalTasks),
      change: `${stats.completedTasks} completed`,
      trend: "up",
      color: "blue",
      icon: "CheckSquare",
    },
    {
      id: "completed",
      label: "Projects Done",
      value: String(stats.byStatus.Completed),
      change: "all time",
      trend: "neutral",
      color: "emerald",
      icon: "Users",
    },
    {
      id: "progress",
      label: "Avg Progress",
      value: `${stats.avgProgress}%`,
      change: "across projects",
      trend: "up",
      color: "amber",
      icon: "TrendingUp",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1400px] mx-auto space-y-8">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {greeting()}, {firstName} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">{today}</p>
          </div>
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
            hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold
            px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/25
            hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : statCards.map((s) => <StatCard key={s.id} {...s} />)
          }
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Tasks — real data */}
          <div className="xl:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5">
            <SectionHeader
              title="Recent Tasks"
              subtitle="Latest across all your projects"
              action="View all tasks"
              onAction={() => navigate("/tasks")}
            />
            {tasksLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-slate-800/60 animate-pulse" />
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <p className="text-slate-600 text-sm">No tasks yet</p>
                <button
                  onClick={() => navigate("/tasks")}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Go to Tasks →
                </button>
              </div>
            ) : (
              <div className="space-y-0.5">
                {recentTasks.map((task) => {
                  const STATUS_ICON = { todo: Circle, "in-progress": Clock, done: CheckCircle2 };
                  const PRIORITY_COLORS = {
                    critical: "text-red-400 bg-red-500/10 border-red-500/30",
                    high:     "text-orange-400 bg-orange-500/10 border-orange-500/30",
                    medium:   "text-blue-400 bg-blue-500/10 border-blue-500/30",
                    low:      "text-slate-400 bg-slate-500/10 border-slate-500/30",
                  };
                  const Icon = STATUS_ICON[task.status] || Circle;
                  const iconColor = task.status === "done" ? "text-emerald-400" : task.status === "in-progress" ? "text-blue-400" : "text-slate-600";
                  return (
                    <div
                      key={task._id}
                      onClick={() => navigate("/tasks")}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer border border-transparent hover:border-slate-700/50"
                    >
                      <Icon size={15} className={`flex-shrink-0 ${iconColor}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          task.status === "done" ? "line-through text-slate-500" : "text-slate-200"
                        }`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-600 truncate">{task.project?.title}</span>
                          {task.dueDate && (
                            <>
                              <span className="text-slate-700">·</span>
                              <span className="flex items-center gap-1 text-xs text-slate-600">
                                <Calendar size={10} />
                                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wide flex-shrink-0 ${
                        PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
                      }`}>{task.priority}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status breakdown — real data */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5">
            <SectionHeader title="Project Status" subtitle="Live breakdown" />

            {loading ? (
              <div className="space-y-3 mt-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-800/60 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                {Object.entries(stats.byStatus).map(([status, count]) => {
                  const s = STATUS_STYLES[status];
                  const pct = stats.totalProjects
                    ? Math.round((count / stats.totalProjects) * 100)
                    : 0;
                  return (
                    <div key={status} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${s.pill}`}>
                          {status}
                        </span>
                        <span className="text-sm font-bold text-white">{count}</span>
                      </div>
                      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${s.bar} rounded-full transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick counts strip */}
            <div className="mt-5 pt-4 border-t border-slate-800/60 grid grid-cols-3 gap-2">
              {[
                { label: "Planning", value: stats.byStatus.Planning, color: "text-amber-400"  },
                { label: "Active",   value: stats.byStatus.Active,   color: "text-emerald-400" },
                { label: "Done",     value: stats.byStatus.Completed, color: "text-blue-400"  },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-2 rounded-xl bg-slate-800/40">
                  <p className={`text-lg font-bold ${color}`}>
                    {loading ? "—" : value}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Projects — real data */}
        <div>
          <SectionHeader
            title="Recent Projects"
            subtitle={loading ? "Loading…" : `${stats.totalProjects} project${stats.totalProjects !== 1 ? "s" : ""} total`}
            action="View all projects"
            onAction={() => navigate("/projects")}
          />

          {loading ? (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl divide-y divide-slate-800/60">
              {Array.from({ length: 4 }).map((_, i) => <ProjectRowSkeleton key={i} />)}
            </div>
          ) : stats.recentProjects.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <FolderKanban size={22} className="text-violet-400/60" />
              </div>
              <p className="text-slate-400 text-sm">No projects yet</p>
              <button
                onClick={() => navigate("/projects")}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Create your first project →
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
              {stats.recentProjects.map((project, idx) => {
                const s = STATUS_STYLES[project.status] || STATUS_STYLES.Planning;
                const members = project.members || [];
                return (
                  <div
                    key={project._id}
                    onClick={() => navigate("/projects")}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-800/40 transition-colors cursor-pointer
                    ${idx !== stats.recentProjects.length - 1 ? "border-b border-slate-800/60" : ""}`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bar} flex items-center justify-center flex-shrink-0`}>
                      <Layers size={15} className="text-white" />
                    </div>

                    {/* Title + status */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-200 truncate">{project.title}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${s.pill}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 truncate">
                        {project.description || "No description"}
                        {project.dueDate && ` · Due ${formatDate(project.dueDate)}`}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="hidden sm:flex flex-col items-end gap-1 w-28 flex-shrink-0">
                      <span className="text-xs text-slate-500">{project.progress ?? 0}%</span>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${s.bar} rounded-full`}
                          style={{ width: `${project.progress ?? 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Member avatars */}
                    <div className="hidden md:flex -space-x-2 flex-shrink-0">
                      {members.slice(0, 3).map((m, i) => (
                        <div
                          key={m._id || i}
                          title={m.name}
                          className={`w-6 h-6 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]}
                          border-2 border-slate-900 flex items-center justify-center text-white text-[9px] font-bold`}
                        >
                          {getInitials(m.name)}
                        </div>
                      ))}
                      {members.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900
                          flex items-center justify-center text-slate-400 text-[9px] font-bold">
                          +{members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>
    </DashboardLayout>
  );
}
