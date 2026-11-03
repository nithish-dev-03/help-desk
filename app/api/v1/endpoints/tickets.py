from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.schemas.tickets import TicketCreate, TicketUpdate, TicketStatusUpdate
from app.repositories.ticket_repository import TicketRepository
from app.services.ticket_service import TicketService
from app.api.v1.dependencies import role_based_access, get_current_user
from app.models.users import User

ticket_router = APIRouter(prefix="/tickets", tags=["Tickets"])

@ticket_router.get("/health-check")
def ticket_health():
    return {"status": True, "message": "tickets service is running successfully"}

@ticket_router.post("/")
def create_ticket(data: TicketCreate, db: Session = Depends(get_db),user_data:User = Depends(role_based_access("admin","agent","user"))):
    """
    Create new Ticket
    """
    repo = TicketRepository(db)
    service = TicketService(repo)
    ticket = service.create_ticket(data,user_data.id)

    return {
        "status": True,
        "message": f"{ticket.title} was created successfully",
        "ticket": ticket
    }

@ticket_router.get("/",)
def get_all_ticket(db= Depends(get_db), user_data:User = Depends(role_based_access("admin","agent","user"))):
    """
    To fetch all the Ticket
    """
    repo = TicketRepository(db)
    service = TicketService(repo)
    user_id = user_data.id if user_data.role == "user" else None # I have intentially use ternary op here for admin and agent to get all the tickets
    tickets = service.get_all_ticket(user_id)

    return {
        "status":True,
        "data":tickets
    }

@ticket_router.get("/{id}")
def get_ticket_with_id(id:int,db=Depends(get_db), user_data:User = Depends(role_based_access("admin","agent","user"))):
    """
    Fetch the ticket details based on the ticket id
    """
    repo = TicketRepository(db)
    service = TicketService(repo)
    user_id = user_data.id if user_data.role == "user" else None
    ticket = service.get_ticket(id, user_id)

    if ticket:
        return{
            "status":True,
            "data":ticket
        }
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Ticket not found")

@ticket_router.put("/{id}/")
def update_ticket(
    id: int,
    data: TicketUpdate,
    db: Session = Depends(get_db),
    user_data: User = Depends(role_based_access("admin")),
):
    """
    Create new Ticket
    """
    repo = TicketRepository(db)
    service = TicketService(repo)
    ticket = service.update_ticket(id,data)

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    return {
        "status": True,
        "message": f"{ticket.title} was updated successfully",
        "ticket": ticket
    }

@ticket_router.delete("/{id}/")
def remove_ticket(id:int,db=Depends(get_db), user_data:User = Depends(role_based_access("admin"))):
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

@ticket_router.patch("/{id}/status")
def update_ticket_status(
    id: int,
    data: TicketStatusUpdate,
    db: Session = Depends(get_db),
    user_data: User = Depends(role_based_access("admin", "agent")),
):
    repo = TicketRepository(db)
    service = TicketService(repo)

    ticket = service.update_status(id, data.status.value)

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found",
        )

    return {
        "status": True,
        "data": ticket,
        "message": f"Ticket status updated to {ticket.status}",
    }
