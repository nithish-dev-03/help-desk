from app.repositories.ticket_repository import TicketRepository
from app.schemas.tickets import TicketCreate


class TicketService:
    def __init__(self, repo: TicketRepository):
        self.repo = repo

    def create_ticket(self, data: TicketCreate):
        return self.repo.create(data)

    def get_all_ticket(self):
        return self.repo.get_all_ticket()

    def get_ticket(self,id:int):
        return self.repo.get_ticket(id)

    def update_ticket(self, id: int, data: TicketCreate):
        return self.repo.update_by_id(id,data)