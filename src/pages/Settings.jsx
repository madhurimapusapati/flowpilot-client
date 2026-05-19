import { useState } from "react";
import {
  User, Lock, Save, Loader2, CheckCircle2,
  Shield, Mail, Eye, EyeOff, Crown, UserCog,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth }     from "../context/AuthContext";
import { updateProfile, updatePassword } from "../services/authService";
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
const promoteUser = (data) => API.put("/auth/promote", data);

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";
}

// ── Shared primitives ─────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function TextInput({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />}
      <input
        {...props}
        className={`w-full bg-slate-800/60 border ${error ? "border-red-500/60" : "border-slate-700/60"}
        rounded-xl ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600
        focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all`}
      />
    </div>
  );
}

function PasswordInput({ error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`w-full bg-slate-800/60 border ${error ? "border-red-500/60" : "border-slate-700/60"}
        rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600
        focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

// ── Profile tab ───────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user, login, token } = useAuth();
  const [form, setForm]     = useState({ name: user?.name || "", email: user?.email || "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      login(token, { _id: data._id, name: data.name, email: data.email, role: data.role });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar preview */}
      <div className="flex items-center gap-4 p-4 bg-slate-800/40 border border-slate-700/40 rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600
          flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-500/20 flex-shrink-0">
          {getInitials(form.name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{form.name || "Your Name"}</p>
          <p className="text-xs text-slate-500 mt-0.5">{form.email || "your@email.com"}</p>
          <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border
            ${user?.role === "admin"
              ? "text-violet-400 bg-violet-500/10 border-violet-500/25"
              : "text-slate-400 bg-slate-500/10 border-slate-500/25"}`}>
            {user?.role === "admin" ? "⚡ Admin" : "Member"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <Field label="Full name" error={errors.name}>
          <TextInput
            icon={User}
            value={form.name}
            onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: "" })); }}
            placeholder="Your full name"
            error={errors.name}
          />
        </Field>
        <Field label="Email address" error={errors.email}>
          <TextInput
            icon={Mail}
            type="email"
            value={form.email}
            onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: "" })); }}
            placeholder="you@example.com"
            error={errors.email}
          />
        </Field>
      </div>

      <div className="p-3.5 bg-slate-800/30 border border-slate-700/40 rounded-xl">
        <p className="text-xs text-slate-500">
          <span className="text-slate-400 font-medium">Role: </span>
          {user?.role === "admin"
            ? "Admin — full access to all projects and settings"
            : "Member — access to assigned projects and tasks"}
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
        hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
        text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all
        shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35"
      >
        {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
          : saved ? <><CheckCircle2 size={15} className="text-emerald-400" /> Saved!</>
          : <><Save size={15} /> Save changes</>}
      </button>
    </form>
  );
}

// ── Security tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm]     = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.currentPassword)             e.currentPassword = "Current password is required";
    if (!form.newPassword)                 e.newPassword     = "New password is required";
    else if (form.newPassword.length < 6)  e.newPassword     = "Minimum 6 characters";
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setSaving(true);
    try {
      await updatePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success("Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const strength = (() => {
    const p = form.newPassword;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6)  s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];
  const strengthText  = ["", "text-red-400", "text-amber-400", "text-blue-400", "text-emerald-400"];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-blue-500/8 border border-blue-500/20 rounded-xl">
        <Shield size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          Use a strong password with at least 8 characters, including uppercase letters, numbers, and symbols.
        </p>
      </div>

      <Field label="Current password" error={errors.currentPassword}>
        <PasswordInput value={form.currentPassword} onChange={set("currentPassword")}
          placeholder="Enter current password" autoComplete="current-password" error={errors.currentPassword} />
      </Field>

      <Field label="New password" error={errors.newPassword}>
        <PasswordInput value={form.newPassword} onChange={set("newPassword")}
          placeholder="Enter new password" autoComplete="new-password" error={errors.newPassword} />
        {form.newPassword.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300
                  ${i <= strength ? strengthColor[strength] : "bg-slate-700"}`} />
              ))}
            </div>
            <p className={`text-xs font-medium ${strengthText[strength]}`}>{strengthLabel[strength]}</p>
          </div>
        )}
      </Field>

      <Field label="Confirm new password" error={errors.confirmPassword}>
        <PasswordInput value={form.confirmPassword} onChange={set("confirmPassword")}
          placeholder="Repeat new password" autoComplete="new-password" error={errors.confirmPassword} />
        {form.confirmPassword.length > 0 && (
          <p className={`text-xs mt-1 font-medium ${form.newPassword === form.confirmPassword ? "text-emerald-400" : "text-red-400"}`}>
            {form.newPassword === form.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
          </p>
        )}
      </Field>

      <button type="submit" disabled={saving}
        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
        hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
        text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20">
        {saving ? <><Loader2 size={15} className="animate-spin" /> Updating…</> : <><Lock size={15} /> Update password</>}
      </button>
    </form>
  );
}

// ── Admin tab ─────────────────────────────────────────────────────────────────
function AdminTab() {
  const [email, setEmail]   = useState("");
  const [role,  setRole]    = useState("admin");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null); // { name, email, role }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required");
    setSaving(true);
    setResult(null);
    try {
      const { data } = await promoteUser({ email: email.trim(), role });
      setResult(data.user);
      toast.success(data.message);
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/8 border border-amber-500/20 rounded-xl">
        <Crown size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-400 mb-0.5">Admin-only action</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Promoting a user to admin gives them full access to all projects, tasks, and settings.
            Only do this for trusted team members.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="User email">
          <TextInput
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@example.com"
          />
        </Field>

        <Field label="Assign role">
          <div className="flex gap-2">
            {["admin", "member"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all
                ${role === r
                  ? r === "admin"
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "bg-slate-700/60 border-slate-600 text-slate-200"
                  : "bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-slate-300 hover:border-slate-600"}`}
              >
                {r === "admin" ? <Crown size={14} /> : <User size={14} />}
                <span className="capitalize">{r}</span>
              </button>
            ))}
          </div>
        </Field>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
          hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
          text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20"
        >
          {saving
            ? <><Loader2 size={15} className="animate-spin" /> Updating…</>
            : <><UserCog size={15} /> Apply role</>}
        </button>
      </form>

      {/* Success result */}
      {result && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">{result.name}</p>
            <p className="text-xs text-slate-500">{result.email}</p>
          </div>
          <span className={`ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full border
            ${result.role === "admin"
              ? "text-violet-400 bg-violet-500/10 border-violet-500/25"
              : "text-slate-400 bg-slate-500/10 border-slate-500/25"}`}>
            {result.role === "admin" ? "⚡ Admin" : "Member"}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Settings() {
  const { isAdmin }     = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const TABS = [
    { id: "profile",  label: "Profile",  icon: User   },
    { id: "security", label: "Security", icon: Shield  },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: Crown }] : []),
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your profile and account security</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-900/60 border border-slate-700/50 rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
              ${activeTab === id
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          {activeTab === "profile"  && <ProfileTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "admin"    && isAdmin && <AdminTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
