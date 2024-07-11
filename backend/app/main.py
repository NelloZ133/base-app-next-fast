import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.dependencies import get_common_pg_async_db, get_app_pg_async_db
from app.routers import users_routers, settings_routers
from app.utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_routers(get_common_pg_async_db), prefix="/api/users")
app.include_router(settings_routers(get_app_pg_async_db), prefix="/api/settings")
# app.include_router(app_search_routers(get_app_pg_async_db), prefix="/api/search")
# app.include_router(app_routers(get_app_pg_async_db), prefix="/api/app")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
