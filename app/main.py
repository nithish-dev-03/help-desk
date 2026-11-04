from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from app.core.config import APP_NAME
from app.api.v1.router import router
from app.db.postgres import engine
from app.db.base import Base

from app.models.tickets import Ticket
from app.models.users import User
from app.models.comments import Comment

from app.core.exceptions import HelpDeskExceptions
from app.core.exception_handler import app_exception_handler, validation_exception_handler, integrity_error_handler, general_exception_handler

app = FastAPI(docs_url="/", title=APP_NAME)
app.add_exception_handler(HelpDeskExceptions, app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

Base.metadata.create_all(bind=engine)
app.include_router(router)
