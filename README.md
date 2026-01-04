# TaskFlow Pro

TaskFlow Pro is a **production-style frontend architecture case study** built with Vue 3 and TypeScript.

The goal of this project is to demonstrate how I design and ship **maintainable, permission-aware single-page applications** with:

- clear domain boundaries,
- explicit authority layers,
- predictable behavior under failure,
- and frontend-enforced invariants that mirror real backend systems.

The application runs entirely client-side using a **persistent mocked REST API** implemented as an Axios adapter.  
This allows the codebase to focus on **frontend system design and correctness** without requiring server setup.

> ⚠️ Note  
> The backend is intentionally mocked.  
> The purpose of this project is to showcase frontend architecture, state modeling, and permission enforcement — not server infrastructure.

---

## What This Project Demonstrates

TaskFlow Pro shows how to build a realistic SPA that:

- Handles authentication and session persistence
- Enforces RBAC (role-based access control) at multiple layers
- Scales using feature-based modules with clear boundaries
- Remains predictable under API and runtime failures
- Mirrors backend-like constraints without coupling UI to storage details

---

## Key Features

### Project & Task Management (Kanban)
- Create and manage projects
- Kanban board with drag & drop task workflow
- Task fields: status, priority, due date, assignee
- Task comments (mocked, persisted)

### Role-Based Access Control (RBAC)
- Admin / Member roles
- Permissions enforced at three levels:
  - **Route-level** (navigation guards)
  - **Store-level** (authoritative business rules)
  - **UI-level** (preventing misleading affordances)

### Project Activity Log (Audit Trail)
- Per-project activity feed
- Tracks high-signal events:
  - project creation
  - task creation
  - task movement
  - assignment changes

### Search & Filtering
- Project list: name search + status filter
- Kanban board: task title, assignee, and status filters
- Debounced inputs for responsive UX

### Error Handling & Feedback
- Centralized API error normalization
- Global toast notifications (no silent failures)
- Inline page-level error states where appropriate

### Persistent Mock REST API
- CRUD-style API behavior
- Data persists across refreshes
- Backend-like validation, auth, and membership checks

---

## Architecture Overview

TaskFlow Pro is structured to resemble a **real production frontend**, not a demo or tutorial app.

### High-level principles

- **Feature-first modules** (`src/modules/*`)
- **Explicit API boundary** via a single HTTP client
- **Stores as the authority** for business rules and permissions
- **Services as thin API wrappers**
- **UI as a consumer**, not a decision-maker

---

### Folder Structure (High Level)

src/
├─ api/
│ ├─ http.ts # centralized Axios client + error normalization
│ └─ mock/ # Axios adapter + persistent localStorage DB
│
├─ components/
│ └─ Base* + ToastHost
│
├─ layouts/
│ ├─ AuthLayout.vue
│ └─ DashboardLayout.vue
│
├─ modules/
│ ├─ auth/ # auth store, permissions, login/register
│ ├─ dashboard/ # dashboard view
│ ├─ projects/ # projects domain (store, service, views)
│ ├─ tasks/ # kanban + task domain
│ ├─ users/ # admin-only user directory
│ └─ system/ # system-level views (404)
│
├─ router/
│ └─ index.ts # routes + auth/role guards
│
├─ store/
│ ├─ toasts.ts # global toast store
│ └─ theme.ts
│
├─ types/ # shared domain + API types
├─ utils/ # debounce, id helpers, storage helpers
└─ styles/

markdown
Copy code

---

## API & State Flow

A typical flow looks like this:

1. **UI** triggers a store action  
   (e.g. `projects.fetchAll()`)

2. **Store** enforces permissions and orchestration  
   (e.g. `assertPermission('projects:read')`)

3. **Service** calls the API client  
   (thin wrapper around endpoint + payload)

4. **API client** (`api/http.ts`)
   - injects auth header
   - retries transient failures
   - normalizes errors into a consistent `ApiError` shape

5. **Mock API adapter**
   - enforces auth & membership
   - validates inputs
   - persists changes to `localStorage`

6. **Store updates state**
7. **UI reacts**

Errors at any stage are surfaced consistently via global toasts and/or inline error UI.

---

## Permissions Model

Permissions are enforced defensively at multiple layers:

- **Route-level**
  - `requiresAuth`, `roles` metadata
  - redirects unauthenticated or unauthorized users

- **Store-level (authoritative)**
  - `assertPermission(...)` throws on forbidden actions
  - prevents incorrect state transitions

- **Mock backend**
  - authentication checks
  - project membership checks
  - endpoint-level validation

This mirrors how real systems enforce correctness while keeping UX clear.

---

## Trade-offs & Design Notes

- The mock backend prioritizes **portability** over real security or latency.
- RBAC is role-based, not attribute-based, to keep scope focused.
- Optimistic UI is used selectively (e.g. task movement), with rollback on failure.
- Global error surfacing reduces repetitive UI error code, while views still handle page-level failures explicitly.

These trade-offs are deliberate and documented.

---

## Tech Stack

### Frameworks
- Vue 3
- Vue Router

### State & Data
- Pinia
- Axios

### Styling
- Tailwind CSS

### Tooling
- Vite
- TypeScript (strict mode)
- ESLint + Prettier

---

## Getting Started

```bash
npm install
npm run dev
Vite will print the local URL (typically http://localhost:5173).

Demo Accounts
Admin

admin@taskflow.pro / Admin123!

Member

member@taskflow.pro / Member123!

License
MIT

⭐ Like what you see?
If this project helped you or inspired you, feel free to give it a ⭐.




