"""create notes table

Revision ID: 002
Revises: 001
Create Date: 2024-08-02 20:27:48.437154

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "Notes",
        sa.Column("id", sa.Uuid, primary_key=True),
        sa.Column("content", sa.String(150), nullable=False),
        sa.Column("is_ticked", sa.Boolean, nullable=False),
        sa.Column("is_carried", sa.Boolean, nullable=False),
        sa.Column("is_removed", sa.Boolean, nullable=False),
        sa.Column("page_count", sa.Integer, nullable=False),
    )


def downgrade() -> None:
    op.drop_table("Notes")
