from pydantic import BaseModel
from typing import List


class Line(BaseModel):
    line_id: int | None = None
    line_name: str | None = None
    line_fullname: str | None = None
    line_code: str | None = None
    work_center_code: str | None = None
    process_code: str | None = None
    line_group: str | None = None
    group_type: str | None = None
    section_id: int | None = None


class LineResponse(BaseModel):
    lines: List[Line]


class Position(BaseModel):
    position_id: int | None = None
    position_name: str | None = None
    position_shortname: str | None = None
    position_level: str | None = None
    position_group: str | None = None


class PositionResponse(BaseModel):
    positions: List[Position]


class Section(BaseModel):
    section_id: int | None = None
    section_code: str | None = None
    section_name: str | None = None
    sub_section_name: str | None = None
    department: str | None = None
    sub_department: str | None = None
    division: str | None = None
    company: str | None = None
    plant: str | None = None
    group_type: str | None = None


class SectionResponse(BaseModel):
    sections: List[Section]
