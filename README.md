# Help Desk Ticket API

A learning-focused FastAPI backend for a help desk ticket system using SQLAlchemy ORM, PostgreSQL, password hashing, JWT authentication, and FastAPI dependency injection.

## Current status

Implemented:

- FastAPI application bootstrap
- PostgreSQL connection through SQLAlchemy
- `User` and `Ticket` ORM models
- Foreign keys from tickets to users
- Ticket CRUD route structure
- User registration and login routes
- Password hashing with `pwdlib` and Argon2
- JWT creation with PyJWT
- Dependency-based authentication
- Pydantic validation schemas

Still in progress:

- Connecting the authenticated user to `Ticket.created_by`
- Ticket ownership and RBAC
- Transaction rollback handling
- Alembic migrations
- Tests
- Comments and agent assignment
- Redis rate limiting
- Render deployment

## Architecture

```text
HTTP request → FastAPI router → Depends → Service → Repository → SQLAlchemy ORM → PostgreSQL
```

```text
app/
├── main.py
├── api/v1/
│   ├── dependencies.py
│   ├── router.py
│   └── endpoints/
│       ├── tickets.py
│       └── user.py
├── core/
│   ├── config.py
│   └── security.py
├── db/
│   ├── base.py
│   └── postgres.py
├── models/
│   ├── tickets.py
│   └── users.py
├── repositories/
├── schemas/
└── services/
```

## Database design

### `users`

```text
id, name, email, password_hash, role, is_active, created_at, updated_at
```

Supported roles are `user`, `agent`, and `admin`.

### `tickets`

```text
id, title, description, priority, category, status,
created_by, assigned_to, created_at, updated_at
```

Relationships:

```text
tickets.created_by  → users.id
tickets.assigned_to → users.id
```

`assigned_to` is nullable because a ticket may not be assigned when it is created.

The app currently calls `Base.metadata.create_all()` at startup. This creates missing tables but does not safely migrate existing tables. Alembic is required before production deployment.

## Technology

- Python 3.15+
- FastAPI
- SQLAlchemy
- PostgreSQL and Psycopg
- Pydantic
- PyJWT
- pwdlib with Argon2
- uv

## Environment configuration

Create `.env` in the `help-desk` directory:

```env
APP_NAME="Help Desk"
DB_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/helpdesk"
SECRET_KEY="use-a-long-random-secret-at-least-32-bytes"
ALGORITHM="HS256"
EXP_DURATION="60"
SESSION_KEY="access_token"
```

Do not commit `.env` or expose `SECRET_KEY`.

## Setup

```bash
uv sync
uv run fastapi dev
```

The app runs at `http://127.0.0.1:8000`.

Swagger UI is currently configured at `/` because `main.py` uses `docs_url="/"`.

## Current routes

The router is stored under `api/v1`, but it currently does not add `/api/v1` to the URL. Routes currently use `/auth` and `/tickets` directly.

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/forget
DELETE /auth/{user_id}
```

Registration accepts name, email, and password. Passwords are hashed before storage and new users receive the default `user` role.

Successful login creates a JWT and stores it in the cookie configured by `SESSION_KEY`.

Password reset and user deletion are development flows and do not yet have complete authorization rules.

### Tickets

```text
GET    /tickets/health-check
POST   /tickets/
GET    /tickets/
GET    /tickets/{ticket_id}
PUT    /tickets/{ticket_id}/
DELETE /tickets/{ticket_id}/
```

Ticket creation accepts title, description, priority, and category. The client must not send `created_by`; the backend must derive it from the authenticated user.

## Authentication design

Authentication uses FastAPI dependencies, not `@app.middleware("http")`.

The authentication dependency reads the JWT cookie, decodes the token, extracts the user ID from `sub`, loads the user from PostgreSQL, and checks whether the account is active.

The ticket and user routers currently receive the authentication dependency at router level. Public routes are excluded using `PUBLIC_ROUTES`.

## Known limitations and next changes

1. Pass the authenticated user ID into ticket creation as `created_by`.
2. Add ownership checks for ticket reads, updates, and deletes.
3. Add explicit RBAC guards for users, agents, and admins.
4. Add response models to every route.
5. Add rollback handling to database writes.
6. Handle duplicate email registration cleanly.
7. Move JWT creation from the repository into the service/security layer.
8. Protect and redesign password reset.
9. Add Alembic migrations.
10. Add unit and integration tests.
11. Add comments and ticket assignment.
12. Add Redis rate limiting.
13. Add Render deployment configuration.
14. Add the `/api/v1` URL prefix if that contract is retained.

## Development milestone

```text
Register → Login → JWT cookie → Current-user dependency → Ticket.created_by → Ownership and RBAC
```

## License

This project is for learning and personal development purposes.
