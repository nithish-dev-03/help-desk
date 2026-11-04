from sqlalchemy.orm import Session
from app.models.tickets import Ticket
from app.schemas.tickets import TicketCreate, TicketUpdate

class TicketRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, payload:TicketCreate,user_id:int):
        ticket = Ticket(
            title=payload.title,
            description=payload.description,
            priority=payload.priority,
            category=payload.category,
            created_by=user_id
        )
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def get_all_ticket(self, user_id: int | None = None):
        query = self.db.query(Ticket)

        if user_id is not None:
            query = query.filter(Ticket.created_by == user_id)

        return query.all()

    def get_ticket(self, id: int, user_id: int | None = None):
        query = self.db.query(Ticket).filter(Ticket.id == id)

        if user_id is not None:
            query = query.filter(Ticket.created_by == user_id)

        return query.first()

    def update_by_id(self, id: int, val: TicketUpdate):
            data = self.db.query(Ticket).filter(Ticket.id == id).first()
            if data is None:
                return None

            data.title = val.title
            data.description = val.description
            data.priority = val.priority
            data.category = val.category

            self.db.commit()
            self.db.refresh(data)
            return data

    def delete_ticket(self,id:int):
         db_data = self.db.query(Ticket).filter(Ticket.id == id).first()
         if not db_data:
              return None
         self.db.delete(db_data)
         self.db.commit()
         return db_data

    def update_status_by_id(self, id: int, status: str) -> Ticket | None:
         db_data = self.db.query(Ticket).filter(Ticket.id == id).first()
         if not db_data:
              return db_data
         db_data.status = status
         self.db.commit()
         self.db.refresh(db_data)
         return db_data

