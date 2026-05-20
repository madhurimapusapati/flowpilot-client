import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchTasks        = (projectId) => API.get(`/tasks?project=${projectId}`);
export const fetchRecentTasks  = ()           => API.get("/tasks/recent");
export const fetchOverdueTasks = ()           => API.get("/tasks/overdue");
export const createTask        = (data)       => API.post("/tasks", data);
export const updateTask        = (id, data)   => API.put(`/tasks/${id}`, data);
export const deleteTask        = (id)         => API.delete(`/tasks/${id}`);
