# Database Setup & Integration Guide

## Overview
The JIVA Project has been successfully configured with a PostgreSQL database, populated with dummy data, and integrated with both the FastAPI backend and Next.js frontend.

## Database Configuration

### PostgreSQL Setup
- **Host**: localhost
- **Port**: 5432
- **Database**: jiva
- **User**: jiva
- **Password**: jiva

### Environment Variables
Located in `backend/.env`:
```
DATABASE_URL=postgresql://jiva:jiva@localhost:5432/jiva
DB_HOST=localhost
DB_PORT=5432
DB_USER=jiva
DB_PASSWORD=jiva
DB_NAME=jiva
SECRET_KEY=dev-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
API_V1_PREFIX=/api
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
ENVIRONMENT=development
```

## Database Schema

### Users Table
The `users` table was created via Alembic migration (`backend/alembic/versions/20251114_000001_create_users_table.py`) with the following columns:

| Column | Type | Constraints |
|--------|------|-------------|
| id | Integer | PRIMARY KEY, AUTO INCREMENT |
| name | String(255) | NOT NULL |
| email | String(255) | NOT NULL, UNIQUE |
| hashed_password | String(255) | NOT NULL |
| status | Enum(active, suspended, pending) | NOT NULL, DEFAULT: active |
| role | Enum(user, admin, super_admin) | NOT NULL, DEFAULT: user |
| subscription_plan | String(50) | DEFAULT: Free |
| created_at | DateTime(timezone) | NOT NULL, DEFAULT: NOW() |
| updated_at | DateTime(timezone) | NOT NULL, DEFAULT: NOW() |
| last_active | DateTime(timezone) | DEFAULT: NOW() |
| phone | String(20) | NULLABLE |
| avatar_url | String(500) | NULLABLE |
| is_email_verified | Boolean | NOT NULL, DEFAULT: false |

## Dummy Data

### Admin User
- **Email**: admin@jiva.com
- **Password**: admin123
- **Role**: super_admin
- **Status**: active
- **Plan**: Enterprise

### Sample Users (15 total)
The database includes 15 sample users with varying:
- **Subscription Plans**: Free, Premium, Enterprise
- **Status**: active, suspended
- **Phone Numbers**: +1-555-0101 through +1-555-0115

Sample users include:
1. John Doe (Premium, Active)
2. Jane Smith (Enterprise, Active)
3. Mike Johnson (Free, Active)
4. Sarah Williams (Premium, Active)
5. David Brown (Free, Suspended)
6. Emily Davis (Enterprise, Active)
7. Robert Wilson (Premium, Active)
8. Lisa Anderson (Free, Active)
9. James Taylor (Premium, Active)
10. Patricia Martinez (Free, Active)
11. Christopher Lee (Enterprise, Active)
12. Jennifer White (Premium, Suspended)
13. Daniel Harris (Free, Active)
14. Nancy Clark (Premium, Active)
15. Mark Lewis (Enterprise, Active)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Migrations
```bash
cd backend
python -m alembic upgrade head
```

### 3. Seed Database
```bash
cd backend
python scripts/seed_admin.py
```

### 4. Start Backend Server
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 3001 --reload
```

### 5. Start Frontend Server
```bash
cd "Super-Admin Web"
npm run dev
```

## API Endpoints

### Authentication
- **POST** `/api/admin/auth/login`
  - Request: `{ "email": "admin@jiva.com", "password": "admin123" }`
  - Response: `{ "access_token": "...", "token_type": "bearer", "user": {...} }`

### Users Management
- **GET** `/api/admin/users?page=1&limit=10`
  - Returns paginated list of users with total count
  - Requires: Bearer token in Authorization header
  - Response includes: users array, total count, page, limit, success flag

- **GET** `/api/admin/users/{user_id}`
  - Returns specific user details
  - Requires: Bearer token

- **PUT** `/api/admin/users/{user_id}`
  - Updates user information
  - Requires: Bearer token

- **POST** `/api/admin/users/{user_id}/suspend`
  - Suspends a user account
  - Requires: Bearer token

- **POST** `/api/admin/users/{user_id}/activate`
  - Activates a suspended user
  - Requires: Bearer token

- **POST** `/api/admin/users/{user_id}/reset-password`
  - Sends password reset link (simulated)
  - Requires: Bearer token

## Frontend Integration

### API Client
Located in `Super-Admin Web/lib/api-client.ts`, the frontend uses:
- **Base URL**: `http://localhost:3001/api` (configurable via `NEXT_PUBLIC_API_URL`)
- **Authentication**: JWT tokens stored in localStorage
- **Methods**: getUsers, getUserById, updateUser, suspendUser, resetUserPassword

