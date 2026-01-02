# TaskFlow Pro

TaskFlow Pro is a production-style project management SaaS frontend that I built to demonstrate how I structure and ship a real Vue 3 application: feature-first modules, typed API boundaries, role-based permissions enforced at multiple layers, and a UX that remains predictable under failure. It runs entirely client-side with a mocked REST API persisted in `localStorage`.

**Author:** Ahmad — GitHub: **AhmadsaaD111**

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

TaskFlow Pro is intentionally structured like a real product codebase. The goal isn’t to show “how to use Vue”—it’s to show how I make a frontend easy to extend, test, and reason about.

- **Feature modules** (`src/modules/*`): each domain owns its store, services, and UI.
- **Store/service split**: Pinia stores model the application state and orchestration; services are the only layer that talks to the API.
- **Single API surface**: `src/api/http.ts` normalizes errors and keeps request handling consistent.
- **Mock backend with persistence**: the Axios mock adapter (`src/api/mock/*`) behaves like a REST API but persists to `localStorage`.
- **Defensive UX**: unexpected response shapes and runtime errors are surfaced via a global toast system (no silent failures).

### Trade-offs

- The mock API keeps the project fully portable (no server setup), at the cost of not representing real latency/security concerns.
- RBAC is enforced in the store layer for correctness and also in the UI for clarity—this duplication is intentional: the store is authoritative, and the UI prevents confusing affordances.
- Activity logging is lightweight and intentionally scoped to high-signal events, not a full event-sourcing system.

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

Add these images to the repo root (or update the paths if you prefer a `/docs` folder):

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


