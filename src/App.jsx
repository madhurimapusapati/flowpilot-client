import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Landing   from "./pages/Landing";
import Login     from "./pages/Login";
import Signup    from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects  from "./pages/Projects";
import Tasks     from "./pages/Tasks";
import Team      from "./pages/Team";
import Settings  from "./pages/Settings";

function PrivateRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuth } = useAuth();
  return !isAuth ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login"  element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/projects"  element={<PrivateRoute><Projects /></PrivateRoute>} />

      <Route path="/tasks"    element={<PrivateRoute><Tasks /></PrivateRoute>} />
      <Route path="/team"     element={<PrivateRoute><Team /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
