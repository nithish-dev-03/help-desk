# Help Desk Ticket API

A learning-focused FastAPI project for building a simple help desk ticket management system.

This project is designed to practice backend fundamentals such as routing, request validation, environment configuration, database integration, and service/repository architecture in a real-world API project.

## Overview

The application currently provides a basic FastAPI foundation with a modular project structure and ticket-related endpoints. It is being developed as a practical backend learning project for Python and FastAPI.

## Tech Stack

- Python 3.15+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Python-dotenv
- uv (package and environment management)

## Current Status

This project is in an early MVP stage. Core architecture and API foundations are in place, and the app is being expanded with database and ticket logic.

Implemented:
- FastAPI application bootstrap
- Versioned API router structure
- Ticket health check endpoint
- Ticket schema validation
- Environment configuration loading
- Basic project layout for app, API, core, db, models, and schemas

In progress / planned:
- SQLAlchemy model implementation
- PostgreSQL connection setup
- Service and repository patterns
- Full CRUD ticket operations
- Better validation and error handling
- Tests and documentation improvements

## Project Structure

```text
help-desk/
├── .env
├── .python-version
├── pyproject.toml
├── README.md
├── app/
│   ├── main.py
│   ├── api/
│   │   └── v1/
│   │       ├── router.py
│   │       └── endpoints/
│   │           └── tickets.py
│   ├── core/
│   │   └── config.py
│   ├── db/
│   │   ├── base.py
│   │   └── postgres.py
│   ├── models/
│   │   └── tickets.py
│   ├── repositories/
│   │   └── ticket_repository.py
│   ├── schemas/
│   │   └── tickets.py
│   └── services/
│       └── ticket_service.py
```

## Setup

### 1. Clone the project

```bash
git clone <repository-url>
cd help-desk
```

### 2. Create or activate the environment

Using `uv`:

```bash
uv sync
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
APP_NAME="Help Desk"
DB_URL="postgresql://postgres:postgres@localhost:5432/helpdesk"
```

Note: Update the database credentials and database name according to your local PostgreSQL setup.

### 4. Run the app

```bash
uv run fastapi dev
```

Then open:
- http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs

## API Endpoints

### Health check

```http
GET /tickets/health-check
```

Response:

```json
{
  "status": true,
  "message": "tickets service is running successfully"
}
```

### Create a ticket

```http
POST /tickets/
```

Example payload:

```json
{
  "title": "Login issue",
  "description": "User cannot log in after password reset.",
  "priority": "high",
  "category": "authentication"
}
```

## Example Ticket Schema

```python
class TicketCreate(BaseModel):
    title: str
    description: str
    priority: str
    category: str
```

## Development Notes

This repository is intended for learning and experimentation. The app structure follows a common FastAPI pattern with separation between:

- API routes
- schemas
- services
- repositories
- database configuration

This makes it easier to extend with real CRUD operations, authentication, ticket comments, assignment logic, and testing later.

## Future Improvements

- Add SQLAlchemy `Ticket` model
- Connect to PostgreSQL with proper session management
- Implement full CRUD operations
- Add validation and custom error handling
- Add tests with pytest
- Add ticket status workflows and assignments
- Add authentication and role-based access control

## License

This project is for learning and personal development purposes.
