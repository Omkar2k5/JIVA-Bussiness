from alembic import op
import sqlalchemy as sa

revision = "20251114_000001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    userstatus = sa.Enum("active", "suspended", "pending", name="userstatus")
    userrole = sa.Enum("user", "admin", "super_admin", name="userrole")

    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("status", userstatus, nullable=False, server_default="active"),
        sa.Column("role", userrole, nullable=False, server_default="user"),
        sa.Column("subscription_plan", sa.String(50), nullable=False, server_default="Free"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("last_active", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("phone", sa.String(20)),
        sa.Column("avatar_url", sa.String(500)),
        sa.Column("is_email_verified", sa.Boolean, nullable=False, server_default=sa.text("false")),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS userstatus")
    op.execute("DROP TYPE IF EXISTS userrole")

