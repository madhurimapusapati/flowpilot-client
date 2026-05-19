import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginUser       = (data) => API.post("/auth/login",    data);
export const signupUser      = (data) => API.post("/auth/signup",   data);
export const getMe           = ()     => API.get ("/auth/me");
export const updateProfile   = (data) => API.put ("/auth/profile",  data);
export const updatePassword  = (data) => API.put ("/auth/password", data);
