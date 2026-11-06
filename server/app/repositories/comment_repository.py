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

    def get_comments_by_ticket(self, ticket_id: int, user_id: int | None):
        query = self.db.query(Comment).filter(Comment.ticket_id == ticket_id)

        # if user_id is not None:
        #     query = query.join(Ticket, Ticket.id == Comment.ticket_id).filter(
        #         (Ticket.created_by == user_id) | (Ticket.assigned_to == user_id)
        #     )

        return query.order_by(Comment.created_at.asc()).all()

    def get_ticket_owner(self,ticket_id:int)->int:
        ticket = self.db.query(Ticket).filter(Ticket.id == ticket_id).first()
        return ticket.created_by if ticket else None
