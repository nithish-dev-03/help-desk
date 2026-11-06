from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from app.core.config import APP_NAME
from app.core.redis import close_redis, initialize_redis
from app.core.config import RATE_LIMIT_FAIL_OPEN
from app.api.v1.router import router
from fastapi.middleware.cors import CORSMiddleware


from app.core.exceptions import HelpDeskExceptions
from app.core.exception_handler import app_exception_handler, validation_exception_handler, integrity_error_handler, general_exception_handler

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await initialize_redis()
    except Exception:
        if not RATE_LIMIT_FAIL_OPEN:
            raise

    try:
        yield
    finally:
        await close_redis()


app = FastAPI(docs_url="/", title=APP_NAME, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://help-desk-7i72.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_exception_handler(HelpDeskExceptions, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Base.metadata.create_all(bind=engine)
app.include_router(router)
