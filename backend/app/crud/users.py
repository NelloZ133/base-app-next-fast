from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.schemas.users import UserPassRequest, UserRegister, UserUpdateRequest


class UsersCRUD:
    def __init__(self):
        pass

    async def get_users(
        self,
        db: AsyncSession,
        where_stmt: str | None = None,
    ):
        stmt = f"SELECT * FROM users WHERE end_effective IS NULL {where_stmt if where_stmt is not None else ''}"
        rs = await db.execute(text(stmt))
        return rs

    async def get_positions(self, db: AsyncSession, where_stmt: str | None = None):
        stmt = f"SELECT * FROM position WHERE end_effective IS NULL {where_stmt if where_stmt is not None else ''}"
        rs = await db.execute(text(stmt))
        return rs

    async def validate_register(self, db: AsyncSession, where_stmt: str | None = None):
        stmt = f"""SELECT * FROM users {where_stmt} LIMIT 1"""
        rs = await db.execute(text(stmt))
        return rs.fetchone()

    async def register(self, user: UserRegister, db: AsyncSession):
        stmt = f"""INSERT INTO users (user_uuid, username, password, language, 
                first_primary, middle_primary, last_primary, first_secondary, 
                middle_secondary, last_secondary, first_tertiary, middle_tertiary, 
                last_tertiary, employee_no, shift_name, line_id, line_id_group, 
                tel_no_primary, tel_no_secondary, email, email_supervisor, 
                email_manager, is_admin)
                VALUES ({user["user_uuid"]},{user["username"]},{user["password"]},
                {user["language"]},{user["first_primary"]},{user["middle_primary"]},
                {user["last_primary"]},{user["first_secondary"]},{user["middle_secondary"]},
                {user["last_secondary"]},{user["first_tertiary"]},{user["middle_tertiary"]},
                {user["last_tertiary"]},{user["employee_no"]},{user["shift_name"]},
                {user["line_id"]},{user["line_id_group"]},{user["tel_no_primary"]},
                {user["tel_no_secondary"]},{user["email"]},{user["email_supervisor"]},
                {user["email_manager"]},{user["is_admin"]})
                """
        await db.execute(text(stmt))
        await db.commit()
        return

    async def post_update_user(self, user: UserUpdateRequest, db: AsyncSession):
        stmt = f"""UPDATE users
                    SET username = {user["username"]},
                    language = {user["language"]},
                    first_primary = {user["first_primary"]},
                    middle_primary = {user["middle_primary"]},
                    last_primary = {user["last_primary"]},
                    first_secondary = {user["first_secondary"]},
                    middle_secondary = {user["middle_secondary"]},
                    last_secondary = {user["last_secondary"]},
                    first_tertiary = {user["first_tertiary"]},
                    middle_tertiary = {user["middle_tertiary"]},
                    last_tertiary = {user["last_tertiary"]},
                    employee_no = {user["employee_no"]},
                    shift_name = {user["shift_name"]},
                    line_id = {user["line_id"]},
                    line_id_group = {user["line_id_group"]},
                    tel_no_primary = {user["tel_no_primary"]},
                    tel_no_secondary = {user["tel_no_secondary"]},
                    email = {user["email"]},
                    email_supervisor = {user["email_supervisor"]},
                    email_manager = {user["email_manager"]}
                WHERE user_uuid::TEXT = {user["user_uuid"]}
                RETURNING *"""
        rs = await db.execute(text(stmt))
        await db.commit()
        return rs

    async def post_update_password(self, user: UserPassRequest, db: AsyncSession):
        stmt = f"""UPDATE users
                SET password = '{user.new_pass}'
                WHERE user_uuid::TEXT = '{user.user_uuid}'"""
        await db.execute(text(stmt))
        await db.commit()
        return

    async def post_default_password(
        self, username: str, password: str, db: AsyncSession
    ):
        stmt = f"""UPDATE users
                SET password = '{password}'
                WHERE username = '{username}'"""
        await db.execute(text(stmt))
        await db.commit()
        return
