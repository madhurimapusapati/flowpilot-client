import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Loader2, Shield, Users } from "lucide-react";
import toast from "react-hot-toast";

import { signupUser } from "../services/authService";
import { useAuth }    from "../context/AuthContext";
import AuthLayout     from "../components/auth/AuthLayout";
import InputField     from "../components/auth/InputField";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "member", adminKey: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const setRole = (role) =>
    setForm((p) => ({ ...p, role, adminKey: "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast.error("All fields are required");
    }
    if (form.role === "admin" && !form.adminKey) {
      return toast.error("Admin secret key is required");
    }

    setLoading(true);
    try {
      const payload = {
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role,
        ...(form.role === "admin" && { adminKey: form.adminKey }),
      };

      const { data } = await signupUser(payload);
      login(data.token, {
        _id: data._id, name: data.name, email: data.email, role: data.role,
      });
      toast.success(`Welcome to FlowPilot, ${data.name}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Choose your role and sign up">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <InputField
          label="Name"
          name="name"
          type="text"
          icon={User}
          value={form.name}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          value={form.password}
          onChange={handleChange}
        />

        {/* Role selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Sign up as
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "member", label: "Member",  icon: Users,  desc: "Access assigned projects" },
              { value: "admin",  label: "Admin",   icon: Shield, desc: "Full access to everything" },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border text-sm
                font-medium transition-all duration-150
                ${form.role === value
                  ? value === "admin"
                    ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                    : "bg-slate-700/60 border-slate-500/60 text-slate-200"
                  : "bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-slate-300 hover:border-slate-600"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
                <span className="text-[10px] font-normal text-slate-600 text-center leading-tight">
                  {desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Admin secret key — only shown when Admin is selected */}
        {form.role === "admin" && (
          <div className="space-y-1">
            <InputField
              label="Admin Secret Key"
              name="adminKey"
              type="password"
              icon={Shield}
              value={form.adminKey}
              onChange={handleChange}
              placeholder="Enter the admin secret key"
            />
            <p className="text-xs text-slate-600 pl-1">
              Contact your workspace owner for the admin key.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 bg-gradient-to-r from-violet-600 to-indigo-600
          hover:from-violet-500 hover:to-indigo-500
          disabled:opacity-60 disabled:cursor-not-allowed
          text-white py-3 rounded-xl flex items-center justify-center gap-2
          transition-all font-medium shadow-lg shadow-violet-500/20"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Create Account"}
        </button>

        <p className="text-sm text-center text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
