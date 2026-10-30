from sqlalchemy.orm import Session
from app.models.tickets import Ticket
from app.schemas.tickets import TicketCreate

class TicketRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, payload):
        ticket = Ticket(
            title=payload.title,
            description=payload.description,
            priority=payload.priority,
            category=payload.category,
        )
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        return ticket

    def get_all_ticket(self):
        return self.db.query(Ticket).all()

    def get_ticket(self,id:int):
        return self.db.get(Ticket,id)

    def update_by_id(self, id: int, val: TicketCreate):
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

