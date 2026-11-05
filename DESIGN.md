# Design System: Help Desk

## 1. Product Direction and Atmosphere

Design a serious, calm, high-trust customer-support workspace for people who need to resolve issues quickly. The product should feel like a modern operations room: clear, humane, focused, and quietly confident. Avoid the visual language of generic SaaS dashboards, fintech apps, or noisy project-management tools.

Use a balanced density of 6/10, asymmetric variance of 5/10, and restrained fluid motion of 4/10. Prioritize information hierarchy, ticket status clarity, ownership, and readable conversation history. The interface should make the next action obvious without making the product feel mechanical.

Use a desktop-first workspace composition that collapses cleanly on mobile. Keep content in clear zones; do not overlap text, controls, cards, or images.

## 2. Color Palette and Roles

- **Paper Canvas** (`#F7F7F5`) — global application background.
- **White Surface** (`#FFFFFF`) — panels, forms, drawers, and elevated content.
- **Ink** (`#202321`) — primary text and high-priority labels. Never use pure black.
- **Slate** (`#68716D`) — secondary text, descriptions, timestamps, and helper copy.
- **Line** (`#DDE2DE`) — borders, dividers, table rules, and input outlines.
- **Moss Accent** (`#3F6B57`) — the single accent for primary actions, active navigation, focus rings, and selected states.
- **Pale Moss** (`#E5EEE8`) — subtle accent backgrounds and selected-row fills.
- **Success** (`#2F7652`) — resolved/completed states.
- **Warning** (`#A66A22`) — pending, attention, and approaching due states.
- **Danger** (`#B44D45`) — destructive actions, failed requests, and critical errors.

Use the moss accent consistently. Do not introduce purple, neon blue, rainbow gradients, or glowing shadows. Status colors should remain muted and accessible rather than decorative.

## 3. Typography

- **Primary typeface:** `Satoshi`, with `Geist` as fallback.
- **Monospace:** `Geist Mono` for ticket IDs, timestamps, API-like values, and compact metadata.
- Use controlled, weight-based hierarchy rather than oversized headlines.
- Body text should use relaxed leading and a maximum readable line length of approximately 65 characters.
- Use sentence case for labels and navigation. Avoid all-caps except for compact status badges.
- Do not use Inter, generic serif fonts, or decorative display fonts.

Suggested scale:

- Page title: 32px, weight 650.
- Section title: 22px, weight 620.
- Card title: 16px, weight 620.
- Body: 15px, line-height 1.55.
- Metadata: 12px, `Geist Mono`, letter spacing 0.02em.

## 4. Layout and Responsive Rules

- Use a 12-column desktop grid with a maximum content width of 1440px.
- The authenticated app uses a compact left navigation rail/sidebar, a top utility bar, and a main content workspace.
- Keep the sidebar width between 248px and 272px on desktop.
- Use 24px to 32px page padding on desktop and 16px on mobile.
- Prefer structured whitespace and border-top dividers over excessive floating cards.
- Every interactive target must be at least 44px tall/wide.
- Below 768px, collapse all multi-column layouts into one column.
- On mobile, convert the sidebar into a top bar with a menu drawer.
- Ticket detail metadata should become a stacked section below the conversation on mobile.
- Never create horizontal scrolling for tables; convert dense tables to stacked rows or horizontally scroll only inside an explicitly bounded table region.
- Use `min-height: 100dvh`, not `100vh`, for full-height layouts.

## 5. Shared Components

### Navigation

Desktop sidebar items: Overview, My Tickets, All Tickets when permitted, New Ticket, and Settings. Show a compact role label for User, Agent, or Admin. Include a bottom account area with avatar initials, name, role, and logout action.

Use active navigation as a pale moss block with a moss-colored leading rule. Keep icons simple line icons; never use emojis.

### Buttons

Use compact, tactile buttons with 8px corner radius. Primary buttons use Moss Accent with white text. Secondary buttons use white surface, ink text, and a Line border. Destructive buttons use Danger only when the action is truly destructive. Add a subtle 1px translate feedback on press and a visible keyboard focus ring.

### Forms

Labels sit above fields. Use clear helper text and inline error text below the field. Required fields should be marked consistently. Use visible focus states and never rely on placeholder text as the label.

### Status badges

Use compact pill badges for `open`, `in_progress`, `pending`, `resolved`, and `closed`. Each badge must include readable text; color alone must not communicate status.

### Ticket rows

Each row should show ticket ID, title, category, priority, status, creator or assignee, and updated time. Use a strong title column and quieter metadata columns. On mobile, stack metadata below the title.

### Comments

Use a chronological conversation timeline. Clearly distinguish the current user's comments from other participants without making the layout feel like a social chat app. Show author, role, timestamp, and content. Use a fixed or sticky composer only when it does not cover the conversation.

### Loading, empty, and error states

