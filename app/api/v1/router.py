from fastapi import APIRouter
from app.api.v1.endpoints.tickets import ticket_router
from app.api.v1.endpoints.user import user_router

router = APIRouter()

router.include_router(ticket_router)
router.include_router(user_router)