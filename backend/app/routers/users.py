from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

import os
import threading
import string
import secrets

from app.schemas.users import (
    UserLogin,
    AllUsersResponse,
    UserDetail,
    PositionResponse,
    UserCreate,
    UserHandle,
    UserPasswordChange,
    UserUpdate,
)
from app.manager import UserManager
from app.functions import api_key_auth
from app.email import send_mail

from dotenv import load_dotenv


load_dotenv()
FRONTEND_BASE_URL = os.environ.get("FRONTEND_BASE_URL")


def generate_random_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


async def _send_reset_password_mail(user, new_password: str, email: str):
    html = ""
    subject = "Reset Password PE-DX Apps"
    with open(
        "/code/email_templates/email_template_5m1e_reset_password.txt",
        encoding="utf-8"
        # "email_templates/email_template_5m1e_reset_password.txt", encoding="utf-8"
    ) as f:
        for line in f:
            html += line.strip()
    html = html.replace(
        "{requester_name}", user["firstname"] + " " + user["lastname"][0] + "."
    )
    html = html.replace("{temporary_password}", new_password)
    overview_url = f"{FRONTEND_BASE_URL}/login"
    html = html.replace("https://www.mock_up_address.com", overview_url)
    try:
        t = threading.Thread(target=send_mail, args=(email, subject, html))
        t.start()
    except Exception as e:
        print(f"Error when sending reset password email: {e}")


def users_routers(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()
    user_manager = UserManager()

    @router.get(
        "/get_all",
        response_model=AllUsersResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_all_users(db: AsyncSession = Depends(db)):
        return AllUsersResponse(users=await user_manager.get_all_users(db=db))

    @router.get(
        "/get_by_user_id",
        response_model=UserDetail,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_user_by_user_id(v: str, db: AsyncSession = Depends(db)):
        user = await user_manager.get_by_user_id(user_id=v, db=db)
        return user

    @router.get(
        "/get_by_email", response_model=UserDetail, dependencies=[Depends(api_key_auth)]
    )
    async def get_user_by_email(v: str, db: AsyncSession = Depends(db)):
        user = await user_manager.get_by_email(email=v, db=db)
        return user

    @router.get(
        "/get_by_user_uuid",
        response_model=UserDetail,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_user_by_email(v: str, db: AsyncSession = Depends(db)):
        user = await user_manager.get_by_user_uuid(user_uuid=v, db=db)
        return user

    @router.get(
        "/get_user_by_line_id",
        response_model=AllUsersResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_user_by_email(v: int, db: AsyncSession = Depends(db)):
        user = await user_manager.get_by_line_id(line_id=v, db=db)
        return AllUsersResponse(users=user)

    @router.get(
        "/get_positions",
        response_model=PositionResponse,
        dependencies=[Depends(api_key_auth)],
    )
    async def get_positions(db: AsyncSession = Depends(db)):
        pos = await user_manager.get_positions(db=db)
        return PositionResponse(positions=pos)

    @router.post(
        "/login", response_model=UserDetail, dependencies=[Depends(api_key_auth)]
    )
    async def login(user: UserLogin, db: AsyncSession = Depends(db)):
        user_data = await user_manager.authenticate(user=user, db=db)

        if user_data is None:
            raise HTTPException(status_code=400, detail="Authenticaltion fail!")

        return user_data

    @router.post("/register", dependencies=[Depends(api_key_auth)])
    async def create_user(user: UserHandle, db: AsyncSession = Depends(db)):
        user_detail = UserCreate(
            user_uuid="",
            created_at="",
            user_id=user.user_id,
            user_pass=user.user_pass,
            firstname=user.firstname,
            lastname=user.lastname,
            email=user.email.lower() if user.email is not None else None,
            supervisor_email=user.supervisor_email.lower()
            if user.supervisor_email is not None
            else None,
            manager_email=user.manager_email.lower()
            if user.manager_email is not None
            else None,
            app_line_id=user.app_line_id,
            position_id=user.position_id,
            section_code=user.section_code,
            concern_line=user.concern_line,
            main_line=user.main_line if user.main_line is not None else None,
            shift=user.shift,
            is_active=user.is_active,
            is_admin=user.is_admin,
        )
        created_user = await user_manager.create_user(user=user_detail, db=db)
        return created_user.user_id

    @router.post("/reset_password", dependencies=[Depends(api_key_auth)])
    async def reset_password(user_id: str, db: AsyncSession = Depends(db)):
        user = await user_manager.get_by_user_id(user_id=user_id, db=db)
        if user is None:
            raise HTTPException(status_code=404, detail="User is not found")
        new_password = generate_random_password()
        email = user.get("email", None)
        if user["email"] is None:
            if user["supervisor_email"] is None:
                email = user["manager_email"]
            else:
                email = user["supervisor_email"]
        await user_manager.change_password(
            user_uuid=user["user_uuid"], new_password=new_password, db=db
        )
        await _send_reset_password_mail(
            user=user, new_password=new_password, email=email
        )

        return f"Send reset password email to {email} successfully"

    @router.post("/change_password", dependencies=[Depends(api_key_auth)])
    async def change_password(data: UserPasswordChange, db: AsyncSession = Depends(db)):
        user = await user_manager.get_by_user_uuid(
            user_uuid=data.user_uuid, safe=False, db=db
        )
        if user is None:
            raise HTTPException(status_code=404, detail="User is not found")

        user_manager.password_manager.verify_password(
            password=data.current_password, hashed_password=user["user_pass"]
        )

        await user_manager.change_password(
            user_uuid=user.get("user_uuid"), new_password=data.new_password, db=db
        )

        return "change password successfully"

    @router.post("/update_user", dependencies=[Depends(api_key_auth)])
    async def update_user(user: UserUpdate, db: AsyncSession = Depends(db)):
        check_user = await user_manager.get_by_user_uuid(
            user_uuid=user.user_uuid, db=db
        )
        if check_user is None:
            raise HTTPException(status_code=404, detail="User is not found")
        update_user = await user_manager.update_user(user=user, db=db)

        return UserDetail(
            user_uuid=update_user["user_uuid"],
            user_id=update_user["user_id"],
            firstname=update_user["firstname"],
            lastname=update_user["lastname"],
            email=update_user["email"].lower()
            if update_user["email"] is not None
            else None,
            supervisor_email=update_user["supervisor_email"].lower()
            if update_user["supervisor_email"] is not None
            else None,
            manager_email=update_user["manager_email"].lower()
            if update_user["manager_email"] is not None
            else None,
            position_id=update_user["position_id"],
            section_code=update_user["section_code"],
            concern_line=update_user["concern_line"],
            main_line=update_user["main_line"]
            if update_user["main_line"] is not None
            else 0,
            shift=update_user["shift"],
            created_at=update_user["created_at"],
            updated_at=update_user["updated_at"],
            is_active=True,
            is_admin=update_user["is_admin"],
            access_token="",
            refresh_token="",
        )

    return router
