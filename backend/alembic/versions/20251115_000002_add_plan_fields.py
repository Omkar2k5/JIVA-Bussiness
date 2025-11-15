from alembic import op
import sqlalchemy as sa

revision = "20251115_000002"
down_revision = "20251114_000001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("plan_valid_until", sa.Date(), nullable=True))
    op.add_column("users", sa.Column("reference", sa.String(255), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "reference")
    op.drop_column("users", "plan_valid_until")
