"""
Script to create the database if it doesn't exist
"""
import sys
from pathlib import Path
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database connection parameters
DB_HOST = "localhost"
DB_PORT = 5432
DB_USER = "postgres"
DB_PASSWORD = "omkar"
DB_NAME = "JIVA"
DB_APP_USER = "jiva"
DB_APP_PASSWORD = "jiva"

try:
    # Connect to PostgreSQL server as superuser (default postgres database)
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database="postgres"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{DB_NAME}'")
    exists = cursor.fetchone()
    
    if exists:
        print(f"✅ Database '{DB_NAME}' already exists!")
    else:
        # Create database
        cursor.execute(f"CREATE DATABASE {DB_NAME}")
        print(f"✅ Database '{DB_NAME}' created successfully!")
    
    cursor.close()
    conn.close()
    
except psycopg2.OperationalError as e:
    print(f"❌ Connection error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
