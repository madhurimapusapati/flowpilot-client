import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

export default function useProjects() {
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchProjects();
      setProjects(data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (formData) => {
    setSubmitting(true);
    try {
      const { data } = await createProject(formData);
      setProjects((prev) => [data, ...prev]);
      toast.success("Project created!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (id, formData) => {
    setSubmitting(true);
    try {
      const { data } = await updateProject(id, formData);
      setProjects((prev) => prev.map((p) => (p._id === id ? data : p)));
      toast.success("Project updated!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update project");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete project");
    }
  };

  // Optimistic status cycle — updates UI instantly, rolls back on error
  const changeStatus = async (id, newStatus) => {
    const prev = projects.find((p) => p._id === id);
    setProjects((all) => all.map((p) => p._id === id ? { ...p, status: newStatus } : p));
    try {
      const { data } = await updateProject(id, { status: newStatus });
      setProjects((all) => all.map((p) => p._id === id ? data : p));
    } catch (err) {
      // Roll back
      setProjects((all) => all.map((p) => p._id === id ? prev : p));
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // Optimistic progress update — updates UI instantly, rolls back on error
  const changeProgress = async (id, newProgress) => {
    const prev = projects.find((p) => p._id === id);
    setProjects((all) => all.map((p) => p._id === id ? { ...p, progress: newProgress } : p));
    try {
      const { data } = await updateProject(id, { progress: newProgress });
      setProjects((all) => all.map((p) => p._id === id ? data : p));
    } catch (err) {
      setProjects((all) => all.map((p) => p._id === id ? prev : p));
      toast.error(err.response?.data?.message || "Failed to update progress");
    }
  };

  return { projects, loading, submitting, create, update, remove, changeStatus, changeProgress, reload: load };
}
