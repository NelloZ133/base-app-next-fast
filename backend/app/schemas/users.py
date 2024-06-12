import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional, List


class UserRequest(BaseModel):
    username: str
    password: str


class User(BaseModel):
    username: str | None = None
    language: List[str] | None = None
    first_primary: str | None = None
    middle_primary: str | None = None
    last_primary: str | None = None
    first_secondary: str | None = None
    middle_secondary: str | None = None
    last_secondary: str | None = None
    first_tertiary: str | None = None
    middle_tertiary: str | None = None
    last_tertiary: str | None = None
    employee_no: str | None = None
    shift_name: str | None = None
    line_id: int | None = None
    line_id_group: List[int | None] = List[None]
    tel_no_primary: str | None = None
    tel_no_secondary: str | None = None
    email: str | None = None
    email_supervisor: str | None = None
    email_manager: str | None = None


class UserRegister(User):
    password: str
    is_admin: bool


class UserDetail(User):
    user_uuid: str
    is_admin: bool
    created_at: datetime.datetime
    updated_at: datetime.datetime


class UserResponse(UserDetail):
    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str | None = "Bearer"


class UsersResponse(BaseModel):
    users: List[UserResponse]


class UserUpdateRequest(User):
    user_uuid: str


class UserPassRequest(BaseModel):
    user_uuid: str
    cur_pass: str | None = None
    new_pass: str


class Position(BaseModel):
    position_id: int
    position_name: str
    position_shortname: str
    position_level: str
    position_group: str


class PositionResponse(BaseModel):
    positions: List[Position]
