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
- Alembic migrations for the PostgreSQL schema
- Redis-backed rate limiting for authentication endpoints

In progress:

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

Database schema changes are managed with Alembic. `Base.metadata.create_all()` is disabled in the application startup.

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
REDIS_URL="redis://localhost:6379/0"
RATE_LIMIT_FAIL_OPEN="false"
TRUST_PROXY="false"
```

Never commit `.env` or expose `SECRET_KEY`.

## Run Redis with Docker

The backend uses Redis for rate limiting. Start Redis from the `server/` directory:

```bash
cd server
docker compose up -d redis
docker compose ps
docker compose exec redis redis-cli ping
```

The last command should return:

```text
PONG
```

If Docker reports permission denied for `/var/run/docker.sock`, add your user to the Docker group:

```bash
sudo usermod -aG docker "$USER"
newgrp docker
docker ps
docker compose up -d redis
```

You can also log out and back in after running `usermod`. If the current session still cannot access Docker, use the temporary fallback:

```bash
sudo docker compose up -d redis
sudo docker compose exec redis redis-cli ping
```

The Redis container is bound to `localhost:6379`, matching `REDIS_URL` above. The Python Redis client is installed through the server project dependencies; no separate local Redis installation is required when Docker is available.

## Run the backend

```bash
cd server
uv sync
docker compose up -d redis
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

1. Add automated API and authorization tests.
2. Add ticket assignment and complete agent permissions.
3. Improve response models and API refinement.
4. Create the React frontend inside `client/`.
5. Connect the frontend to the backend API.
6. Add deployment configuration.

## License

This project is for learning and personal development purposes.
