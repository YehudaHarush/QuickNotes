# QuickNotes

A full-stack notes management application with user authentication, Redis caching, and load-balanced API architecture.

## Features

- User registration and authentication with JWT
- Create, read, update, and delete notes with tags
- Tag-based filtering with Redis caching
- Load-balanced API with 2 instances behind NGINX
- Health checks and Prometheus metrics
- Fully containerized with Docker Compose

## Architecture

```
                    NGINX (Port 80)
                         |
        +----------------+----------------+
        |                |                |
    API-1 (3000)     API-2 (3000)    Frontend
        |                |
        +--------+-------+
                 |
        +--------+--------+
        |                 |
   PostgreSQL          Redis
```

## Tech Stack

**Backend**

- NestJS with TypeScript
- PostgreSQL + TypeORM
- Redis for caching
- JWT authentication

**Frontend**

- React 18 with TypeScript
- Vite build tool
- React Router
- Axios for API calls

**Infrastructure**

- Docker & Docker Compose
- NGINX load balancer
- Multi-stage Docker builds

## Setup

### Prerequisites

- Docker Desktop
- Git

### Quick Start

1. Clone the repository

```bash
git clone <repository-url>
cd QuickNotes
```

2. Set up environment variables

```bash
cp .env.example .env
```

3. Start all services

```bash
docker-compose up --build
```

4. Access the application

- Frontend: http://localhost
- API: http://localhost/api
- Health: http://localhost/api/health
- Metrics: http://localhost/api/metrics

### Development Mode

For hot-reload during development:

```bash
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

## API Endpoints

### Authentication

**Register**

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login**

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Notes (requires authentication)

```
GET    /api/notes          - Get all notes
GET    /api/notes/:id      - Get note by ID
POST   /api/notes          - Create note
PATCH  /api/notes/:id      - Update note
DELETE /api/notes/:id      - Delete note
```

Query parameters for filtering:

- `tags`: Filter by tags (comma-separated)

### Monitoring

```
GET /api/health    - Service health status
GET /api/metrics   - Prometheus metrics
```

## Environment Variables

See `.env.example` for configuration options:

```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/quicknotes
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
```

## Project Structure

```
QuickNotes/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/        # Authentication
│   │   ├── users/       # User management
│   │   ├── notes/       # Notes CRUD
│   │   ├── redis/       # Redis caching
│   │   ├── health/      # Health checks
│   │   └── metrics/     # Metrics
│   └── Dockerfile
├── frontend/            # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── contexts/
│   └── Dockerfile
├── nginx/              # Load balancer config
│   └── nginx.conf
└── docker-compose.yml  # Orchestration
```

## Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build

# Remove all data
docker-compose down -v
```

## License

MIT
