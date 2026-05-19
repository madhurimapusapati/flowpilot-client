import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import InputField from "../components/auth/InputField";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.token, { _id: data._id, name: data.name, email: data.email, role: data.role });
      toast.success(`Welcome back, ${data.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Login to continue">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField label="Email"    name="email"    type="email"    icon={Mail} value={form.email}    onChange={handleChange} />
        <InputField label="Password" name="password" type="password" icon={Lock} value={form.password} onChange={handleChange} />

        <button
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed
          text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Login"}
        </button>

        <p className="text-sm text-center text-slate-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium">Signup</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
