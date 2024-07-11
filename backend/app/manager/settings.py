from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.schemas.settings import (
    Line,
    Position,
    Section,
)
from app.crud import SettingsCRUD
from app.utils.logger import get_logger

logger = get_logger(__name__)


class SettingsManager:
    def __init__(self):
        self.crud = SettingsCRUD()

    async def get_lines(self, db: AsyncSession = None):
        res = await self.crud.get_lines(db=db)
        return_list = []
        try:
            for r in res:
                key_index = r._key_to_index
                return_list.append(
                    Line(
                        line_id=r[key_index["line_id"]],
                        line_name=r[key_index["line_name"]],
                        line_fullname=r[key_index["line_fullname"]],
                        line_code=r[key_index["line_code"]],
                        work_center_code=r[key_index["work_center_code"]],
                        process_code=r[key_index["process_code"]],
                        line_group=r[key_index["line_group"]],
                        group_type=r[key_index["group_type"]],
                        section_id=r[key_index["section_id"]],
                    )
                )
            if len(return_list) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Line not found"
                )
            return return_list
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get lines because {e}",
            )

    async def get_positions(self, db: AsyncSession = None):
        res = await self.crud.get_positions(db=db)
        return_list = []
        try:
            for r in res:
                key_index = r._key_to_index
                return_list.append(
                    Position(
                        position_id=r[key_index["position_id"]],
                        position_name=r[key_index["position_name"]],
                        position_shortname=r[key_index["position_shortname"]],
                        position_level=r[key_index["position_level"]],
                        position_group=r[key_index["position_group"]],
                    )
                )
            if len(return_list) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Position not found"
                )
            return return_list
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get positions because {e}",
            )

    async def get_sections(self, db: AsyncSession = None):
        res = await self.crud.get_sections(db=db)
        return_list = []
        try:
            for r in res:
                key_index = r._key_to_index
                return_list.append(
                    Section(
                        section_id=r[key_index["section_id"]],
                        section_code=str(r[key_index["section_code"]]),
                        section_name=r[key_index["section_name"]],
                        sub_section_name=r[key_index["sub_section_name"]],
                        department=r[key_index["department"]],
                        sub_department=r[key_index["sub_department"]],
                        division=r[key_index["division"]],
                        company=r[key_index["company"]],
                        plant=r[key_index["plant"]],
                        group_type=r[key_index["group_type"]],
                    )
                )
            if len(return_list) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Section not found"
                )
            return return_list
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get sections because {e}",
            )
