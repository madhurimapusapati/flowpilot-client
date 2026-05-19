import { useState, useEffect } from "react";
import { fetchDashboardStats } from "../services/projectService";

const DEFAULT = {
  totalProjects: 0,
  byStatus: { Planning: 0, Active: 0, Completed: 0 },
  avgProgress: 0,
  totalTasks: 0,
  completedTasks: 0,
  recentProjects: [],
};

export default function useDashboardStats() {
  const [stats, setStats]   = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || "Failed to load stats");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading, error };
}
