# FlowPilot — Frontend

> A premium dark-themed team project management application. Built with React, Tailwind CSS, and Vite. Connects to the FlowPilot REST API.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat&logo=axios&logoColor=white)](https://axios-http.com)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?style=flat&logo=railway&logoColor=white)](https://railway.app)

---

## Features

### Pages
- **Dashboard** — Live stats, recent tasks, recent projects, project status breakdown
- **Projects** — Grid view with search/filter, inline status cycle, inline progress stepper
- **Tasks** — 3-column kanban board (To Do / In Progress / Done) with project selector
- **Team** — All members across projects with role badges and project assignments
- **Settings** — Profile editor, password change, admin user management

### Auth
- JWT-based authentication stored in localStorage
- Role-aware UI — admin sees extra controls, members see only what they own
- Secure admin signup with secret key verification
- Protected and guest route guards

### UX
- Optimistic updates — status and progress changes reflect instantly
- Loading skeletons on every page
- Empty states with contextual CTAs
- Toast notifications for all actions
- Mobile-responsive sidebar with drawer
- Password strength meter on signup and settings

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client with interceptors |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |
| Framer Motion | Animations |

---

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── auth/           # AuthLayout, InputField
│   │   ├── dashboard/      # StatCard, SectionHeader, TaskRow, ProjectCard
│   │   ├── projects/       # ProjectCard, ProjectModal, ProjectFilters, Skeletons
│   │   └── tasks/          # TaskCard, TaskColumn, TaskModal, TaskSkeleton
│   ├── context/
│   │   └── AuthContext.jsx # Global auth state (token, user, isAdmin)
│   ├── hooks/
│   │   ├── useProjects.js          # Project CRUD + optimistic updates
│   │   ├── useTasks.js             # Task CRUD + optimistic toggle
│   │   └── useDashboardStats.js    # Dashboard analytics fetch
│   ├── layouts/
│   │   ├── DashboardLayout.jsx     # Shell with sidebar + navbar
│   │   ├── Sidebar.jsx             # Collapsible nav, mobile drawer
│   │   └── Navbar.jsx              # Search, notifications, profile dropdown
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx      # Role selector + admin key field
│   │   ├── Dashboard.jsx
│   │   ├── Projects.jsx
│   │   ├── Tasks.jsx
│   │   ├── Team.jsx
│   │   └── Settings.jsx    # Profile / Security / Admin tabs
│   ├── services/
│   │   ├── authService.js
│   │   ├── projectService.js
│   │   └── taskService.js
│   ├── App.jsx             # Routes with PrivateRoute / GuestRoute
│   └── main.jsx
├── serve.json              # SPA routing config for production
├── railway.toml            # Railway deployment config
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- FlowPilot backend running locally or deployed

### Local Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/flowpilot-client.git
cd flowpilot-client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your backend URL

# Start development server
npm run dev
```

### Environment Variables

```env
# Development
VITE_API_URL=http://localhost:5000/api

# Production
# VITE_API_URL=https://your-backend.railway.app/api
```

---

## Deployment — Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Select this repository
4. Add environment variable:

```
VITE_API_URL = https://your-backend.railway.app/api
```

5. Railway builds with `npm run build` and serves the `dist` folder
6. Go to Settings → Networking → Generate Domain

> After deploying, copy your frontend URL and set it as `CLIENT_URL` in your backend Railway service to configure CORS correctly.

---

## Auth Flow

```
Signup / Login
    ↓
JWT token + user object saved in localStorage
    ↓
AuthContext provides { token, user, isAuth, isAdmin } globally
    ↓
PrivateRoute guards all dashboard pages
GuestRoute redirects logged-in users away from login/signup
    ↓
Axios interceptors auto-attach Bearer token to every API request
    ↓
Logout clears localStorage + React state → redirects to /login
```

---

## Admin vs Member

| Feature | Member | Admin |
|---|---|---|
| View assigned projects | ✅ | ✅ all |
| Create projects | ✅ | ✅ |
| Edit / delete own projects | ✅ | ✅ |
| Edit / delete any project | ❌ | ✅ |
| Create / edit tasks | ✅ | ✅ |
| Delete own tasks | ✅ | ✅ |
| Delete any task | ❌ | ✅ |
| Settings → Admin tab | ❌ | ✅ |
| Promote / demote users | ❌ | ✅ |

---

## Related

- [FlowPilot Backend](https://github.com/YOUR_USERNAME/flowpilot-server) — REST API

---

## License

MIT
