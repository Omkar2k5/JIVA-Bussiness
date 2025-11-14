# Quick Setup Guide for Windows

Follow these steps to get the backend running on your local machine.

## Step 1: Install Python Dependencies

```powershell
cd "C:\Projects\JIVA Project 2\backend"
pip install -r requirements.txt
```

## Step 2: Configure PostgreSQL Database

1. **Start PostgreSQL** (if not running)
2. **Open `psql`** or any PostgreSQL client
3. **Create the database**:

```sql
CREATE DATABASE jiva_admin;
```

4. **Update `.env` file** with your PostgreSQL credentials

## Step 3: Initialize Alembic and Run Migrations

```powershell
# Create initial migration
alembic revision --autogenerate -m "Initial migration - users table"

# Apply the migration to database
alembic upgrade head
```

## Step 4: Seed Admin User and Sample Data

```powershell
python scripts/seed_admin.py
```

This will create:
- **Admin user**: `admin@jiva.com` / `admin123`
- **5 sample users** for testing

## Step 5: Start the Backend Server

```powershell
# Start the API server
python app/main.py
```

The API will be running at: **http://localhost:3001**

## Step 6: Test the API

Open your browser and visit:
- **API Docs**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001

## Step 7: Connect Frontend

Update the frontend `.env.local` to point to the backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Then restart your Next.js frontend.

## Test the Admin Login

Now you can login to the admin panel with:
- **Email**: `admin@jiva.com`
- **Password**: `admin123`

## Troubleshooting

### PostgreSQL Connection Error

If you get a connection error:
1. Check PostgreSQL is running: `Get-Service *postgres*`
2. Verify credentials in `.env` file
3. Test connection: `psql -U postgres -h localhost -d jiva_admin`

### Module Not Found

If you get import errors:
```powershell
# Make sure you're in the backend directory
cd "C:\Projects\JIVA Project 2\backend"

# Reinstall dependencies
pip install -r requirements.txt
```

### Migration Errors

If migrations fail:
```powershell
# Drop and recreate database
psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS jiva_admin;"
psql -U postgres -h localhost -c "CREATE DATABASE jiva_admin;"

# Run migrations again
alembic upgrade head
```

## Next Steps

✅ Backend is now running!
✅ Frontend can connect to real data
✅ Admin panel fully functional

You can now:
- Login with real authentication
- Manage users in the database
- View real analytics data
- All CRUD operations work with PostgreSQL
