# TaskFlow Pro

TaskFlow Pro is a **production-style frontend architecture case study**.

I built it to demonstrate how I design and ship **maintainable, permission-aware client applications** with:

- clear domain boundaries,
- explicit authority layers,
- predictable behavior under failure,
- and frontend-enforced invariants that mirror real backend systems.

Although the application runs entirely client-side using a mocked REST API persisted in `localStorage`, it is **intentionally structured as if it were backed by a real service**.  
The focus of this project is **frontend system design**, not backend implementation.

> ⚠️ Note  
> This project uses a mocked REST API for portability and ease of review.  
> The goal is to showcase frontend architecture, state modeling, and correctness — not server infrastructure.

---

## Key Features

### Project & Task Management (Kanban)
- Create and manage projects
- Kanban board with drag & drop task workflow
- Task fields: status, priority, due date, assignee
- Mocked comments per task

### Role-Based Access Control (RBAC)
- Admin / Member roles
- Action-level permissions enforced in:
  - Pinia store layer (authoritative)
  - UI layer (preventing misleading affordances)

### Project Activity Log (Audit Trail)
- Per-project activity feed persisted via the mock API
- Tracks high-signal actions:
  - project creation
  - task creation
  - task movement
  - assignment changes

### Search & Filters
- Projects: search by name + status filter
- Kanban: search by task title, assignee, and status
- Debounced inputs for responsive UX

### Global Error Handling & Feedback
- Centralized runtime + API error normalization
- Errors surfaced as toast notifications
- No silent failures

### Persistent Mock REST API
- Full CRUD-style flows without backend setup
- Data persists across refreshes
- Behaves like a REST API via Axios adapter

---

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Pinia (state management)
- Vue Router
- Vite
- Tailwind CSS
- Axios (centralized API client)
- Mock REST API (Axios adapter + `localStorage` persistence)

---

## Architecture Overview

TaskFlow Pro is structured to resemble a **real production frontend**, not a demo app.

The structure mirrors how I expect a frontend to scale across features and teams, even when backed by complex backend systems.

### Key architectural decisions

- **Feature-first modules (`src/modules/*`)**  
  Each domain owns its store, services, and UI.

- **Store / service split**  
  Pinia stores model application state and orchestration.  
  Services are the only layer allowed to communicate with the API.

- **Single API surface**  
  `src/api/http.ts` centralizes Axios configuration, error normalization, and response handling.

- **Mock backend with persistence**  
  The Axios mock adapter (`src/api/mock/*`) behaves like a REST API while persisting data to `localStorage`.

- **Defensive UX**  
  Unexpected response shapes and runtime errors are surfaced via a global toast system — no silent failures.

---

## Trade-offs & Design Notes

- The mocked API keeps the project **fully portable**, at the cost of not representing real latency or security concerns.
- RBAC is enforced both in the store layer and the UI:
  - the store is authoritative,
  - the UI prevents confusing or misleading affordances.
- Activity logging is intentionally scoped to **high-signal events**, not a full event-sourcing system.

These trade-offs are deliberate and documented to keep the project focused on frontend system design.

---

## Folder Structure (High Level)

src/
├─ api/
│ ├─ http.ts # centralized Axios client + error normalization
│ └─ mock/ # mocked REST API adapter + persisted mock DB
│
├─ modules/
│ ├─ auth/ # auth store + RBAC permissions
│ ├─ projects/ # project views, store, services
│ ├─ tasks/ # kanban board + task modals, store, services
│ └─ users/ # user directory (admin-only)
│
├─ store/
│ └─ global stores (e.g. toast notifications)
│
├─ components/
│ └─ reusable UI primitives + ToastHost
│
├─ router/
│ └─ route definitions + auth guards

yaml
Copy code

---

## Getting Started

### Prerequisites
- Node.js 18+ (Vite 5 requirement)  
  Tested with Node 20.

### Run locally

```bash
npm install
npm run dev
Vite will print the local URL (typically http://localhost:5173).

Demo Accounts
Admin

Email: admin@taskflow.pro

Password: Admin123!

Member

Email: member@taskflow.pro

Password: Member123!


Future Improvements
Real backend integration (JWT + database)

File attachments

Notifications (in-app + email)

License
MIT

⭐ Like what you see?
If this project helped you or inspired you, feel free to give it a ⭐.



