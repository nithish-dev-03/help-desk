from fastapi import APIRouter, Depends
from app.api.v1.endpoints.tickets import ticket_router
from app.api.v1.endpoints.user import user_router
from app.api.v1.endpoints.comments import comment_router
from app.api.v1.dependencies import get_current_user

router = APIRouter()

router.include_router(ticket_router,dependencies=[Depends(get_current_user)])
router.include_router(user_router,dependencies=[Depends(get_current_user)])
router.include_router(comment_router,dependencies=[Depends(get_current_user)])