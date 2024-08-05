"""create notes list table

Revision ID: 001
Revises:
Create Date: 2024-08-02 20:22:32.405948

"""

from typing import Sequence, Union

from alembic import op
from pathlib import Path
import yaml
import sqlalchemy as sa

secret_config_path = Path(__file__).parent / "../../../secret_config.yaml"
secret_config = yaml.safe_load(open(secret_config_path))

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            f"GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA :: dbo TO {secret_config['app_user']}"
        )
    )
    op.create_table(
        "NotesLists",
        sa.Column("id", sa.Uuid, primary_key=True, server_default=sa.text("NEWID()")),
        sa.Column("name", sa.String(50), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("NotesLists")
