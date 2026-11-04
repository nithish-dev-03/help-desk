from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

async def app_exception_handler(request:Request,exc):
    return JSONResponse(status_code=exc.status_code,content={
            "status": False,
            "error": {
                "code": exc.code,
                "message": exc.detail,
            },
        },)

async def validation_exception_handler(request:Request,exc:RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "status": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request data",
                "fields": exc.errors(),
            },
        },
    )

async def integrity_error_handler(request:Request,exc:IntegrityError):
    return JSONResponse(
        status_code=409,
        content={
            "status": False,
            "error": {
                "code": "DATABASE_CONFLICT",
                "message": "The request conflicts with existing data",
            },
        },
    )

async def general_exception_handler(request:Request,exc:Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred",
            },
        },
    )
