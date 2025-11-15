from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional
from app.models.user import UserStatus, UserRole


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.user
    subscription_plan: Optional[str] = "Free"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    status: Optional[UserStatus] = None
    role: Optional[UserRole] = None
    subscription_plan: Optional[str] = None
    phone: Optional[str] = None
    reference: Optional[str] = None
    plan_valid_until: Optional[date] = None


class UserResponse(UserBase):
    id: int
    status: UserStatus
    role: UserRole
    subscription_plan: str
    created_at: datetime
    updated_at: datetime
    last_active: Optional[datetime]
    phone: Optional[str]
    reference: Optional[str]
    plan_valid_until: Optional[date]
    is_email_verified: bool
    
    class Config:
        from_attributes = True


class UserListResponse(BaseModel):
    users: list[UserResponse]
    total: int
    page: int
    limit: int
    success: bool = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None

class LoginUser(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: UserRole

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: LoginUser
