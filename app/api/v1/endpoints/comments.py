from fastapi import APIRouter, Depends
from app.schemas.comments import CommentCreate
from app.db.postgres import get_db
from app.api.v1.dependencies import get_current_user
from app.models.users import User

from app.repositories.comment_repository import CommentRepository
from app.services.comment_services import CommentService

comment_router = APIRouter(prefix="/tickets/{ticket_id}/comments", tags=["Comments"])

@comment_router.get("/health")
def comment_health_check():
    return{
        "status":True,
        "message":f"{__name__} is running successfully"
    }

@comment_router.put("/")
def create_comment(ticket_id:int,content:CommentCreate,db=Depends(get_db),user_data:User=Depends(get_current_user)):
    repo = CommentRepository(db)
    service = CommentService(repo)
    comment = service.create_comment(content,ticket_id,user_data.id,user_data.role)

    return{
        "status":True,
        "message":"Comment successfully created",
        "item":comment
    }

@comment_router.get("/")
def get_comment(ticket_id:int,db=Depends(get_db),user_data:User=Depends(get_current_user)):
    repo = CommentRepository(db)
    service = CommentService(repo)
    user_id = user_data.id if user_data.role == "user" else None
    comments = service.get_comments_by_ticket(ticket_id,user_id)
    return {
        "status":True,
        "items":comments
    }