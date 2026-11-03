from app.repositories.ticket_repository import TicketRepository
from app.schemas.tickets import TicketCreate, TicketUpdate

class TicketService:
    def __init__(self, repo: TicketRepository):
        self.repo = repo

    def create_ticket(self, data: TicketCreate, user_id:int):
        return self.repo.create(data,user_id)

    def get_all_ticket(self, user_id: int | None = None):
        return self.repo.get_all_ticket(user_id)

    def get_ticket(self, id: int, user_id: int | None = None):
        return self.repo.get_ticket(id,user_id)

    def update_ticket(self, id: int, data: TicketUpdate):
        return self.repo.update_by_id(id,data)

    def delete_ticket(self, id:int):
        return self.repo.delete_ticket(id)

    def update_status(self, id: int, status: str):
        return self.repo.update_status_by_id(id,status)
