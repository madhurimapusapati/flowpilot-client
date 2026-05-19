import { useMemo } from "react";
import { Users, FolderKanban, Crown, User } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import useProjects     from "../hooks/useProjects";
import { useAuth }     from "../context/AuthContext";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500",  "bg-pink-500", "bg-cyan-500",
  "bg-red-500",    "bg-teal-500",
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function MemberSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-slate-700/60 flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-3.5 bg-slate-700/60 rounded w-2/5" />
          <div className="h-3 bg-slate-800 rounded w-3/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-4/5" />
      </div>
    </div>
  );
}

export default function Team() {
  const { projects, loading } = useProjects();
  const { user: currentUser } = useAuth();

  // Build a map of unique members across all projects
  const { members, memberProjects } = useMemo(() => {
    const memberMap   = new Map(); // id → { member object }
    const projectsMap = new Map(); // id → [project titles]

    projects.forEach((project) => {
      (project.members || []).forEach((member) => {
        const id = member._id?.toString() || member.toString();
        if (!memberMap.has(id)) memberMap.set(id, member);
        if (!projectsMap.has(id)) projectsMap.set(id, []);
        projectsMap.get(id).push({
          title:     project.title,
          isOwner:   project.createdBy?._id?.toString() === id ||
                     project.createdBy?.toString()       === id,
        });
      });
    });

    return {
      members:        Array.from(memberMap.values()),
      memberProjects: projectsMap,
    };
  }, [projects]);

  const totalProjects = projects.length;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-[1400px] mx-auto space-y-6">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users size={22} className="text-violet-400" />
              Team
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {loading
                ? "Loading…"
                : `${members.length} member${members.length !== 1 ? "s" : ""} across ${totalProjects} project${totalProjects !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Summary strip */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Members",  value: members.length,   color: "text-violet-400",  icon: Users        },
              { label: "Total Projects", value: totalProjects,    color: "text-blue-400",    icon: FolderKanban },
              { label: "Project Owners", value: projects.length,  color: "text-emerald-400", icon: Crown        },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3">
                <Icon size={16} className={`${color} flex-shrink-0`} />
                <div>
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-slate-600">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Member grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <MemberSkeleton key={i} />)}
          </div>
        ) : members.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-16 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Users size={26} className="text-violet-400/60" />
            </div>
            <p className="text-slate-400 text-sm font-medium">No team members yet</p>
            <p className="text-slate-600 text-xs text-center max-w-xs">
              Create projects and add members to start building your team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map((member, idx) => {
              const id       = member._id?.toString() || member.toString();
              const name     = member.name  || "Unknown";
              const email    = member.email || "";
              const isYou    = id === currentUser?._id;
              const assigned = memberProjects.get(id) || [];
              const ownerOf  = assigned.filter((p) => p.isOwner);
              const colorCls = AVATAR_COLORS[idx % AVATAR_COLORS.length];

              return (
                <div
                  key={id}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5
                  hover:border-slate-600/60 transition-all duration-200 hover:-translate-y-0.5
                  hover:shadow-xl hover:shadow-black/20"
                >
                  {/* Member header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-11 h-11 rounded-full ${colorCls} flex items-center justify-center
                      text-white text-sm font-bold flex-shrink-0 shadow-lg`}>
                      {getInitials(name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white truncate">{name}</p>
                        {isYou && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full
                          bg-violet-500/15 text-violet-400 border border-violet-500/25">
                            You
                          </span>
                        )}
                        {ownerOf.length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5
                          rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
                            <Crown size={9} /> Owner
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>
                    </div>
                  </div>

                  {/* Project assignments */}
                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-600 font-medium mb-2">
                      {assigned.length} project{assigned.length !== 1 ? "s" : ""}
                    </p>
                    {assigned.length === 0 ? (
                      <p className="text-xs text-slate-700">No projects assigned</p>
                    ) : (
                      assigned.slice(0, 3).map((p, i) => (
                        <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/50">
                          <FolderKanban size={11} className="text-slate-600 flex-shrink-0" />
                          <span className="text-xs text-slate-400 truncate flex-1">{p.title}</span>
                          {p.isOwner && (
                            <Crown size={10} className="text-amber-500 flex-shrink-0" />
                          )}
                        </div>
                      ))
                    )}
                    {assigned.length > 3 && (
                      <p className="text-xs text-slate-600 pl-2">
                        +{assigned.length - 3} more project{assigned.length - 3 !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
