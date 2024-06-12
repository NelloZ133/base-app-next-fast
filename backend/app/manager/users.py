import os
import threading
import string
import secrets
import uuid
from dotenv import load_dotenv
from fastapi import HTTPException
from passlib import pwd
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from typing import List

from app.crud import UsersCRUD
from app.schemas.users import (
    Position,
    UserRegister,
    UserRequest,
    UserUpdateRequest,
    UserPassRequest,
    UserResponse,
)
from app.email import send_mail
from app.utils.logger import get_logger

load_dotenv()
FRONTEND_BASE_URL = os.environ.get("FRONTEND_BASE_URL")
BACKEND_BASE_URL = os.environ.get("BACKEND_BASE_URL")

logger = get_logger(__name__)


class UserManager:
    def __init__(self):
        self.password_manager = PasswordManager()
        self.crud = UsersCRUD()
        self.reset_password_key = []

    async def get_users_all(self, db: AsyncSession = None):
        res = await self.crud.get_users(db=db)
        return_list = []
        try:
            for r in res:
                key_index = r._key_to_index
                return_list.append(
                    UserResponse(
                        user_uuid=str(r[key_index["user_uuid"]]),
                        username=str(r[key_index["username"]]),
                        language=r[key_index["language"]],
                        first_primary=r[key_index["first_primary"]],
                        middle_primary=r[key_index["middle_primary"]],
                        last_primary=r[key_index["last_primary"]],
                        first_secondary=r[key_index["first_secondary"]],
                        middle_secondary=r[key_index["middle_secondary"]],
                        last_secondary=r[key_index["last_secondary"]],
                        first_tertiary=r[key_index["first_tertiary"]],
                        middle_tertiary=r[key_index["middle_tertiary"]],
                        last_tertiary=r[key_index["last_tertiary"]],
                        employee_no=r[key_index["employee_no"]],
                        shift_name=r[key_index["shift_name"]],
                        line_id=r[key_index["line_id"]],
                        line_id_group=r[key_index["line_id_group"]],
                        tel_no_primary=r[key_index["tel_no_primary"]],
                        tel_no_secondary=r[key_index["tel_no_secondary"]],
                        email=r[key_index["email"]],
                        email_supervisor=r[key_index["email_supervisor"]],
                        email_manager=r[key_index["email_manager"]],
                        is_admin=r[key_index["is_admin"]],
                        created_at=r[key_index["created_at"]],
                        updated_at=r[key_index["updated_at"]],
                        access_token=None,
                        refresh_token=None,
                        token_type="Bearer",
                    )
                )
            if len(return_list) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
                )
            return return_list
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get users because {e}",
            )

    async def get_users_by_user_uuid(
        self, user_uuid: List[str], db: AsyncSession = None
    ):
        if not len(user_uuid) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f""" AND user_uuid::TEXT IN ('{"','".join(user_uuid)}')"""
        res = await self.crud.get_users(db=db, where_stmt=where_stmt)
        return_list = []

        try:
            for r in res:
                key_index = r._key_to_index
                return_list.append(
                    UserResponse(
                        user_uuid=str(r[key_index["user_uuid"]]),
                        username=str(r[key_index["username"]]),
                        language=r[key_index["language"]],
                        first_primary=r[key_index["first_primary"]],
                        middle_primary=r[key_index["middle_primary"]],
                        last_primary=r[key_index["last_primary"]],
                        first_secondary=r[key_index["first_secondary"]],
                        middle_secondary=r[key_index["middle_secondary"]],
                        last_secondary=r[key_index["last_secondary"]],
                        first_tertiary=r[key_index["first_tertiary"]],
                        middle_tertiary=r[key_index["middle_tertiary"]],
                        last_tertiary=r[key_index["last_tertiary"]],
                        employee_no=r[key_index["employee_no"]],
                        shift_name=r[key_index["shift_name"]],
                        line_id=r[key_index["line_id"]],
                        line_id_group=r[key_index["line_id_group"]],
                        tel_no_primary=r[key_index["tel_no_primary"]],
                        tel_no_secondary=r[key_index["tel_no_secondary"]],
                        email=r[key_index["email"]],
                        email_supervisor=r[key_index["email_supervisor"]],
                        email_manager=r[key_index["email_manager"]],
                        is_admin=r[key_index["is_admin"]],
                        created_at=r[key_index["created_at"]],
                        updated_at=r[key_index["updated_at"]],
                        access_token=None,
                        refresh_token=None,
                        token_type="Bearer",
                    )
                )
            if len(return_list) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
                )
            return return_list
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get users because {e}",
            )

    async def get_users_by_username(self, username: List[str], db: AsyncSession = None):
        if not len(username) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f""" AND username IN ('{"','".join(username)}')"""
        res = await self.crud.get_users(db=db, where_stmt=where_stmt)
        return_list = []
        try:
            for r in res:
                key_index = r._key_to_index
                return_list.append(
                    UserResponse(
                        user_uuid=str(r[key_index["user_uuid"]]),
                        username=str(r[key_index["username"]]),
                        language=r[key_index["language"]],
                        first_primary=r[key_index["first_primary"]],
                        middle_primary=r[key_index["middle_primary"]],
                        last_primary=r[key_index["last_primary"]],
                        first_secondary=r[key_index["first_secondary"]],
                        middle_secondary=r[key_index["middle_secondary"]],
                        last_secondary=r[key_index["last_secondary"]],
                        first_tertiary=r[key_index["first_tertiary"]],
                        middle_tertiary=r[key_index["middle_tertiary"]],
                        last_tertiary=r[key_index["last_tertiary"]],
                        employee_no=r[key_index["employee_no"]],
                        shift_name=r[key_index["shift_name"]],
                        line_id=r[key_index["line_id"]],
                        line_id_group=r[key_index["line_id_group"]],
                        tel_no_primary=r[key_index["tel_no_primary"]],
                        tel_no_secondary=r[key_index["tel_no_secondary"]],
                        email=r[key_index["email"]],
                        email_supervisor=r[key_index["email_supervisor"]],
                        email_manager=r[key_index["email_manager"]],
                        is_admin=r[key_index["is_admin"]],
                        created_at=r[key_index["created_at"]],
                        updated_at=r[key_index["updated_at"]],
                        access_token=None,
                        refresh_token=None,
                        token_type="Bearer",
                    )
                )
            if len(return_list) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
                )
            return return_list
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get users because {e}",
            )

    async def get_user_by_user_uuid(self, user_uuid: str, db: AsyncSession = None):
        if not user_uuid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f""" AND user_uuid::TEXT = '{user_uuid}'"""
        res = await self.crud.get_users(db=db, where_stmt=where_stmt)
        data = res.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
            )
        try:
            key_index = data._key_to_index
            return UserResponse(
                user_uuid=str(data[key_index["user_uuid"]]),
                username=str(data[key_index["username"]]),
                language=data[key_index["language"]],
                first_primary=data[key_index["first_primary"]],
                middle_primary=data[key_index["middle_primary"]],
                last_primary=data[key_index["last_primary"]],
                first_secondary=data[key_index["first_secondary"]],
                middle_secondary=data[key_index["middle_secondary"]],
                last_secondary=data[key_index["last_secondary"]],
                first_tertiary=data[key_index["first_tertiary"]],
                middle_tertiary=data[key_index["middle_tertiary"]],
                last_tertiary=data[key_index["last_tertiary"]],
                employee_no=data[key_index["employee_no"]],
                shift_name=data[key_index["shift_name"]],
                line_id=data[key_index["line_id"]],
                line_id_group=data[key_index["line_id_group"]],
                tel_no_primary=data[key_index["tel_no_primary"]],
                tel_no_secondary=data[key_index["tel_no_secondary"]],
                email=data[key_index["email"]],
                email_supervisor=data[key_index["email_supervisor"]],
                email_manager=data[key_index["email_manager"]],
                is_admin=data[key_index["is_admin"]],
                created_at=data[key_index["created_at"]],
                updated_at=data[key_index["updated_at"]],
                access_token=None,
                refresh_token=None,
                token_type="Bearer",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get users because {e}",
            )

    async def get_user_by_username(self, username: str, db: AsyncSession = None):
        if not username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f""" AND username = '{username}'"""
        res = await self.crud.get_users(db=db, where_stmt=where_stmt)
        data = res.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
            )
        try:
            key_index = data._key_to_index
            return UserResponse(
                user_uuid=str(data[key_index["user_uuid"]]),
                username=str(data[key_index["username"]]),
                language=data[key_index["language"]],
                first_primary=data[key_index["first_primary"]],
                middle_primary=data[key_index["middle_primary"]],
                last_primary=data[key_index["last_primary"]],
                first_secondary=data[key_index["first_secondary"]],
                middle_secondary=data[key_index["middle_secondary"]],
                last_secondary=data[key_index["last_secondary"]],
                first_tertiary=data[key_index["first_tertiary"]],
                middle_tertiary=data[key_index["middle_tertiary"]],
                last_tertiary=data[key_index["last_tertiary"]],
                employee_no=data[key_index["employee_no"]],
                shift_name=data[key_index["shift_name"]],
                line_id=data[key_index["line_id"]],
                line_id_group=data[key_index["line_id_group"]],
                tel_no_primary=data[key_index["tel_no_primary"]],
                tel_no_secondary=data[key_index["tel_no_secondary"]],
                email=data[key_index["email"]],
                email_supervisor=data[key_index["email_supervisor"]],
                email_manager=data[key_index["email_manager"]],
                is_admin=data[key_index["is_admin"]],
                created_at=data[key_index["created_at"]],
                updated_at=data[key_index["updated_at"]],
                access_token=None,
                refresh_token=None,
                token_type="Bearer",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get users because {e}",
            )

    async def get_user_by_user_uuid_with_password(
        self, user_uuid: str, db: AsyncSession = None
    ):
        if not user_uuid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f""" AND user_uuid::TEXT = '{user_uuid}'"""
        res = await self.crud.get_users(db=db, where_stmt=where_stmt)
        data = res.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
            )
        try:
            key_index = data._key_to_index
            return UserResponse(
                user_uuid=str(data[key_index["user_uuid"]]),
                username=str(data[key_index["username"]]),
                language=data[key_index["language"]],
                first_primary=data[key_index["first_primary"]],
                middle_primary=data[key_index["middle_primary"]],
                last_primary=data[key_index["last_primary"]],
                first_secondary=data[key_index["first_secondary"]],
                middle_secondary=data[key_index["middle_secondary"]],
                last_secondary=data[key_index["last_secondary"]],
                first_tertiary=data[key_index["first_tertiary"]],
                middle_tertiary=data[key_index["middle_tertiary"]],
                last_tertiary=data[key_index["last_tertiary"]],
                employee_no=data[key_index["employee_no"]],
                shift_name=data[key_index["shift_name"]],
                line_id=data[key_index["line_id"]],
                line_id_group=data[key_index["line_id_group"]],
                tel_no_primary=data[key_index["tel_no_primary"]],
                tel_no_secondary=data[key_index["tel_no_secondary"]],
                email=data[key_index["email"]],
                email_supervisor=data[key_index["email_supervisor"]],
                email_manager=data[key_index["email_manager"]],
                is_admin=data[key_index["is_admin"]],
                created_at=data[key_index["created_at"]],
                updated_at=data[key_index["updated_at"]],
                access_token=None,
                refresh_token=None,
                token_type="Bearer",
            ), str(data[key_index["password"]])
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get users because {e}",
            )

    async def get_user_by_username_with_password(
        self, username: str, db: AsyncSession = None
    ):
        if not username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f""" AND username = '{username}'"""
        res = await self.crud.get_users(db=db, where_stmt=where_stmt)
        data = res.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
            )
        try:
            key_index = data._key_to_index
            return UserResponse(
                user_uuid=str(data[key_index["user_uuid"]]),
                username=str(data[key_index["username"]]),
                language=data[key_index["language"]],
                first_primary=data[key_index["first_primary"]],
                middle_primary=data[key_index["middle_primary"]],
                last_primary=data[key_index["last_primary"]],
                first_secondary=data[key_index["first_secondary"]],
                middle_secondary=data[key_index["middle_secondary"]],
                last_secondary=data[key_index["last_secondary"]],
                first_tertiary=data[key_index["first_tertiary"]],
                middle_tertiary=data[key_index["middle_tertiary"]],
                last_tertiary=data[key_index["last_tertiary"]],
                employee_no=data[key_index["employee_no"]],
                shift_name=data[key_index["shift_name"]],
                line_id=data[key_index["line_id"]],
                line_id_group=data[key_index["line_id_group"]],
                tel_no_primary=data[key_index["tel_no_primary"]],
                tel_no_secondary=data[key_index["tel_no_secondary"]],
                email=data[key_index["email"]],
                email_supervisor=data[key_index["email_supervisor"]],
                email_manager=data[key_index["email_manager"]],
                is_admin=data[key_index["is_admin"]],
                created_at=data[key_index["created_at"]],
                updated_at=data[key_index["updated_at"]],
                access_token=None,
                refresh_token=None,
                token_type="Bearer",
            ), str(data[key_index["password"]])
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get users because {e}",
            )

    async def get_user_by_email(self, email: str, db: AsyncSession = None):
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f""" AND email = '{email}'"""
        res = await self.crud.get_users(db=db, where_stmt=where_stmt)
        data = res.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
            )
        try:
            key_index = data._key_to_index
            return UserResponse(
                user_uuid=str(data[key_index["user_uuid"]]),
                username=str(data[key_index["username"]]),
                language=data[key_index["language"]],
                first_primary=data[key_index["first_primary"]],
                middle_primary=data[key_index["middle_primary"]],
                last_primary=data[key_index["last_primary"]],
                first_secondary=data[key_index["first_secondary"]],
                middle_secondary=data[key_index["middle_secondary"]],
                last_secondary=data[key_index["last_secondary"]],
                first_tertiary=data[key_index["first_tertiary"]],
                middle_tertiary=data[key_index["middle_tertiary"]],
                last_tertiary=data[key_index["last_tertiary"]],
                employee_no=data[key_index["employee_no"]],
                shift_name=data[key_index["shift_name"]],
                line_id=data[key_index["line_id"]],
                line_id_group=data[key_index["line_id_group"]],
                tel_no_primary=data[key_index["tel_no_primary"]],
                tel_no_secondary=data[key_index["tel_no_secondary"]],
                email=data[key_index["email"]],
                email_supervisor=data[key_index["email_supervisor"]],
                email_manager=data[key_index["email_manager"]],
                is_admin=data[key_index["is_admin"]],
                created_at=data[key_index["created_at"]],
                updated_at=data[key_index["updated_at"]],
                access_token=None,
                refresh_token=None,
                token_type="Bearer",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to get users because {e}",
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

    async def authenticate(self, user: UserRequest, db: AsyncSession = None):
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        user_data, user_pass = await self.get_user_by_username_with_password(
            username=user.username, db=db
        )
        ver_res = self.password_manager.verify_password(
            password=user.password, hashed_password=user_pass
        )

        if not ver_res:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect password"
            )
        else:
            return user_data

    async def register(self, user: UserRegister, db: AsyncSession = None):
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f"WHERE username='{user.username}' OR email='{user.email}'"
        try:
            existing = await self.crud.validate_register(where_stmt=where_stmt, db=db)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to validate user because {e}",
            )
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Username or email already exist",
            )

        user = vars(user)
        user["password"] = self.password_manager.hash_password(
            password=user["password"]
        )
        user["user_uuid"] = self.password_manager.generate_uuid(
            username=user["username"]
        )
        for key, value in user.items():
            if value is None:
                user[key] = "NULL"
            else:
                if isinstance(value, str):
                    user[key] = f"'{value}'"
                    continue
                if isinstance(value, list) and isinstance(value[0], str):
                    user[key] = f"""'{{"{'","'.join(value)}"}}'"""
                    continue
                if isinstance(value, list) and (
                    isinstance(value[0], int) or isinstance(value[0], float)
                ):
                    if len(value) > 1:
                        user[key] = str(value).replace("[", "'{").replace("]", "}'")
                    elif len(value) == 1:
                        user[key] = f"'{{{value[0]}}}'"
                    continue
        try:
            await self.crud.register(user=user, db=db)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to register user because {e}",
            )
        return user["username"]

    async def post_update_user(self, user: UserUpdateRequest, db: AsyncSession = None):
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        user = vars(user)
        for key, value in user.items():
            if value is None:
                user[key] = "NULL"
            else:
                if isinstance(value, str):
                    user[key] = f"'{value}'"
                    continue
                if isinstance(value, list) and isinstance(value[0], str):
                    user[key] = f"""'{{"{'","'.join(value)}"}}'"""
                    continue
                if isinstance(value, list) and (
                    isinstance(value[0], int) or isinstance(value[0], float)
                ):
                    if len(value) > 1:
                        user[key] = str(value).replace("[", "'{").replace("]", "}'")
                    elif len(value) == 1:
                        user[key] = f"'{{{value[0]}}}'"
                    continue

        res = await self.crud.post_update_user(user=user, db=db)
        data = res.fetchone()
        if not data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
            )
        try:
            key_index = data._key_to_index
            return UserResponse(
                user_uuid=str(data[key_index["user_uuid"]]),
                username=str(data[key_index["username"]]),
                language=data[key_index["language"]],
                first_primary=data[key_index["first_primary"]],
                middle_primary=data[key_index["middle_primary"]],
                last_primary=data[key_index["last_primary"]],
                first_secondary=data[key_index["first_secondary"]],
                middle_secondary=data[key_index["middle_secondary"]],
                last_secondary=data[key_index["last_secondary"]],
                first_tertiary=data[key_index["first_tertiary"]],
                middle_tertiary=data[key_index["middle_tertiary"]],
                last_tertiary=data[key_index["last_tertiary"]],
                employee_no=data[key_index["employee_no"]],
                shift_name=data[key_index["shift_name"]],
                line_id=data[key_index["line_id"]],
                line_id_group=data[key_index["line_id_group"]],
                tel_no_primary=data[key_index["tel_no_primary"]],
                tel_no_secondary=data[key_index["tel_no_secondary"]],
                email=data[key_index["email"]],
                email_supervisor=data[key_index["email_supervisor"]],
                email_manager=data[key_index["email_manager"]],
                is_admin=data[key_index["is_admin"]],
                created_at=data[key_index["created_at"]],
                updated_at=data[key_index["updated_at"]],
                access_token=None,
                refresh_token=None,
                token_type="Bearer",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to update user because {e}",
            )

    async def post_change_password(
        self, user: UserPassRequest, db: AsyncSession = None
    ):
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        _, user_pass = await self.get_user_by_user_uuid_with_password(
            user_uuid=user.user_uuid, db=db
        )
        ver_res = self.password_manager.verify_password(
            password=user.cur_pass, hashed_password=user_pass
        )
        if not ver_res:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Incorrect current password",
            )
        user.new_pass = self.password_manager.hash_password(password=user.new_pass)
        try:
            await self.crud.post_update_password(user=user, db=db)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to change password because {e}",
            )

    async def post_change_to_new_password(
        self, user: UserPassRequest, db: AsyncSession = None
    ):
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        user.new_pass = self.password_manager.hash_password(password=user.new_pass)
        try:
            await self.crud.post_update_password(user=user, db=db)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to change password because {e}",
            )

    async def get_reset_password(
        self, user_uuid: str, key: str | None, db: AsyncSession = None
    ):
        if not user_uuid or key not in self.reset_password_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid request. User or key not found.",
            )
        user = await self.get_user_by_user_uuid(user_uuid=user_uuid, db=db)
        new_password = self.password_manager.generate_random_password()
        await self.post_change_to_new_password(
            user=UserPassRequest(
                user_uuid=user.user_uuid, cur_pass=None, new_pass=new_password
            ),
            db=db,
        )
        self.password_manager.send_reset_password_mail(
            user=user, new_password=new_password
        )
        self.reset_password_key.remove(key)
        return user.email

    async def post_reset_password(self, credential: str, db: AsyncSession = None):
        if not credential:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        where_stmt = f"WHERE username='{credential}' OR email='{credential}'"
        try:
            existing = await self.crud.validate_register(where_stmt=where_stmt, db=db)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to validate user because {e}",
            )

        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Users not found"
            )
        key_index = existing._key_to_index
        user = UserResponse(
            user_uuid=str(existing[key_index["user_uuid"]]),
            username=str(existing[key_index["username"]]),
            language=existing[key_index["language"]],
            first_primary=existing[key_index["first_primary"]],
            middle_primary=existing[key_index["middle_primary"]],
            last_primary=existing[key_index["last_primary"]],
            first_secondary=existing[key_index["first_secondary"]],
            middle_secondary=existing[key_index["middle_secondary"]],
            last_secondary=existing[key_index["last_secondary"]],
            first_tertiary=existing[key_index["first_tertiary"]],
            middle_tertiary=existing[key_index["middle_tertiary"]],
            last_tertiary=existing[key_index["last_tertiary"]],
            employee_no=existing[key_index["employee_no"]],
            shift_name=existing[key_index["shift_name"]],
            line_id=existing[key_index["line_id"]],
            line_id_group=existing[key_index["line_id_group"]],
            tel_no_primary=existing[key_index["tel_no_primary"]],
            tel_no_secondary=existing[key_index["tel_no_secondary"]],
            email=existing[key_index["email"]],
            email_supervisor=existing[key_index["email_supervisor"]],
            email_manager=existing[key_index["email_manager"]],
            is_admin=existing[key_index["is_admin"]],
            created_at=existing[key_index["created_at"]],
            updated_at=existing[key_index["updated_at"]],
            access_token=None,
            refresh_token=None,
            token_type="Bearer",
        )
        if existing.email:
            random_key = self.password_manager.generate_random_password(length=16)
            self.reset_password_key.append(random_key)
            self.password_manager.send_request_to_reset_password_mail(
                user=user, key=random_key
            )
            return existing.email
        else:
            new_password = self.password_manager.generate_random_password()
            await self.post_change_to_new_password(
                user=UserPassRequest(
                    user_uuid=user.user_uuid, cur_pass=None, new_pass=new_password
                ),
                db=db,
            )
            self.password_manager.send_reset_password_mail(
                user=user, new_password=new_password
            )
            return (
                user.email_supervisor
                if user.email_supervisor is not None
                else user.email_manager
            )

    async def post_reset_password_to_default(
        self, username: str, db: AsyncSession = None
    ):
        if not username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid request"
            )
        default_password = self.password_manager.hash_password(password="P@ssw0rd")
        try:
            await self.crud.post_default_password(
                username=username, password=default_password, db=db
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to reset to default password because {e}",
            )


