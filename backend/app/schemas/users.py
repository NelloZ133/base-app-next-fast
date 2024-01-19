import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional, List


class UserLogin(BaseModel):
    user_id: str
    user_pass: str


class UserDetail(BaseModel):
    user_uuid: str
    user_id: str
    firstname: Optional[str]
    lastname: Optional[str]
    email: Optional[EmailStr]
    app_line_id: Optional[str] = ""
    position_id: Optional[int]
    position_name: Optional[str]
    position_group: Optional[str]
    section_code: Optional[int]
    concern_line: Optional[List[int]] = []
    main_line: Optional[int] = 0
    shift: str = None
    is_active: bool = True
    is_admin: bool = False
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]
    supervisor_email: Optional[EmailStr]
    manager_email: Optional[EmailStr]
    access_token: str = ""
    refresh_token: str = ""
    token_type: str = "Bearer"


class AllUsersResponse(BaseModel):
    users: List[UserDetail]


class Position(BaseModel):
    position_id: int
    position_level: int
    position_name: str
    position_full_name: str
    position_group: str


class PositionResponse(BaseModel):
    positions: List[Position]


class UserHandle(BaseModel):
    user_id: str
    user_pass: str = ""
    firstname: str
    lastname: str
    email: Optional[EmailStr]
    supervisor_email: Optional[EmailStr]
    manager_email: Optional[EmailStr]
    app_line_id: Optional[str] = ""
    position_id: int
    section_code: int
    concern_line: Optional[List[int]] = []
    main_line: Optional[int] = 0
    shift: str = "N"
    is_active: bool = True
    is_admin: bool = False


class UserUpdate(UserHandle):
    user_uuid: str


class UserCreate(UserHandle):
    user_uuid: str
    created_at: str


class UserPasswordChange(BaseModel):
    user_uuid: str
    current_password: str
    new_password: str
