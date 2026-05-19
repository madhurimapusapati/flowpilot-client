import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchProjects      = ()         => API.get("/projects");
export const fetchDashboardStats = ()         => API.get("/projects/stats");
export const createProject      = (data)     => API.post("/projects", data);
export const updateProject      = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject      = (id)       => API.delete(`/projects/${id}`);
