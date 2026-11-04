from app.repositories.comment_repository import CommentRepository
from app.schemas.comments import CommentCreate
from app.schemas.users import UserRole
from fastapi import HTTPException,status


class CommentService:
    def __init__(self, repo: CommentRepository):
        self.repo = repo

    def get_ticket_owner(self,ticket_id:int) -> int:
        return self.repo.get_ticket_owner(ticket_id)

    def create_comment(self,payload: CommentCreate,ticket_id: int,user_id: int,user_role:UserRole ):
        if self.get_ticket_owner(ticket_id) == user_id or user_role in ["agent","admin"]:
            return self.repo.create_comment(payload,ticket_id,user_id)
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="You don't have acces to this ticket")

    def get_comments_by_ticket(self, ticket_id: int, user_id:int|None):
        return self.repo.get_comments_by_ticket(ticket_id,user_id)