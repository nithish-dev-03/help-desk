# Help Desk

A learning-focused help-desk application with a FastAPI backend and a planned React frontend.

## Repository structure

```text
help-desk/
├── README.md
├── .gitignore
├── server/
│   ├── .env                 # local secrets; not committed
│   ├── .env.example         # safe configuration template
│   ├── pyproject.toml
│   ├── uv.lock
│   ├── app/
│   │   ├── main.py
│   │   ├── api/v1/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   └── PROJECT_PROGRESS.md
└── client/                  # React frontend; planned
```

The repository root contains shared documentation. Backend code and Python dependencies belong in `server/`. Frontend code and JavaScript dependencies will belong in `client/`.

## Backend status

Implemented:

- FastAPI application bootstrap and versioned router structure
- PostgreSQL connection through SQLAlchemy
- `users`, `tickets`, and `comments` ORM models
- Ticket CRUD and status-update routes
- Comment creation and retrieval routes
- Repository and service layers
- User registration and login
- Password hashing with Argon2
- JWT authentication stored in a cookie
- Role-based access dependencies
- Centralized exception handling for application, validation, database, and unexpected errors

In progress:

- Alembic migrations
- Redis rate limiting
- Automated tests
- Ticket assignment and stricter agent permissions
- Response-model cleanup and API refinement
- React frontend

## Backend architecture

```text
HTTP request → FastAPI router and dependencies → Service layer
             → Repository layer → SQLAlchemy ORM → PostgreSQL
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

`created_by` and `assigned_to` reference `users.id`. `assigned_to` is nullable.

### `comments`

```text
id, ticket_id, user_id, content, created_at, updated_at
```

Comments reference both the ticket and the user who created them.

The application currently calls `Base.metadata.create_all()` during startup. This is suitable for early development only and should be replaced with Alembic before production use.

## Technology

- Python 3.15+
- FastAPI
- SQLAlchemy
- PostgreSQL with Psycopg
- Pydantic
- PyJWT
- pwdlib with Argon2
- uv
- React frontend planned

## Environment configuration

Copy the server template and fill in local values:

```bash
cd server
cp .env.example .env
```

Example server configuration:

```env
APP_NAME="Help Desk"
DB_URL="postgresql+psycopg://YOUR_USER:YOUR_PASSWORD@localhost:5432/helpdesk"
SECRET_KEY="use-a-long-random-secret-at-least-32-bytes"
ALGORITHM="HS256"
EXP_DURATION="60"
SESSION_KEY="access_token"
```

Never commit `.env` or expose `SECRET_KEY`.

## Run the backend

```bash
cd server
uv sync
uv run fastapi dev
```

The API runs at `http://127.0.0.1:8000`. Swagger UI is currently available at `/`.

## Current API routes

Authentication:

```text
POST   /auth/register
POST   /auth/login
POST   /auth/forget
GET    /auth/logout
DELETE /auth/{id}
```

Tickets:

```text
GET    /tickets/health-check
POST   /tickets/
GET    /tickets/
GET    /tickets/{id}
PUT    /tickets/{id}/
DELETE /tickets/{id}/
PATCH  /tickets/{id}/status
```

Comments:

```text
GET /tickets/{ticket_id}/comments/health
PUT /tickets/{ticket_id}/comments/
GET /tickets/{ticket_id}/comments/
```

## Planned development order

1. Add Redis rate limiting for authentication endpoints.
2. Add Alembic and replace `Base.metadata.create_all()`.
3. Add automated API and authorization tests.
4. Add ticket assignment and complete agent permissions.
5. Create the React frontend inside `client/`.
6. Connect the frontend to the backend API.
7. Add deployment configuration.

## License

This project is for learning and personal development purposes.
