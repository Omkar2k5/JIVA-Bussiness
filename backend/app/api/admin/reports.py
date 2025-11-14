from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User, UserStatus
from app.auth import get_current_admin

router = APIRouter()


@router.get("/analytics")
def get_analytics(
    period: str = "monthly",
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get analytics data for dashboard"""
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.status == UserStatus.active).scalar()
    
    # Calculate active subscriptions (non-free plans)
    active_subscriptions = db.query(func.count(User.id)).filter(
        User.subscription_plan.in_(["Premium", "Enterprise"])
    ).scalar()
    
    # Simulated monthly revenue (in production, calculate from actual subscription data)
    monthly_revenue = active_subscriptions * 45  # Average revenue per subscriber
    
    # Get users created in last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_today = db.query(func.count(User.id)).filter(
        User.last_active >= thirty_days_ago
    ).scalar()
    
    # Generate chart data for last 6 months
    chart_data = []
    for i in range(5, -1, -1):
        month_date = datetime.utcnow() - timedelta(days=30 * i)
        month_name = month_date.strftime("%b")
        
        # Count users created up to this month
        users_count = db.query(func.count(User.id)).filter(
            User.created_at <= month_date
        ).scalar()
        
        chart_data.append({
            "month": month_name,
            "revenue": monthly_revenue * (i + 1) // 6,  # Simulated growth
            "users": users_count or (i + 1) * 50  # Simulated if no real data
        })
    
    return {
        "success": True,
        "metrics": {
            "totalUsers": total_users,
            "activeSubscriptions": active_subscriptions,
            "monthlyRevenue": monthly_revenue,
            "activeUsers": active_today
        },
        "chartData": chart_data
    }


@router.get("")
def get_reports(
    type: str = "summary",
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get reports summary"""
    total_users = db.query(func.count(User.id)).scalar()
    
    # Calculate metrics
    new_users_30d = db.query(func.count(User.id)).filter(
        User.created_at >= datetime.utcnow() - timedelta(days=30)
    ).scalar()
    
    # Simulated metrics
    total_revenue = total_users * 35  # Average revenue per user
    churn_rate = 3.2
    avg_revenue_per_user = 45.67
    
    return {
        "success": True,
        "reports": {
            "totalRevenue": total_revenue,
            "newUsers": new_users_30d,
            "churnRate": churn_rate,
            "avgRevenuePerUser": avg_revenue_per_user
        }
    }


@router.get("/export")
def export_data(
    type: str = "all",
    format: str = "csv",
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Export data (placeholder for actual export logic)"""
    return {
        "success": True,
        "message": f"Export {format} will be generated",
        "download_url": f"/downloads/export-{datetime.utcnow().strftime('%Y%m%d')}.{format}"
    }