- Loading: use skeleton rows and skeleton blocks matching the final layout; do not use generic full-page spinners.
- Empty: explain why the area is empty and provide one relevant action, such as “Create your first ticket.”
- Errors: show a concise message, a stable error code when useful, and a recovery action.
- Toasts should be short-lived and placed consistently without covering primary controls.

## 6. Required Screens and Flows

Generate all of the following screens as one coherent product, reusing the same layout, components, colors, and typography.

### Public authentication

1. **Login** — email, password, show-password control, validation, invalid-credentials state, loading state, link to registration, link to forgot password.
2. **Register** — name, email, password, confirmation if used by the frontend, password guidance, duplicate-email error, success transition to login.
3. **Forgot password** — email form, submitted state, invalid-email state, and safe generic response that does not reveal whether an account exists.
4. **Authentication failure** — expired session, unauthorized state, and a clear action to return to login.

### Authenticated overview

5. **User dashboard** — welcome header, ticket counts by status, recent tickets, primary “New ticket” action, and an empty first-use state.
6. **Agent dashboard** — assigned-ticket queue, priority distribution, pending workload, recently updated tickets, and quick filters.
7. **Admin dashboard** — system-level ticket totals, status distribution, priority distribution, unresolved workload, and recent activity summary. Do not invent unsupported analytics values; use realistic placeholders only in the design mockup.

### Ticket management

8. **Ticket list** — searchable and filterable list, status/priority/category filters, pagination or load-more treatment, sorting, loading, empty, and error states.
9. **Create ticket** — title, description, priority, category, field errors, submitting state, success state, and server-error state.
10. **Ticket detail** — ticket ID, title, description, status, priority, category, creator, assignee, created/updated timestamps, action controls based on role, and comments timeline.
11. **Edit ticket** — prefilled title, description, priority, and category form with unsaved-changes warning and success/error states.
12. **Update status** — role-appropriate status control with confirmation for closing/resolving and an error state.
13. **Delete confirmation** — destructive confirmation dialog with ticket title, cancel state, deleting state, success state, and failure state.
14. **Assignment state** — design the admin/agent assignment panel as a future-ready screen section, clearly marked if the current API does not yet expose assignment endpoints.

### Comments

15. **Ticket comments** — conversation view, comment composer, validation, posting state, permission-denied state, and no-comments empty state.
16. **Comment loading/error states** — preserve the ticket context while comments load or fail.

### Account and system states

17. **Profile/settings** — current user identity, role, session/logout action, and account state.
18. **403 forbidden** — explain that the account lacks permission and provide a safe return action.
19. **404 not found** — ticket/resource not found with a return-to-tickets action.
20. **409 conflict** — duplicate email or conflicting update state.
21. **422 validation** — inline form validation plus a compact summary when multiple fields fail.
22. **429 rate limited** — explain that too many requests were made and show a retry-later treatment; do not imply an exact countdown unless the API provides one.
23. **500 server error** — calm error page with retry and return-home actions.
24. **Offline/network failure** — preserve entered form data where safe and offer retry.

## 7. Role Behavior

- **User:** can create tickets, view their own tickets, and comment where permitted.
- **Agent:** can work on assigned/support tickets and update status according to permission rules.
- **Admin:** can manage tickets and administrative views.
- Hide unavailable actions rather than showing controls that will always fail.
- If a permission is uncertain or not yet supported by the backend, show a disabled/future-state treatment in the design and label it clearly for implementation.

## 8. Backend Contract Awareness

The current backend uses cookie-based JWT authentication. The frontend should send credentials with API requests and should not store the authentication token in local storage.

Current API areas:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forget`
- `GET /auth/logout`
- `GET|POST|PUT|DELETE|PATCH /tickets/...`
- `GET|PUT /tickets/{ticket_id}/comments/...`

Use the backend's normalized error shape when designing error states:

```json
{
  "status": false,
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Ticket not found"
  }
}
```

## 9. Motion and Interaction

Use restrained spring-like transitions with approximately 180–240ms duration. Animate opacity and transform only. Use staggered reveals for ticket rows and dashboard sections, but keep the interface fast and operational. Use subtle row hover, button press, focus, drawer, modal, and toast transitions. Avoid decorative perpetual motion, parallax, bouncing arrows, and animated gradients.

## 10. Never Do

- Do not use emojis as icons or decoration.
- Do not use Inter, purple neon, rainbow gradients, or pure black.
- Do not use glowing shadows or glassmorphism as the primary visual language.
- Do not create generic three-equal-card dashboard layouts.
- Do not use fake metrics, fake testimonials, or invented customer names.
- Do not use placeholder names such as John Doe or Acme.
- Do not overlap text and controls.
- Do not hide labels inside floating placeholders.
- Do not use huge hero typography for an authenticated operations product.
- Do not use filler copy such as “Elevate your workflow,” “Seamless,” “Next-gen,” or “Scroll to explore.”
- Do not design frontend actions that have no backend route without marking them as future functionality.
