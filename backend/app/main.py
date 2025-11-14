from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.auth import verify_password, create_access_token, get_password_hash
from app.schemas.user import Token, LoginResponse, LoginUser
from app.api.admin import users, reports
from pydantic import BaseModel

app = FastAPI(
    title="Jiva Admin API",
    description="Admin API for Jiva Business Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: str
    password: str


@app.get("/")
def root():
    """API health check"""
    return {
        "status": "ok",
        "message": "Jiva Admin API is running",
        "version": "1.0.0"
    }


@app.post(f"{settings.API_V1_PREFIX}/admin/auth/login", response_model=LoginResponse)
def admin_login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Admin login endpoint"""
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": LoginUser(id=user.id, email=user.email, name=user.name, role=user.role)
    }


# Include routers
app.include_router(
    users.router,
    prefix=f"{settings.API_V1_PREFIX}/admin/users",
    tags=["Admin - Users"]
)

app.include_router(
    reports.router,
    prefix=f"{settings.API_V1_PREFIX}/admin/reports",
    tags=["Admin - Reports"]
)


# Placeholder for subscriptions routes
@app.get(f"{settings.API_V1_PREFIX}/admin/subscriptions/plans")
def get_subscription_plans():
    """Get all subscription plans (placeholder)"""
    return {
        "success": True,
        "plans": [
            {
                "id": "1",
                "name": "Free",
                "price": 0,
                "duration": "monthly",
                "features": ["Basic features", "5 projects", "Community support"]
            },
            {
                "id": "2",
                "name": "Premium",
                "price": 29.99,
                "duration": "monthly",
                "features": ["All Free features", "Unlimited projects", "Priority support", "Advanced analytics"]
            },
            {
                "id": "3",
                "name": "Enterprise",
                "price": 99.99,
                "duration": "monthly",
                "features": ["All Premium features", "Custom integrations", "Dedicated support", "SLA guarantee"]
            }
        ]
    }


@app.get(f"{settings.API_V1_PREFIX}/admin/subscriptions")
def get_subscriptions():
    """Get all subscriptions (placeholder)"""
    return {
        "success": True,
        "subscriptions": []
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=3001, reload=True)
