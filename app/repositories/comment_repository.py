from sqlalchemy.orm import Session
from app.schemas.comments import CommentCreate, CommentResponse
from app.models.comments import Comment
from app.models.tickets import Ticket

class CommentRepository:
    def __init__(self,db:Session):
        self.db = db

    def create_comment(self,payload: CommentCreate,ticket_id: int,user_id: int):
        comment = Comment(
            ticket_id=ticket_id,
            user_id=user_id,
            content=payload.content)

        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)

        return comment

    def get_comments_by_ticket(self,ticket_id: int,user_id:int|None) ->CommentResponse :
        if not user_id:
            return self.db.query(Comment).filter(Comment.ticket_id == ticket_id).all()
        else:
            return self.db.query(Comment).filter(Comment.ticket_id == ticket_id,Comment.user_id ==user_id ).all()

    def get_ticket_owner(self,ticket_id:int)->int:
        return self.db.query(Ticket).filter(Ticket.id == ticket_id).first().created_by