from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator


from app.functions import api_key_auth
from app.manager import SettingsManager
from app.schemas.settings import (
    LineResponse,
    PositionResponse,
    SectionResponse,
)


def settings_routers(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()
    setting_manager = SettingsManager()

    @router.get(
        "/lines",
        response_model=LineResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_lines(db: AsyncSession = Depends(db)):
        return LineResponse(lines=await setting_manager.get_lines(db=db))

    @router.get(
        "/positions",
        response_model=PositionResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_positions(db: AsyncSession = Depends(db)):
        return PositionResponse(positions=await setting_manager.get_positions(db=db))

    @router.get(
        "/sections",
        response_model=SectionResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_sections(db: AsyncSession = Depends(db)):
        return SectionResponse(sections=await setting_manager.get_sections(db=db))

    return router