### Users Page
Located in `Super-Admin Web/components/pages/users.tsx`:
- Displays paginated list of users from database
- Shows user statistics (total, active, suspended, premium)
- Supports search functionality
- Allows user suspension and password reset actions
- Real-time data fetching from backend API

## Testing the Integration

### 1. Login
```bash
curl -X POST http://localhost:3001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jiva.com","password":"admin123"}'
```

### 2. Get Users
```bash
curl -X GET "http://localhost:3001/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### 3. Access Frontend
- Navigate to `http://localhost:3000`
- Login with admin@jiva.com / admin123
- View Users page at `http://localhost:3000/admin/users`
- All user data is fetched from the PostgreSQL database in real-time

## Key Changes Made

### 1. Database Configuration
- Updated `backend/.env` to use lowercase database name "jiva"
- Configured PostgreSQL connection with proper credentials

### 2. Authentication
- Updated `backend/app/auth.py` to use argon2 hashing (more reliable than bcrypt)
- Supports both argon2 and bcrypt for backward compatibility

### 3. Seed Script Enhancement
- Enhanced `backend/scripts/seed_admin.py` with 15 sample users
- Added phone numbers and varied subscription plans
- Added suspended user status for testing
- Fixed Unicode encoding issues for Windows compatibility

### 4. API Endpoints
- All endpoints now fetch real data from PostgreSQL database
- Proper pagination support with limit and offset
- Search functionality for users by name, email, or ID
- User status filtering and management

## Production Considerations

1. **Change Passwords**: Update admin password before production
2. **Environment Variables**: Use strong SECRET_KEY in production
3. **Database Backups**: Implement regular backup strategy
4. **CORS Configuration**: Update BACKEND_CORS_ORIGINS for production domain
5. **SSL/TLS**: Enable HTTPS in production
6. **Rate Limiting**: Implement rate limiting on API endpoints
7. **Logging**: Configure proper logging for production
8. **Database Migrations**: Use Alembic for all schema changes

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `psql --version`
- Check credentials in `.env` file
- Ensure database "jiva" exists

### Migration Issues
- Clear alembic history if needed: `python -m alembic downgrade base`
- Re-run migrations: `python -m alembic upgrade head`

### API Authentication Issues
- Ensure token is included in Authorization header
- Token format: `Bearer <token>`
- Check token expiration (default: 1440 minutes)

### Frontend Not Showing Data
- Verify backend is running on port 3001
- Check browser console for API errors
- Ensure NEXT_PUBLIC_API_URL is correctly set
- Clear browser cache and localStorage

## Files Modified/Created

### Created
- `backend/scripts/create_db.py` - Database creation script
- `DATABASE_SETUP.md` - This documentation

### Modified
- `backend/.env` - Updated database configuration
- `backend/app/auth.py` - Added argon2 support
- `backend/scripts/seed_admin.py` - Enhanced with 15 sample users

### Unchanged (Working as Expected)
- `backend/app/models/user.py` - User model
- `backend/app/api/admin/users.py` - Users API endpoints
- `Super-Admin Web/lib/api-client.ts` - API client
- `Super-Admin Web/components/pages/users.tsx` - Users page component
