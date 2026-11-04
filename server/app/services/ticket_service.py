from app.repositories.ticket_repository import TicketRepository
from app.schemas.tickets import TicketCreate, TicketUpdate
from app.core.exceptions import TicketNotFound

class TicketService:
    def __init__(self, repo: TicketRepository):
        self.repo = repo

    def create_ticket(self, data: TicketCreate, user_id:int):
        return self.repo.create(data,user_id)

    def get_all_ticket(self, user_id: int | None = None):
        return self.repo.get_all_ticket(user_id)

    def get_ticket(self, id: int, user_id: int | None = None):
        ticket = self.repo.get_ticket(id, user_id)
        if ticket is None:
            raise TicketNotFound()
        return ticket

    def update_ticket(self, id: int, data: TicketUpdate):
        ticket = self.repo.update_by_id(id, data)
        if ticket is None:
            raise TicketNotFound()
        return ticket

    def delete_ticket(self, id:int):
        ticket = self.repo.delete_ticket(id)
        if ticket is None:
            raise TicketNotFound()
        return ticket

    def update_status(self, id: int, status: str):
        ticket = self.repo.update_status_by_id(id, status)
        if ticket is None:
            raise TicketNotFound()
        return ticket
