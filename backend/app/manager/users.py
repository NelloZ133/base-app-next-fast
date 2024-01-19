import uuid
from typing import Optional
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from passlib import pwd
from passlib.context import CryptContext
from datetime import datetime

from app import exceptions
from app.crud import UsersCRUD
from app.schemas.users import UserLogin, UserDetail, Position, UserCreate, UserUpdate


class UserManager:
    def __init__(self) -> None:
        self.password_manager = PasswordManager()
        self.crud = UsersCRUD()

    async def get_all_users(self, db: AsyncSession = None):
        res = await self.crud.get_all_users(db=db)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                {
                    "user_uuid": str(r[key_index["user_uuid"]]),
                    "user_id": r[key_index["user_id"]],
                    "firstname": r[key_index["firstname"]],
                    "lastname": r[key_index["lastname"]],
                    "email": r[key_index["email"]],
                    "app_line_id": r[key_index["app_line_id"]],
                    "position_id": r[key_index["position_id"]],
                    "position_name": r[key_index["position_name"]],
                    "position_group": r[key_index["position_group"]],
                    "section_code": r[key_index["section_code"]],
                    "concern_line": r[key_index["concern_line"]],
                    "is_active": r[key_index["is_active"]],
                    "is_admin": r[key_index["is_admin"]],
                    "created_at": r[key_index["created_at"]],
                    "updated_at": r[key_index["updated_at"]],
                    "supervisor_email": r[key_index["supervisor_email"]],
                    "manager_email": r[key_index["manager_email"]],
                    "access_token": "",
                    "refresh_token": "",
                    "token_type": "Bearer",
                }
            )
        return return_list

    async def get_by_user_id(self, user_id: str, safe=True, db: AsyncSession = None):
        res = await self.crud.get_user_by_user_id(user_id=user_id, db=db)
        data = None
        for r in res:
            data = r
            break

        if not data:
            raise HTTPException(status_code=404, detail="User cannot be found")
        else:
            key_index = data._key_to_index
            user = {
                "user_uuid": str(data[key_index["user_uuid"]]),
                "user_id": data[key_index["user_id"]],
                "firstname": data[key_index["firstname"]],
                "lastname": data[key_index["lastname"]],
                "email": data[key_index["email"]],
                "app_line_id": data[key_index["app_line_id"]],
                "position_id": data[key_index["position_id"]],
                "position_name": r[key_index["position_name"]],
                "position_group": r[key_index["position_group"]],
                "section_code": data[key_index["section_code"]],
                "concern_line": data[key_index["concern_line"]],
                "is_active": data[key_index["is_active"]],
                "is_admin": data[key_index["is_admin"]],
                "created_at": data[key_index["created_at"]],
                "updated_at": data[key_index["updated_at"]],
                "supervisor_email": data[key_index["supervisor_email"]],
                "manager_email": data[key_index["manager_email"]],
                "access_token": "",
                "refresh_token": "",
                "token_type": "Bearer",
            }

            if safe:
                return user
            else:
                return user, data[key_index["user_pass"]]

    async def get_positions(self, db: AsyncSession = None):
        res = await self.crud.get_positions(db=db)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                Position(
                    position_id=r[key_index["position_id"]],
                    position_level=r[key_index["position_level"]],
                    position_name=r[key_index["position_name"]],
                    position_full_name=r[key_index["position_full_name"]],
                    position_group=r[key_index["position_group"]],
                )
            )
        return return_list

    async def get_by_user_uuid(self, user_uuid: str, db: AsyncSession = None):
        res = await self.crud.get_user_by_user_uuid(user_uuid=user_uuid, db=db)
        data = None
        for r in res:
            data = r
            break

        if not data:
            raise HTTPException(status_code=404, detail="User cannot be found")
        else:
            key_index = data._key_to_index
            return {
                "user_uuid": str(data[key_index["user_uuid"]]),
                "user_id": data[key_index["user_id"]],
                "firstname": data[key_index["firstname"]],
                "lastname": data[key_index["lastname"]],
                "email": data[key_index["email"]],
                "app_line_id": data[key_index["app_line_id"]],
                "position_id": data[key_index["position_id"]],
                "position_name": r[key_index["position_name"]],
                "position_group": r[key_index["position_group"]],
                "section_code": data[key_index["section_code"]],
                "concern_line": data[key_index["concern_line"]],
                "is_active": data[key_index["is_active"]],
                "is_admin": data[key_index["is_admin"]],
                "created_at": data[key_index["created_at"]],
                "updated_at": data[key_index["updated_at"]],
                "supervisor_email": data[key_index["supervisor_email"]],
                "manager_email": data[key_index["manager_email"]],
                "access_token": "",
                "refresh_token": "",
                "token_type": "Bearer",
            }

    async def get_by_line_id(self, line_id: int, db: AsyncSession = None):
        res = await self.crud.get_user_by_line_id(line_id=line_id, db=db)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                {
                    "user_uuid": str(r[key_index["user_uuid"]]),
                    "user_id": r[key_index["user_id"]],
                    "firstname": r[key_index["firstname"]],
                    "lastname": r[key_index["lastname"]],
                    "email": r[key_index["email"]],
                    "app_line_id": r[key_index["app_line_id"]],
                    "position_id": r[key_index["position_id"]],
                    "position_name": r[key_index["position_name"]],
                    "position_group": r[key_index["position_group"]],
                    "section_code": r[key_index["section_code"]],
                    "concern_line": r[key_index["concern_line"]],
                    "is_active": r[key_index["is_active"]],
                    "is_admin": r[key_index["is_admin"]],
                    "created_at": r[key_index["created_at"]],
                    "updated_at": r[key_index["updated_at"]],
                    "supervisor_email": r[key_index["supervisor_email"]],
                    "manager_email": r[key_index["manager_email"]],
                    "access_token": "",
                    "refresh_token": "",
                    "token_type": "Bearer",
                }
            )
        if return_list:
            return return_list
        else:
            raise HTTPException(status_code=404, detail="User cannot be found")

    async def get_by_email(self, email: str, db: AsyncSession = None):
        res = await self.crud.get_user_by_email(email=email, db=db)
        data = None
        for r in res:
            data = r
            break

        if not data:
            raise HTTPException(status_code=404, detail="User cannot be found")
        else:
            key_index = data._key_to_index
            return {
                "user_uuid": str(data[key_index["user_uuid"]]),
                "user_id": data[key_index["user_id"]],
                "firstname": data[key_index["firstname"]],
                "lastname": data[key_index["lastname"]],
                "email": data[key_index["email"]],
                "app_line_id": data[key_index["app_line_id"]],
                "position_id": data[key_index["position_id"]],
                "position_name": r[key_index["position_name"]],
                "position_group": r[key_index["position_group"]],
                "section_code": data[key_index["section_code"]],
                "concern_line": data[key_index["concern_line"]],
                "is_active": data[key_index["is_active"]],
                "is_admin": data[key_index["is_admin"]],
                "created_at": data[key_index["created_at"]],
                "updated_at": data[key_index["updated_at"]],
                "supervisor_email": data[key_index["supervisor_email"]],
                "manager_email": data[key_index["manager_email"]],
                "access_token": "",
                "refresh_token": "",
                "token_type": "Bearer",
            }

    async def authenticate(self, user: UserLogin, db: AsyncSession) -> UserDetail:
        user_data, user_pass = await self.get_by_user_id(
            user_id=user.user_id, safe=False, db=db
        )

        ver_res = self.password_manager.verify_password(
            password=user.user_pass, hashed_password=user_pass
        )

        if not ver_res:
            raise HTTPException(status_code=403, detail="Pasword incorrect")
        else:
            return user_data

    async def create_user(self, user: UserCreate, db: AsyncSession):
        try:
            helper = PasswordManager()
            user_detail: UserCreate = user
            await self.crud.validate_create_user(user=user, db=db)
            user_detail.user_pass = helper.hash_password(password=user.user_pass)
            user_detail.user_uuid = helper.generate_uuid(user_id=user.user_id)
            user_detail.created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
            created_user = await self.crud.create_user(user=user_detail, db=db)
        except exceptions.UserAlreadyExists as e:
            raise HTTPException(
                status_code=400, detail="User is already registered"
            ) from e
        except exceptions.EmailAlreadyUsed as e:
            raise HTTPException(status_code=400, detail="Email is already used") from e
        except:
            raise HTTPException(
                status_code=400,
                detail="Has some problem with UserManager.create_user()",
            )
        return created_user

    async def update_user(self, user: UserUpdate, db: AsyncSession):
        try:
            await self.crud.update_user(user=user, db=db)
        except:
            raise HTTPException(
                status_code=400,
                detail="Has some problem with UserManager.update_user()",
            )

        return await self.get_by_user_id(user_id=user.user_id, db=db)

    async def change_password(
        self, user_uuid: str, new_password: str, db: AsyncSession
    ):
        try:
            helper = PasswordManager()
            hashed_password = helper.hash_password(password=new_password)
            await self.crud.change_password(
                user_uuid=user_uuid, password=hashed_password, db=db
            )
        except:
            raise HTTPException(
                status_code=400,
                detail="Has some problem with UserManager.change_password()",
            )
        return new_password


class PasswordManager:
    def __init__(self, context: Optional[CryptContext] = None) -> None:
        if context is None:
            self.context = CryptContext(
                schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12
            )
        else:
            self.context = context

    def generate_uuid(self, user_id: str) -> str:
        return str(uuid.uuid5(uuid.NAMESPACE_X500, user_id))

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
