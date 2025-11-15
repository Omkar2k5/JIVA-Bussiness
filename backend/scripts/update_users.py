"""
Script to update existing users with new plan fields
"""
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.database import SessionLocal
from app.models.user import User

reference_names = ["John Smith", "Alice Johnson", "Bob Wilson", "Carol Davis", "David Miller", 
                  "Emma Brown", "Frank Taylor", "Grace Lee", "Henry Anderson", "Iris Martinez",
                  "Jack White", "Karen Harris", "Leo Clark", "Mona Lewis", "Nathan Young"]

days_valid_list = [180, 365, 30, 200, 15, 365, 150, 60, 250, 45, 365, 90, 30, 180, 365]

db = SessionLocal()

try:
    users = db.query(User).all()
    updated_count = 0
    
    for idx, user in enumerate(users):
        if user.email != "admin@jiva.com":
            user.reference = reference_names[idx % len(reference_names)]
            user.plan_valid_until = datetime.now().date() + timedelta(days=days_valid_list[idx % len(days_valid_list)])
            updated_count += 1
        else:
            user.reference = "System Admin"
            user.plan_valid_until = datetime.now().date() + timedelta(days=365)
    
    db.commit()
    print(f"[OK] Updated {updated_count} users with plan fields!")
    
except Exception as e:
    print(f"[ERROR] Error updating users: {e}")
    db.rollback()
finally:
    db.close()
