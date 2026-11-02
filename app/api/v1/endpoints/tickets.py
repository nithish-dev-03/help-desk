from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.schemas.tickets import TicketCreate
from app.repositories.ticket_repository import TicketRepository
from app.services.ticket_service import TicketService

ticket_router = APIRouter(prefix="/tickets", tags=["Tickets"])

@ticket_router.get("/health-check")
def ticket_health():
    return {"status": True, "message": "tickets service is running successfully"}


@ticket_router.post("/")
def create_ticket(data: TicketCreate, db: Session = Depends(get_db)):
    """
    Create new Ticket
    """
    repo = TicketRepository(db)
    service = TicketService(repo)
    ticket = service.create_ticket(data)
    return {
        "status": True,
        "message": f"{ticket.title} was created successfully",
        "ticket": ticket
    }

@ticket_router.get("/")
def get_all_ticket(db= Depends(get_db)):
    """
    To fetch all the Ticket
    """
    repo = TicketRepository(db)
    service = TicketService(repo)
    tickets = service.get_all_ticket()

    return {
        "status":True,
        "data":tickets
    }

@ticket_router.get("/{id}")
def get_ticket_with_id(id:int,db=Depends(get_db)):
    """
    Fetch the ticket details based on the ticket id
    """
    repo = TicketRepository(db)
    service = TicketService(repo)
    ticket = service.get_ticket(id)

    if ticket:
        return{
            "status":True,
            "data":ticket
        }
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Ticket not found")

@ticket_router.put("/{id}/")
def update_ticket(id:int, data: TicketCreate, db: Session = Depends(get_db)):
    """
    Create new Ticket
    """
    repo = TicketRepository(db)
    service = TicketService(repo)
    ticket = service.update_ticket(id,data)
    return {
        "status": True,
        "message": f"{ticket.title} was created successfully",
        "ticket": ticket
    }
@ticket_router.delete("/{id}/")
def remove_ticket(id:int,db=Depends(get_db)):
    repo = TicketRepository(db)
    service = TicketService(repo)
    pop_data = service.delete_ticket(id)
    if pop_data:
        return {
            "status":True,
            "message":f"{pop_data.title} deleted successfully"
        }
    else:
        return{
            "status":False,
            "message":"Invalid ticket id"
        }
