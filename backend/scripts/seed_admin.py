"""
Seed script to create initial admin user
"""
import sys
from pathlib import Path

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
            is_email_verified=True
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
        sample_users = [
            {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0101"
            },
            {
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "password": "password123",
                "plan": "Enterprise",
                "status": "active",
                "phone": "+1-555-0102"
            },
            {
                "name": "Mike Johnson",
                "email": "mike.j@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "active",
                "phone": "+1-555-0103"
            },
            {
                "name": "Sarah Williams",
                "email": "sarah.w@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0104"
            },
            {
                "name": "David Brown",
                "email": "d.brown@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "suspended",
                "phone": "+1-555-0105"
            },
            {
                "name": "Emily Davis",
                "email": "emily.davis@example.com",
                "password": "password123",
                "plan": "Enterprise",
                "status": "active",
                "phone": "+1-555-0106"
            },
            {
                "name": "Robert Wilson",
                "email": "robert.w@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0107"
            },
            {
                "name": "Lisa Anderson",
                "email": "lisa.anderson@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "active",
                "phone": "+1-555-0108"
            },
            {
                "name": "James Taylor",
                "email": "james.taylor@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0109"
            },
            {
                "name": "Patricia Martinez",
                "email": "patricia.m@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "active",
                "phone": "+1-555-0110"
            },
            {
                "name": "Christopher Lee",
                "email": "chris.lee@example.com",
                "password": "password123",
                "plan": "Enterprise",
                "status": "active",
                "phone": "+1-555-0111"
            },
            {
                "name": "Jennifer White",
                "email": "jennifer.w@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "suspended",
                "phone": "+1-555-0112"
            },
            {
                "name": "Daniel Harris",
                "email": "daniel.harris@example.com",
                "password": "password123",
                "plan": "Free",
                "status": "active",
                "phone": "+1-555-0113"
            },
            {
                "name": "Nancy Clark",
                "email": "nancy.clark@example.com",
                "password": "password123",
                "plan": "Premium",
                "status": "active",
                "phone": "+1-555-0114"
            },
            {
                "name": "Mark Lewis",
                "email": "mark.lewis@example.com",
                "password": "password123",
                "plan": "Enterprise",
                "status": "active",
                "phone": "+1-555-0115"
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
                    is_email_verified=True
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
