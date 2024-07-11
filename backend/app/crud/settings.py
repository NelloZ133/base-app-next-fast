from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text


class SettingsCRUD:
    def __init__(self):
        pass

    async def get_lines(self, db: AsyncSession, where_stmt: str | None = None):
        stmt = f"SELECT * FROM line WHERE end_effective IS NULL {where_stmt if where_stmt is not None else ''} ORDER BY line_id"
        rs = await db.execute(text(stmt))
        return rs

    async def get_positions(self, db: AsyncSession, where_stmt: str | None = None):
        stmt = f"SELECT * FROM position WHERE end_effective IS NULL {where_stmt if where_stmt is not None else ''} ORDER BY position_id"
        rs = await db.execute(text(stmt))
        return rs

    async def get_sections(self, db: AsyncSession, where_stmt: str | None = None):
        stmt = f"SELECT * FROM section WHERE end_effective IS NULL {where_stmt if where_stmt is not None else ''} ORDER BY section_id"
        rs = await db.execute(text(stmt))
        return rs
