import os
import urllib.parse
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from dotenv import load_dotenv

load_dotenv()

PG_USER_APP = os.environ.get("PG_USER_APP")
PG_PASS_APP = urllib.parse.quote_plus(os.environ.get("PG_PASS_APP"))
PG_SERVER_APP = os.environ.get("PG_SERVER_APP")
PG_PORT_APP = os.environ.get("PG_PORT_APP")
PG_DB_APP = os.environ.get("PG_DB_APP")

PG_USER_COMMON = os.environ.get("PG_USER_COMMON")
PG_PASS_COMMON = urllib.parse.quote_plus(os.environ.get("PG_PASS_COMMON"))
PG_SERVER_COMMON = os.environ.get("PG_SERVER_COMMON")
PG_PORT_COMMON = os.environ.get("PG_PORT_COMMON")
PG_DB_COMMON = os.environ.get("PG_DB_COMMON")


PG_ASYNC_SQLALCHEMY_DATABASE_URL_APP = f"postgresql+asyncpg://{PG_USER_APP}:{PG_PASS_APP}@{PG_SERVER_APP}:{PG_PORT_APP}/{PG_DB_APP}"
app_pg_async_engine = create_async_engine(
    PG_ASYNC_SQLALCHEMY_DATABASE_URL_APP, echo=False, poolclass=NullPool
)
app_pg_async_session = sessionmaker(
    app_pg_async_engine, expire_on_commit=False, class_=AsyncSession
)

PG_ASYNC_SQLALCHEMY_DATABASE_URL_COMMON = f"postgresql+asyncpg://{PG_USER_COMMON}:{PG_PASS_COMMON}@{PG_SERVER_COMMON}:{PG_PORT_COMMON}/{PG_DB_COMMON}"
common_pg_async_engine = create_async_engine(
    PG_ASYNC_SQLALCHEMY_DATABASE_URL_COMMON, echo=False, poolclass=NullPool
)
common_pg_async_session = sessionmaker(
    common_pg_async_engine, expire_on_commit=False, class_=AsyncSession
)

Base = declarative_base()
