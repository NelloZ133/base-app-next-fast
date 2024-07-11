from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator, List

from app.functions import api_key_auth
from app.manager import UsersManager
from app.schemas.users import (
    UserCredential,
    UserRegister,
    UserRequest,
    UserUpdateRequest,
    UserPassRequest,
    UserResponse,
    UsersResponse,
)


def users_routers(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()
    user_manager = UsersManager()

    @router.get(
        "/users_all", response_model=UsersResponse, dependencies=[Depends(api_key_auth)]
    )
    async def get_users_all(db: AsyncSession = Depends(db)):
        return UsersResponse(users=await user_manager.get_users_all(db=db))

    @router.get(
        "/users_by_user_uuid",
        response_model=UsersResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_users_by_user_uuid(
        user_uuid: List[str] = Query(), db: AsyncSession = Depends(db)
    ):
        return UsersResponse(
            users=await user_manager.get_users_by_user_uuid(user_uuid=user_uuid, db=db)
        )

    @router.get(
        "/users_by_username",
        response_model=UsersResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_users_by_username(
        username: List[str] = Query(), db: AsyncSession = Depends(db)
    ):
        return UsersResponse(
            users=await user_manager.get_users_by_username(username=username, db=db)
        )

    @router.get(
        "/user_by_user_uuid",
        response_model=UserResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_user_by_user_uuid(user_uuid: str, db: AsyncSession = Depends(db)):
        return await user_manager.get_user_by_user_uuid(user_uuid=user_uuid, db=db)

    @router.get(
        "/user_by_username",
        response_model=UserResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_user_by_username(username: str, db: AsyncSession = Depends(db)):
        return await user_manager.get_user_by_username(username=username, db=db)

    @router.get(
        "/user_by_email",
        response_model=UserResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_user_by_email(email: str, db: AsyncSession = Depends(db)):
        return await user_manager.get_user_by_email(email=email, db=db)

    @router.post(
        "/login", response_model=UserResponse, dependencies=[Depends(api_key_auth)]
    )
    async def login(user: UserRequest, db: AsyncSession = Depends(db)):
        return await user_manager.authenticate(user=user, db=db)

    @router.post("/register", dependencies=[Depends(api_key_auth)])
    async def register(user: UserRegister, db: AsyncSession = Depends(db)):
        username = await user_manager.register(user=user, db=db)
        return f"User {username} registered successfully"

    @router.post(
        "/update_user",
        response_model=UserResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def post_update_user(user: UserUpdateRequest, db: AsyncSession = Depends(db)):
        return await user_manager.post_update_user(user=user, db=db)

    @router.post("/change_password", dependencies=[Depends(api_key_auth)])
    async def post_change_password(
        user: UserPassRequest, db: AsyncSession = Depends(db)
    ):
        await user_manager.post_change_password(user=user, db=db)
        return "Change password successfully"

    @router.post("/change_to_new_password", dependencies=[Depends(api_key_auth)])
    async def post_change_to_new_password(
        user: UserPassRequest, db: AsyncSession = Depends(db)
    ):
        await user_manager.post_change_to_new_password(user=user, db=db)
        return "Change to new password successfully"

    @router.get(
        "/reset_password",  # dependencies=[Depends(api_key_auth)]
    )
    async def get_reset_password(
        user_uuid: str, key: str | None = None, db: AsyncSession = Depends(db)
    ):
        email = await user_manager.get_reset_password(
            user_uuid=user_uuid, key=key, db=db
        )
        return f"Send reset password to {email} successfully"

    @router.post("/reset_password", dependencies=[Depends(api_key_auth)])
    async def post_reset_password(body: UserCredential, db: AsyncSession = Depends(db)):
        email = await user_manager.post_reset_password(
            credential=body.credential, db=db
        )
        return f"Send reset password to {email} successfully"

    @router.post("/reset_password_to_default", dependencies=[Depends(api_key_auth)])
    async def post_reset_password_to_default(
        body: UserCredential, db: AsyncSession = Depends(db)
    ):
        await user_manager.post_reset_password_to_default(
            username=body.credential, db=db
        )

    return router
