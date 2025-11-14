# Jiva Admin Backend API

FastAPI backend for Jiva Business Admin Panel with PostgreSQL database and Alembic migrations.

## Features

- ✅ FastAPI framework
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ Alembic migrations for database versioning
- ✅ JWT authentication
- ✅ Admin user management
- ✅ Analytics and reporting endpoints
- ✅ CORS enabled for frontend

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database

Update `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql+psycopg://postgres:your_password@localhost:5432/jiva_admin
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=jiva_admin
```

### 3. Create Database

Create the database in PostgreSQL:

```sql
CREATE DATABASE jiva_admin;
```

### 4. Run Migrations

```bash
# Initialize Alembic (only first time)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Create Admin User

Run the seed script to create an admin user:

```bash
python scripts/seed_admin.py
```

Default admin credentials:
- **Email**: `admin@jiva.com`
- **Password**: `admin123`

### 6. Run the Server

```bash
# Development mode with auto-reload
python app/main.py

# OR using uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 3001 --reload
```

The API will be available at: `http://localhost:3001`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3001/docs`
- ReDoc: `http://localhost:3001/redoc`

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login

### Users
- `GET /api/admin/users` - Get all users (paginated, searchable)
- `GET /api/admin/users/{id}` - Get user by ID
- `PUT /api/admin/users/{id}` - Update user
- `POST /api/admin/users/{id}/suspend` - Suspend user
- `POST /api/admin/users/{id}/activate` - Activate user
- `POST /api/admin/users/{id}/reset-password` - Reset user password

### Reports & Analytics
- `GET /api/admin/reports/analytics` - Get dashboard analytics
- `GET /api/admin/reports` - Get summary reports
- `GET /api/admin/reports/export` - Export data

### Subscriptions
- `GET /api/admin/subscriptions/plans` - Get subscription plans
- `GET /api/admin/subscriptions` - Get user subscriptions

## Database Migrations

```bash
# Create a new migration after model changes
alembic revision --autogenerate -m "Description of changes"

# Apply pending migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

## Deployment to Production Server

### 1. Transfer Files

```bash
# On local machine
scp -r backend user@your-server:/path/to/project/
```

### 2. On Server

```bash
cd /path/to/project/backend

# Install dependencies
pip install -r requirements.txt

# Update .env with production settings
nano .env

# Run migrations
alembic upgrade head

# Start with production server (use gunicorn or systemd)
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:3001
```

### 3. Use Process Manager (systemd)

Create `/etc/systemd/system/jiva-api.service`:

```ini
[Unit]
Description=Jiva Admin API
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/project/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:3001
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable jiva-api
sudo systemctl start jiva-api
sudo systemctl status jiva-api
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── auth.py              # Authentication utilities
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   └── user.py
│   ├── schemas/             # Pydantic schemas
│   │   └── user.py
│   └── api/                 # API routes
│       └── admin/
│           ├── users.py
│           └── reports.py
├── alembic/                 # Database migrations
│   ├── versions/
│   └── env.py
├── scripts/                 # Utility scripts
│   └── seed_admin.py
├── .env                     # Environment variables
├── .env.example             # Example environment file
├── alembic.ini              # Alembic configuration
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

## License

Proprietary - Jiva Business
