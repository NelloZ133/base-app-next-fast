from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.schemas.users import UserCreate, UserUpdate
from app import exceptions


class UsersCRUD:
    def __init__(self, db: AsyncSession = None):
        pass

    async def get_all_users(self, db: AsyncSession = None):
        stmt = "SELECT * FROM users LEFT JOIN positions using (position_id) WHERE is_active = TRUE"
        rs = await db.execute(text(stmt))
        return rs

    async def get_user_by_user_id(self, user_id: str, db: AsyncSession = None) -> list:
        stmt = f"""
        SELECT *
        FROM users
        LEFT JOIN positions using (position_id)
        WHERE users.user_id = '{user_id}'
            AND is_active = TRUE
        """
        rs = await db.execute(text(stmt))
        return rs

    async def get_user_by_user_uuid(
        self, user_uuid: str, db: AsyncSession = None
    ) -> list:
        stmt = f"""
        SELECT *
        FROM users
        LEFT JOIN positions using (position_id)
        WHERE users.user_uuid = '{user_uuid}'
            AND is_active = TRUE
        """
        rs = await db.execute(text(stmt))
        return rs

    async def get_user_by_line_id(self, line_id: int, db: AsyncSession = None) -> list:
        stmt = f"""
        SELECT *
        FROM users
        LEFT JOIN positions using (position_id)
        WHERE '{line_id}' = ANY(concern_line)
            AND is_active = TRUE
        """
        rs = await db.execute(text(stmt))
        return rs

    async def get_user_by_email(self, email: str, db: AsyncSession = None) -> list:
        stmt = f"""
        SELECT * FROM users
        LEFT JOIN positions using (position_id)
        WHERE email = '{email}'
            AND is_active = TRUE
        LIMIT 1
        """
        rs = await db.execute(text(stmt))
        return rs

    async def get_positions(self, db: AsyncSession) -> list:
        stmt = "SELECT * FROM positions"
        rs = await db.execute(text(stmt))
        return rs

    async def validate_create_user(self, user: UserCreate, db: AsyncSession) -> None:
        stmt = f"""
        SELECT user_id, email FROM users
        WHERE user_id = '{user.user_id}' 
            OR email = '{user.email}'
        """
        rs = await db.execute(text(stmt))
        for r in rs:
            if r["user_id"] == user.user_id:
                raise exceptions.UserAlreadyExists()
            if r["email"] == user.email:
                raise exceptions.EmailAlreadyUsed()

    async def create_user(self, user: UserCreate, db: AsyncSession):
        user.email = "null" if user.email is None else f"'{user.email}'"
        user.supervisor_email = (
            "null" if user.supervisor_email is None else f"'{user.supervisor_email}'"
        )
        user.manager_email = (
            "null" if user.manager_email is None else f"'{user.manager_email}'"
        )
        if user.main_line is None:
            user.main_line = "null"

        stmt = f"""INSERT INTO users (user_uuid, user_id, user_pass, firstname, lastname, 
            email, app_line_id, position_id, section_code, concern_line, created_at, is_active, is_admin,
            supervisor_email, manager_email, main_line, shift)
            VALUES ('{user.user_uuid}', '{user.user_id}', '{user.user_pass}', '{user.firstname}', '{user.lastname}', 
            {user.email}, '{user.app_line_id}', '{user.position_id}', '{user.section_code}', ARRAY {user.concern_line}, 
            '{user.created_at}', '{user.is_active}', '{user.is_admin}', {user.supervisor_email}, {user.manager_email}, 
            {user.main_line}, '{user.shift}')"""
        await db.execute(text(stmt))
        await db.commit()
        return user

    async def update_user(self, user: UserUpdate, db: AsyncSession):
        user.email = "null" if user.email is None else f"'{user.email}'"
        user.supervisor_email = (
            "null" if user.supervisor_email is None else f"'{user.supervisor_email}'"
        )
        user.manager_email = (
            "null" if user.manager_email is None else f"'{user.manager_email}'"
        )
        if user.main_line is None:
            user.main_line = "null"

        stmt = f"""
        UPDATE users
        SET user_id = '{user.user_id}',
            firstname = '{user.firstname}',
            lastname = '{user.lastname}',
            email = {user.email},
            app_line_id = '{user.app_line_id}',
            position_id = {user.position_id},
            section_code = {user.section_code},
            concern_line = ARRAY{user.concern_line},
            main_line = {user.main_line},
            is_active = {user.is_active},
            is_admin = {user.is_admin},
            supervisor_email = {user.supervisor_email},
            manager_email = {user.manager_email},
            shift = '{user.shift}'
        WHERE user_uuid = '{user.user_uuid}'
        """
        await db.execute(text(stmt))
        await db.commit()
        return user

    async def change_password(self, user_uuid: str, password: str, db: AsyncSession):
        stmt = f"""
        UPDATE users
        SET user_pass = '{password}'
        WHERE user_uuid = '{user_uuid}'
        """
        await db.execute(text(stmt))
        await db.commit()
