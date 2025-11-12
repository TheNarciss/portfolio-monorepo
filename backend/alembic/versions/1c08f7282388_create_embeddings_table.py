"""add embeddings table only

Revision ID: 1c08f7282388
Revises: 1fdaa141e780
Create Date: 2025-11-03 20:25:28.662254
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1c08f7282388'
down_revision = '1fdaa141e780'
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'embeddings',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('vector', postgresql.ARRAY(sa.FLOAT()), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('source', sa.String(), nullable=False),
        sa.Column('reference_id', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('embeddings')