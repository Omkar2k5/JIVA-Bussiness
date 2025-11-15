"""
Seed script to create initial admin user
"""
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.database import SessionLocal
from app.models.user import User, UserRole, UserStatus
from app.auth import get_password_hash


def create_admin_user():
    """Create initial admin user"""
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == "admin@jiva.com").first()
        if existing_admin:
            print("[OK] Admin user already exists!")
            print(f"Email: {existing_admin.email}")
            return
        
        # Create admin user
        admin_user = User(
            name="Super Admin",
            email="admin@jiva.com",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.super_admin,
            status=UserStatus.active,
            subscription_plan="Enterprise",
            is_email_verified=True,
            phone="+1-555-0000",
            plan_valid_until=datetime.now().date() + timedelta(days=365),
            reference="System Admin"
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("[OK] Admin user created successfully!")
        print(f"Email: {admin_user.email}")
        print(f"Password: admin123")
        print(f"Role: {admin_user.role}")
        print("\n[WARNING] Please change the password after first login!")
        
    except Exception as e:
        print(f"[ERROR] Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()


def create_sample_users():
    """Create sample users for testing"""
    db = SessionLocal()
    
    try:
        reference_names = ["John Smith", "Alice Johnson", "Bob Wilson", "Carol Davis", "David Miller",
                          "Emma Brown", "Frank Taylor", "Grace Lee", "Henry Anderson", "Iris Martinez",
                          "Jack White", "Karen Harris", "Leo Clark", "Mona Lewis", "Nathan Young"]
        
        sample_users = [
            {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0101",
                "reference": reference_names[0],
                "days_valid": 180
            },
            {
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "password": "password123",
                "plan": "Enterprise",
                "status": "active",
                "phone": "+1-555-0102",
                "reference": reference_names[1],
                "days_valid": 365
            },
            {
                "name": "Mike Johnson",
                "email": "mike.j@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "active",
                "phone": "+1-555-0103",
                "reference": reference_names[2],
                "days_valid": 30
            },
            {
                "name": "Sarah Williams",
                "email": "sarah.w@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0104",
                "reference": reference_names[3],
                "days_valid": 200
            },
            {
                "name": "David Brown",
                "email": "d.brown@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "suspended",
                "phone": "+1-555-0105",
                "reference": reference_names[4],
                "days_valid": 15
            },
            {
                "name": "Emily Davis",
                "email": "emily.davis@example.com",
                "password": "password123",
                "plan": "Enterprise",
                "status": "active",
                "phone": "+1-555-0106",
                "reference": reference_names[5],
                "days_valid": 365
            },
            {
                "name": "Robert Wilson",
                "email": "robert.w@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0107",
                "reference": reference_names[6],
                "days_valid": 150
            },
            {
                "name": "Lisa Anderson",
                "email": "lisa.anderson@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "active",
                "phone": "+1-555-0108",
                "reference": reference_names[7],
                "days_valid": 60
            },
            {
                "name": "James Taylor",
                "email": "james.taylor@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0109",
                "reference": reference_names[8],
                "days_valid": 250
            },
            {
                "name": "Patricia Martinez",
                "email": "patricia.m@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "active",
                "phone": "+1-555-0110",
                "reference": reference_names[9],
                "days_valid": 45
            },
            {
                "name": "Christopher Lee",
                "email": "chris.lee@example.com",
                "password": "password123",
                "plan": "Enterprise",
                "status": "active",
                "phone": "+1-555-0111",
                "reference": reference_names[10],
                "days_valid": 365
            },
            {
                "name": "Jennifer White",
                "email": "jennifer.w@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "suspended",
                "phone": "+1-555-0112",
                "reference": reference_names[11],
                "days_valid": 90
            },
            {
                "name": "Daniel Harris",
                "email": "daniel.harris@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "active",
                "phone": "+1-555-0113",
                "reference": reference_names[12],
                "days_valid": 30
            },
            {
                "name": "Nancy Clark",
                "email": "nancy.clark@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0114",
                "reference": reference_names[13],
                "days_valid": 180
            },
            {
                "name": "Mark Lewis",
                "email": "mark.lewis@example.com",
                "password": "password123",
                "plan": "Enterprise",
                "status": "active",
                "phone": "+1-555-0115",
                "reference": reference_names[14],
                "days_valid": 365
            }
        ]
        
        created_count = 0
        for user_data in sample_users:
            # Check if user exists
            existing = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing:
                user = User(
                    name=user_data["name"],
                    email=user_data["email"],
                    hashed_password=get_password_hash(user_data["password"]),
                    role=UserRole.user,
                    status=UserStatus(user_data["status"]),
                    subscription_plan=user_data["plan"],
                    phone=user_data.get("phone"),
                    is_email_verified=True,
                    reference=user_data.get("reference"),
                    plan_valid_until=datetime.now().date() + timedelta(days=user_data.get("days_valid", 30))
                )
                db.add(user)
                created_count += 1
        
        db.commit()
        print(f"[OK] Created {created_count} sample users!")
        
    except Exception as e:
        print(f"[ERROR] Error creating sample users: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    print("[START] Seeding database...")
    print("\n[INFO] Creating admin user...")
    create_admin_user()
    
    print("\n[INFO] Creating sample users...")
    create_sample_users()
    
    print("\n[DONE] Database seeding complete!")
