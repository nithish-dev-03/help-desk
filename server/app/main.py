from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError
from app.core.config import APP_NAME
from app.api.v1.router import router
from fastapi.middleware.cors import CORSMiddleware


from app.core.exceptions import HelpDeskExceptions
from app.core.exception_handler import app_exception_handler, validation_exception_handler, integrity_error_handler, general_exception_handler

app = FastAPI(docs_url="/", title=APP_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
