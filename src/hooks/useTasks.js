import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { fetchTasks, createTask, updateTask, deleteTask } from "../services/taskService";

export default function useTasks(projectId) {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const { data } = await fetchTasks(projectId);
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  const create = async (formData) => {
    setSubmitting(true);
    try {
      const { data } = await createTask({ ...formData, project: projectId });
      setTasks((prev) => [data, ...prev]);
      toast.success("Task created!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (id, formData) => {
    setSubmitting(true);
    try {
      const { data } = await updateTask(id, formData);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
      toast.success("Task updated!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Optimistic status toggle — updates UI instantly, rolls back on error
  const toggleStatus = async (task) => {
    const cycle = { todo: "in-progress", "in-progress": "done", done: "todo" };
    const nextStatus = cycle[task.status];
    setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, status: nextStatus } : t));
    try {
      const { data } = await updateTask(task._id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? data : t)));
    } catch {
      // Roll back
      setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, status: task.status } : t));
      toast.error("Failed to update status");
    }
  };

  const remove = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  return { tasks, loading, submitting, create, update, remove, toggleStatus, reload: load };
}
