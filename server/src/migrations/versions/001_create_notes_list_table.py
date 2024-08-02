"""create notes list table

Revision ID: 001
Revises:
Create Date: 2024-08-02 20:22:32.405948

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "NotesLists",
        sa.Column("id", sa.Uuid, primary_key=True),
        sa.Column("name", sa.String(50), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("NotesLists")
