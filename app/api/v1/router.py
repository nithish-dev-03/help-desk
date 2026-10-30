from fastapi import APIRouter
from app.api.v1.endpoints.tickets import ticket_router

router = APIRouter()

router.include_router(ticket_router)