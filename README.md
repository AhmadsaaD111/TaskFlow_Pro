# TaskFlow Pro

TaskFlow Pro is a production-style project management SaaS frontend built with Vue 3 and TypeScript, designed to demonstrate real-world patterns like modular architecture, role-based permissions, audit-friendly activity tracking, and resilient UX with global error handling—all backed by a mocked REST API persisted in `localStorage`.

## Key Features

- **Project & task management (Kanban)**
  - Create and manage projects
  - Kanban board with drag & drop task workflow
  - Task fields: status, priority, due date, assignee
  - Mocked comments per task
- **Role-Based Access Control (RBAC)**
  - Admin / Member roles
  - Action-level permissions enforced in both UI and store layer
- **Project activity log (audit trail)**
  - Per-project activity feed persisted via the mock API
  - Tracks key actions like project creation, task creation, task movement, and assignment
- **Search & filters**
  - Projects: search by name + status filter
  - Kanban: search by task title + assignee + status filters
  - Debounced inputs for a responsive UX
- **Global error handling & toasts**
  - Centralized runtime + API error normalization
  - Errors surfaced as toast notifications (no silent failures)
- **Persistent mock REST API (localStorage)**
  - Full CRUD-style flows without backend complexity
  - Data persists across refreshes

## Tech Stack

- **Vue 3** (Composition API)
- **TypeScript**
- **Pinia** (state management)
- **Vue Router**
- **Vite**
- **Tailwind CSS**
- **Axios** (with a centralized API client)
- **Mock REST API** (Axios adapter + `localStorage` persistence)

## Architecture Overview

TaskFlow Pro follows a production-minded frontend architecture focused on maintainability and scale:

- **Feature-based modules**: domain code is organized under `src/modules/*` (auth, projects, tasks, users).
- **Store/service separation**: Pinia stores orchestrate UI state + workflows; services encapsulate API calls.
- **Centralized API layer**: a single HTTP client (`src/api/http.ts`) and a mock adapter (`src/api/mock/*`) provide consistent request/response handling.
- **Defensive error handling**: typed API errors, runtime guards around unexpected shapes, and a global toast system to surface failures consistently.

## Folder Structure (high level)

- **`src/api/`**
  - `http.ts`: centralized Axios client + error normalization
  - `mock/`: mocked REST API adapter and persisted mock DB
- **`src/modules/`**
  - `auth/`: auth store + permissions (RBAC)
  - `projects/`: project views, store, services
  - `tasks/`: kanban + task modals, store, services
  - `users/`: directory view/store (admin-only)
- **`src/store/`**
  - global stores (e.g. toast notifications)
- **`src/components/`**
  - reusable UI primitives + `ToastHost`
- **`src/router/`**
  - route definitions + auth guards

## Getting Started

### Prerequisites

- **Node.js 18+** (Vite 5 requirement). Tested with Node 20.

```bash
npm install
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

### Demo Accounts

- **Admin**: `admin@taskflow.pro` / `Admin123!`
- **Member**: `member@taskflow.pro` / `Member123!`

## Screenshots

Placeholders (add these images later):

- `dashboard.png`
- `projects.png`
- `kanban.png`
- `activity-log.png`

## Future Improvements

- Real backend integration (JWT + database)
- File attachments
- Notifications (in-app + email)

---

**License:** MIT

---

## ⭐ Like What You See?

If this project helped you or inspired you, feel free to give it a ⭐.  
Suggestions and constructive feedback are always appreciated.

