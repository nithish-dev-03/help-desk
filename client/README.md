# Help Desk Operations Web App — Client

A calm, high-trust, mission-critical customer support operations workspace built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

The interface is engineered according to the **Stitch Design System** (Project ID: `17083555303609410787`), featuring a dense paned workbench model, hairline 1px border dividers, archival ledger tones (paper canvas, moss accent, and slate text), and monospaced anchors for operational data.

---

## 1. Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Bundler & Tooling:** [Vite 6](https://vite.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/) (Route-based code splitting via `React.lazy` and `Suspense`)
- **Server State & Caching:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) with customized Stitch design tokens
- **Typography:** [Geist](https://vercel.com/font) for UI typography and [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for technical data anchors
- **Icons:** [Lucide React](https://lucide.dev/) (Strict technical line icons; no emojis)
- **Testing:** [Vitest](https://vitest.dev/)

---

## 2. Getting Started

### Prerequisites

- Node.js `>= 18.0.0` (tested on Node `v24.x`)
- npm `>= 9.0.0` or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   The `.env` file contains:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```
   > **Note:** During local development, the Vite dev server automatically proxies `/auth` and `/tickets` to `http://127.0.0.1:8000`. This ensures cross-origin cookie-based session authentication works seamlessly on `localhost`.

### Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts Vite dev server with hot module replacement (HMR) at `http://localhost:5173` |
| **Type Check & Build** | `npm run build` | Runs `tsc -b` and builds production-optimized assets into `dist/` |
| **Run Tests** | `npm test` | Runs the Vitest test suite |
| **Preview** | `npm run preview` | Previews the production build locally |

---

## 3. Application Architecture

The client follows a feature-oriented, modular architecture:

```
client/src/
├── app/
│   ├── App.tsx             # Root application component
│   ├── router.tsx          # Code-split router configuration with Suspense
│   ├── providers.tsx       # QueryClient & Auth context providers
│   └── query-client.ts     # TanStack Query client configuration
├── components/
│   ├── ui/                 # Atomic design primitives (Button, Input, Modal, Alert, etc.)
│   ├── layout/             # Workbench layout (AppLayout, Sidebar, Header)
│   └── tickets/            # Ticket rows, table filters, status dialog
├── features/
│   ├── auth/               # Authentication context, login, registration, role guards
│   ├── dashboard/          # Role dashboards (Agent, User, Admin) and live telemetry
│   ├── tickets/            # Tickets API client and data hooks
│   ├── comments/           # Conversation timeline and rich comment composer
│   └── diagnostics/        # Live API ping and RFC 7807 error taxonomy
├── lib/
│   ├── api-client.ts       # Typed fetch client with credentials: 'include'
│   ├── errors.ts           # Unified API error normalization
│   └── utils.ts            # Formatting utilities (#TK-XXXX tokens, dates, JWT decoder)
├── pages/                  # Page-level route views (lazy-loaded)
├── types/                  # TypeScript interfaces for API, tickets, users, comments
└── styles/
    └── globals.css         # Base Tailwind styles and typography definitions
```

---

## 4. Key Screens & Features

### 1. Authentication Suite (`/login`, `/register`, `/forgot-password`)
- Secure operator sign-in using cookie-based JWT sessions.
- Full registration flow with duplicate email (`409 Conflict`) validation.
- Password recovery hooked up to backend password reset.
- Client authentication specification panel explaining cookie transport.

### 2. Operational Overview (`/dashboard`)
- Perspective switcher: **Agent View**, **User View**, and **Admin View**.
- Live telemetry metrics computed directly from real database tickets (Urgent count, In Progress count, Resolved Today, SLA compliance).
- Priority spread distribution bars.
- SVG Weekly Ingestion & Clearance chart.
- First-use user onboarding state preview.

### 3. Ticket Management (`/tickets`)
- Search by `#TK-` ticket token and title tokens.
- Status filters (`Open`, `In Progress`, `Pending`, `Resolved`, `Closed`).
- Priority filters (`Low`, `Medium`, `High`) and category filter.
- Sorting by newest, priority, or last updated.
- Skeleton loader and empty state treatments.
- Quick status patch modal (`PATCH /tickets/{id}/status`) for support staff.
- Administrative delete confirmation modal (`DELETE /tickets/{id}/`).

### 4. Ticket Detail & Conversation (`/tickets/:id`)
- Compact breadcrumb strip and ticket ID badge.
- Incident description with syntax-highlighted code container.
- Service Level Agreement countdown timer gauge.
- Full chronological conversation timeline distinguishing regular user comments from staff notes.
- Rich comment composer supporting Markdown (`**bold**`, `*italic*`, `` `code` ``, `> quote`, `- list`) and internal notes.

### 5. Ticket Creation (`/tickets/new`)
- Structured form with validation (minimum character lengths, required categories).
- Priority selector with live SLA acknowledgment times.
- Markdown toolbar for incident descriptions.
- Diagnostic attachments dropzone mockup.

### 6. Workstation Settings & Role Sandbox (`/settings`)
- View active profile identity (Name, Email, Role, ID).
- In-browser role simulation toggle to test permissions (`User`, `Agent`, `Admin`).
- Session termination (Logout).
- Account deletion (`DELETE /auth/{id}`).

### 7. System Diagnostics (`/diagnostics`)
- Live gateway ping tester measuring backend roundtrip latency.
- Full HTTP error taxonomy illustrating standardized JSON error payloads for `401`, `403`, `404`, `409`, `422`, and `500`.

---

## 5. Design Tokens & Styling Rules

| Role | Color | Hex | Description |
| :--- | :--- | :--- | :--- |
| **Canvas Base** | Paper Canvas | `#F7F7F5` | Global warm application backdrop |
| **Surface** | White Surface | `#FFFFFF` | Work panels, cards, and input backgrounds |
| **Primary Accent** | Moss Accent | `#3F6B57` | Primary action buttons, active navigation, focus rings |
| **Soft Accent** | Pale Moss | `#E5EEE8` | Active row fills and badge containers |
| **Text Primary** | Ink Charcoal | `#202321` | High-contrast body and headline copy |
| **Text Secondary**| Slate Grey | `#68716D` | Subtitles, timestamps, and column labels |
| **Borders** | Line Divider | `#DDE2DE` | Hairline 1px structural partitions |
| **Success** | Forest Green | `#2F7652` | Resolved and closed statuses |
| **Warning** | Warm Amber | `#A66A22` | Pending user replies |
| **Danger** | Brick Red | `#B44D45` | High priority, error states, and destructive actions |

---

## 6. Backend Integration

The client communicates with the FastAPI backend exposed under `/auth` and `/tickets`:

- **Credentials:** Every request passes `{ credentials: 'include' }` to transmit the session cookie (`access_token`).
- **Normalized Errors:** All server errors in the shape `{"status": false, "error": {"code": "...", "message": "..."}}` are converted to typed `AppApiError` instances with field-level validation messages.
- **Data Source:** Zero mock data in production. All queues, ticket counts, and timelines reflect live PostgreSQL database state.
