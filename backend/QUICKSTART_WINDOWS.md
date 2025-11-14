# Quick Start for Windows

## ✅ Step 1: Dependencies Installed!

You've already completed: `pip install -r requirements.txt`

## 📊 Step 2: Setup PostgreSQL Database

### Using psql:

1. **Install PostgreSQL** and ensure `psql` is available
2. **Create the database**:
   ```sql
   CREATE DATABASE jiva_admin;
   ```

## 🔧 Step 3: Configure Database Password

Update the `.env` file with your PostgreSQL password:

```powershell
notepad .env
```

Change this line to your actual password:
```
DB_PASSWORD=your_actual_password
```

## 🗄️ Step 4: Run Database Migrations

```powershell
# Create the initial migration
alembic revision --autogenerate -m "Initial migration - users table"

# Apply migrations to database
alembic upgrade head
```

## 👤 Step 5: Create Admin User

```powershell
python scripts/seed_admin.py
```

You should see:
```
✅ Admin user created successfully!
Email: admin@jiva.com
Password: admin123
```

## 🚀 Step 6: Start the Backend Server

```powershell
python app/main.py
```

The server will start on **http://localhost:3001**

Open your browser and visit:
- **API Docs**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001

## 🔗 Step 7: Connect Frontend

In your frontend folder (`Super-Admin Web`), update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Then restart the Next.js dev server.

## 🎉 Done!

Now login to your admin panel with:
- **Email**: `admin@jiva.com`  
- **Password**: `admin123`

---

## ⚠️ Troubleshooting

### "Can't connect to PostgreSQL"

**Check if PostgreSQL is running:**
```powershell
Get-Service -Name "*postgres*"
```

If not running, start it from Services or PostgreSQL App.

### "FATAL: password authentication failed"

Update your password in `.env`:
```
DB_PASSWORD=your_actual_postgres_password
```

### "alembic: command not found"

The alembic command is installed but not in your PATH. Use full path:
```powershell
python -m alembic revision --autogenerate -m "Initial migration"
python -m alembic upgrade head
```

### Still having issues?

Check the main README.md for detailed troubleshooting steps.
