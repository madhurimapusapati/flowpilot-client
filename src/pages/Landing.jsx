import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, FolderKanban, Users,
  LayoutDashboard, CheckSquare, Shield, Zap,
  BarChart3, Bell, ChevronRight,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: FolderKanban,
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    title: "Project Management",
    desc: "Create and manage projects with status tracking, progress bars, and team member assignments all in one place.",
  },
  {
    icon: CheckSquare,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Kanban Task Board",
    desc: "Visualize your workflow with a 3-column kanban board. Drag tasks from To Do → In Progress → Done instantly.",
  },
  {
    icon: Users,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Team Collaboration",
    desc: "Invite team members, assign tasks, and see who's working on what across every project in real time.",
  },
  {
    icon: BarChart3,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    title: "Live Analytics",
    desc: "Dashboard with real-time stats — total projects, task completion rates, average progress, and more.",
  },
  {
    icon: Shield,
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
    title: "Role-Based Access",
    desc: "Admin and Member roles with granular permissions. Admins manage everything, members focus on their work.",
  },
  {
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    title: "Instant Updates",
    desc: "Optimistic UI updates mean your changes appear instantly — no waiting for server responses.",
  },
];

const stats = [
  { value: "3",    label: "Minute setup"      },
  { value: "100%", label: "Free to deploy"    },
  { value: "2",    label: "Roles supported"   },
  { value: "∞",    label: "Projects & tasks"  },
];

const steps = [
  { step: "01", title: "Create an account",    desc: "Sign up as a member or admin in seconds. No credit card required." },
  { step: "02", title: "Create your project",  desc: "Add a project, set a due date, and invite your team members." },
  { step: "03", title: "Add tasks",            desc: "Break your project into tasks, assign priorities, and track progress on the kanban board." },
  { step: "04", title: "Ship together",        desc: "Monitor your dashboard, update statuses, and hit your deadlines as a team." },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Product Manager",
    avatar: "SK",
    color: "bg-violet-500",
    text: "FlowPilot replaced three tools for our team. The kanban board and role system are exactly what we needed.",
  },
  {
    name: "James R.",
    role: "Engineering Lead",
    avatar: "JR",
    color: "bg-blue-500",
    text: "The dark UI is gorgeous and the performance is snappy. Optimistic updates make it feel like a native app.",
  },
  {
    name: "Priya N.",
    role: "Startup Founder",
    avatar: "PN",
    color: "bg-emerald-500",
    text: "Set up in under 5 minutes, deployed on Railway for free. Our whole team was onboarded the same day.",
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600
        flex items-center justify-center shadow-lg shadow-violet-500/30">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L7 12L13 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className="text-lg font-bold text-white tracking-tight">FlowPilot</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#080b14] text-white overflow-x-hidden">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-5%] w-[700px] h-[700px] bg-violet-600/8 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-purple-700/6 rounded-full blur-[100px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Logo />
        <div className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"
            className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-slate-800/60">
            Login
          </Link>
          <Link to="/signup"
            className="flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600
            hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl transition-all
            shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 text-center px-6 pt-20 pb-28 max-w-5xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/25
          text-violet-300 text-xs font-semibold px-4 py-2 rounded-full mb-8">
          <Zap size={12} className="text-violet-400" />
          Full-stack project management — built and deployed
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Manage projects.
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Ship faster.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          FlowPilot is a dark-themed team task manager with kanban boards, role-based access,
          live analytics, and a beautiful UI — built for teams that move fast.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Link to="/signup"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
            hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl
            transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50
            hover:-translate-y-0.5 text-base">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login"
            className="flex items-center gap-2 text-slate-400 hover:text-white border border-slate-700/60
            hover:border-slate-600 px-8 py-3.5 rounded-xl transition-all text-base hover:bg-slate-800/40">
            Sign in <ChevronRight size={16} />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
          {["No credit card required", "Free to deploy on Railway", "Open source friendly", "JWT secured"].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dashboard preview ── */}
      <section className="relative z-10 px-6 max-w-6xl mx-auto mb-28">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden
          shadow-2xl shadow-black/60">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-900/80">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <div className="flex-1 mx-4 bg-slate-800 rounded-lg px-3 py-1 text-xs text-slate-600 text-center">
              flowpilot.railway.app/dashboard
            </div>
          </div>

          {/* Mock dashboard UI */}
          <div className="p-6 bg-[#080b14]">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Total Projects", value: "12", color: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/20", text: "text-violet-400" },
                { label: "Total Tasks",    value: "48", color: "from-blue-500/20 to-blue-500/5",     border: "border-blue-500/20",   text: "text-blue-400"   },
                { label: "Projects Done",  value: "5",  color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400" },
                { label: "Avg Progress",   value: "72%", color: "from-amber-500/20 to-amber-500/5",  border: "border-amber-500/20",  text: "text-amber-400"  },
              ].map((s) => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-xl p-3`}>
                  <p className={`text-xl font-bold ${s.text}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Kanban preview */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "To Do", dot: "bg-slate-500", border: "border-slate-700/40", tasks: ["Design homepage", "Write API docs"] },
                { label: "In Progress", dot: "bg-blue-400", border: "border-blue-500/20", tasks: ["Build auth system", "Setup CI/CD"] },
                { label: "Done", dot: "bg-emerald-400", border: "border-emerald-500/20", tasks: ["Database schema", "Deploy backend"] },
              ].map((col) => (
                <div key={col.label} className={`border ${col.border} rounded-xl p-3 bg-slate-900/40`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-xs font-semibold text-slate-400">{col.label}</span>
                    <span className="ml-auto text-xs text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded-full">
                      {col.tasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {col.tasks.map((t) => (
                      <div key={t} className="bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2">
                        <p className="text-xs text-slate-300">{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 px-6 max-w-4xl mx-auto mb-28">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-1">
                {value}
              </p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 px-6 max-w-6xl mx-auto mb-28">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Everything your team needs
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A complete project management toolkit — from task tracking to team roles — all in one clean interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title}
              className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6
              hover:border-slate-600/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30
              transition-all duration-300 group">
              <div className={`w-11 h-11 rounded-xl ${bg} border flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors">
                {title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative z-10 px-6 max-w-4xl mx-auto mb-28">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Up and running in minutes
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            No complicated setup. Just sign up, create a project, and start shipping.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map(({ step, title, desc }, i) => (
            <div key={step}
              className="flex items-start gap-5 bg-slate-900/50 border border-slate-700/50
              rounded-2xl p-5 hover:border-slate-600/60 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20
                border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-violet-400">{step}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden sm:block ml-auto text-slate-700">
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="relative z-10 px-6 max-w-5xl mx-auto mb-28">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Loved by teams
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, avatar, color, text }) => (
            <div key={name}
              className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6
              hover:border-slate-600/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30
              transition-all duration-300">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#a78bfa">
                    <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5 4.5 4z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{name}</p>
                  <p className="text-xs text-slate-600">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 px-6 max-w-3xl mx-auto mb-28 text-center">
        <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20
          rounded-3xl p-12 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-violet-500/20 blur-[60px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Ready to take control?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Join FlowPilot and bring clarity to your team's work. Free to use, free to deploy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup"
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600
                hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-3.5
                rounded-xl transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50
                hover:-translate-y-0.5 text-sm">
                Create free account <ArrowRight size={15} />
              </Link>
              <Link to="/login"
                className="text-sm text-slate-400 hover:text-white transition-colors">
                Already have an account? Sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-800/60 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-slate-600">
            Built with React, Node.js, MongoDB & Tailwind CSS
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <Link to="/login"  className="hover:text-slate-400 transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-slate-400 transition-colors">Signup</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
