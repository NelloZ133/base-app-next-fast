from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator
from .database import app_pg_async_session, common_pg_async_session


async def get_app_pg_async_db():
    db = app_pg_async_session()
    try:
        yield db
    finally:
        await db.close()


async def get_app_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with app_pg_async_session() as session:
        yield session


async def get_app_db(session: AsyncSession = Depends(get_app_async_session)):
    yield session


async def get_common_pg_async_db():
    db = common_pg_async_session()
    try:
        yield db
    finally:
        await db.close()


async def get_common_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with common_pg_async_session() as session:
        yield session


async def get_common_db(session: AsyncSession = Depends(get_common_async_session)):
    yield session