class PasswordManager:
    def __init__(self, context: CryptContext | None = None) -> None:
        if context is None:
            self.context = CryptContext(
                schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12
            )
        else:
            self.context = context

    def generate_uuid(self, username: str) -> str:
        return str(uuid.uuid5(uuid.NAMESPACE_X500, username))

    def hash_password(self, password: str) -> str:
        return self.context.hash(password)

    def verify_password(self, password: str, hashed_password: str) -> None:
        verified, _ = self.context.verify_and_update(password, hashed_password)
        if not verified:
            return False
        else:
            return True

    def generate_password(self) -> str:
        return pwd.genword(length=10, charset="ascii_50")

    def generate_random_password(self, length: int = 10) -> str:
        alphabet = string.ascii_letters + string.digits
        return "".join(secrets.choice(alphabet) for _ in range(length))

    def send_reset_password_mail(self, user: UserResponse, new_password: str):
        email = (
            user.email
            if user.email is not None
            else (
                user.email_supervisor
                if user.email_supervisor is not None
                else user.email_manager if user.email_manager is not None else None
            )
        )
        html = ""
        subject = "Reset Password BPK Apps"
        with open(
            # "/code/email_templates/reset_password.txt",
            # encoding="utf-8",
            "email_templates/reset_password.txt",
            encoding="utf-8",
        ) as f:
            for line in f:
                html += line.strip() + "\r\n"
        html = html.replace(
            "{requester_name}", user.first_primary + " " + user.last_primary[0] + "."
        )
        html = html.replace("{temporary_password}", new_password)
        lang = user.language[0] if user.language is not None else "en"
        app_url = f"{FRONTEND_BASE_URL}/{lang}/login"
        html = html.replace("https://www.mock_up_address.com", app_url)
        try:
            t = threading.Thread(target=send_mail, args=(email, subject, html))
            t.start()
        except Exception as e:
            logger.error(f"Error when sending reset password email: {e}")

    def send_request_to_reset_password_mail(self, user: UserResponse, key: str):
        email = user.email
        html = ""
        subject = "[Please confirm] Request to Reset Password BPK Apps"
        with open(
            # "/code/email_templates/request_reset_password.txt",
            # encoding="utf-8",
            "email_templates/request_reset_password.txt",
            encoding="utf-8",
        ) as f:
            for line in f:
                html += line.strip() + "\r\n"
        html = html.replace(
            "{requester_name}", user.first_primary + " " + user.last_primary[0] + "."
        )
        request_url = f"{BACKEND_BASE_URL}/api/users/reset_password?user_uuid={user.user_uuid}&key={key}"
        request_url_reduce = f"{BACKEND_BASE_URL}"
        html = html.replace("https://www.mock_up_address.com", request_url)
        html = html.replace(
            "https://www.mock_up_address_reduce.com", request_url_reduce
        )
        try:
            t = threading.Thread(target=send_mail, args=(email, subject, html))
            t.start()
        except Exception as e:
            logger.error(f"Error when sending request reset password email: {e}")
