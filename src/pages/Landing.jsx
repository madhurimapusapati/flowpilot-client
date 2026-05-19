import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">
        FlowPilot
      </h1>

      <p className="text-slate-400">
        Smart Team Task Management Platform
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-violet-600 px-6 py-3 rounded-xl"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="bg-slate-800 px-6 py-3 rounded-xl"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}

export default Landing;