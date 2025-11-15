# Quick Start Guide - JIVA Project

## Prerequisites
- PostgreSQL 18.1+ installed and running
- Python 3.12+
- Node.js 18+
- npm or pnpm

## One-Time Setup

### 1. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Database Migrations
```bash
cd backend
python -m alembic upgrade head
```

### 3. Seed Database with Dummy Data
```bash
cd backend
python scripts/seed_admin.py
```

### 4. Install Frontend Dependencies
```bash
cd "Super-Admin Web"
npm install
```

## Running the Project

### Terminal 1: Start Backend Server
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 3001 --reload
```
- Backend API: http://localhost:3001
- Swagger UI: http://localhost:3001/docs

### Terminal 2: Start Frontend Server
```bash
cd "Super-Admin Web"
npm run dev
```
- Frontend: http://localhost:3000

## Login Credentials

**Admin Account:**
- Email: `admin@jiva.com`
- Password: `admin123`

## Testing the Integration

### 1. Test Login via API
```bash
curl -X POST http://localhost:3001/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jiva.com","password":"admin123"}'
```

### 2. Test Get Users (replace TOKEN with actual token)
```bash
curl -X GET "http://localhost:3001/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

### 3. Access Frontend
- Open http://localhost:3000 in browser
- Login with admin@jiva.com / admin123
- Navigate to Users page to see real data from database

## Database Info

- **Host**: localhost
- **Port**: 5432
- **Database**: jiva
- **User**: jiva
- **Password**: jiva

## Available Users in Database

### Admin
- admin@jiva.com (super_admin)

### Sample Users (15 total)
- john.doe@example.com (Premium, Active)
- jane.smith@example.com (Enterprise, Active)
- mike.j@example.com (Free, Active)
- sarah.w@example.com (Premium, Active)
- d.brown@example.com (Free, Suspended)
- emily.davis@example.com (Enterprise, Active)
- robert.w@example.com (Premium, Active)
- lisa.anderson@example.com (Free, Active)
- james.taylor@example.com (Premium, Active)
- patricia.m@example.com (Free, Active)
- chris.lee@example.com (Enterprise, Active)
- jennifer.w@example.com (Premium, Suspended)
- daniel.harris@example.com (Free, Active)
- nancy.clark@example.com (Premium, Active)
- mark.lewis@example.com (Enterprise, Active)

All sample users have password: `password123`

## Key Features Implemented

✅ PostgreSQL database with proper schema
✅ User authentication with JWT tokens
✅ Argon2 password hashing
✅ 16 users in database (1 admin + 15 sample)
✅ Real-time data fetching from database
✅ User pagination and search
✅ User status management (active/suspended)
✅ Subscription plan tracking
✅ API endpoints fully functional
✅ Frontend integrated with backend

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify PostgreSQL is running
- Check `.env` file configuration

### Frontend won't start
- Check if port 3000 is available
- Run `npm install` in "Super-Admin Web" directory
- Clear `.next` cache if needed

### No data showing in frontend
- Verify backend is running
- Check browser console for errors
- Ensure you're logged in
- Check network tab for API calls

### Database connection error
- Verify PostgreSQL is running: `psql --version`
- Check credentials in `backend/.env`
- Ensure database "jiva" exists

## Next Steps

1. **Customize Admin Password**: Change admin123 to a secure password
2. **Add More Users**: Use the seed script as template
3. **Implement Additional Features**: Reports, subscriptions, etc.
4. **Deploy to Production**: Update environment variables and database
5. **Set Up CI/CD**: Automate testing and deployment

## Documentation

- Full setup guide: See `DATABASE_SETUP.md`
- API documentation: http://localhost:3001/docs (when backend is running)
- Frontend code: `Super-Admin Web/components/pages/users.tsx`
- Backend code: `backend/app/api/admin/users.py`
