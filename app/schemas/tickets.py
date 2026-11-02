from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class TicketPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TicketStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    PENDING = "pending"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketCreate(BaseModel):
    title: str = Field(min_length=3,max_length=200)
    description: str = Field(min_length=3,)
    priority: TicketPriority = TicketPriority.MEDIUM
    category: str = Field(min_length=2,max_length=100)

class TicketUpdate(BaseModel):
    title: str = Field(min_length=3,max_length=200)
    description: str = Field(min_length=3)
    priority: TicketPriority
    category: str = Field(min_length=2,max_length=100)


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    priority: TicketPriority
    category: str
    status: TicketStatus
    created_by: int
    assigned_to: int | None
    created_at: datetime
    updated_at: datetime


class TicketStatusUpdate(BaseModel):
    status: TicketStatus


class TicketListResponse(BaseModel):
    items: list[TicketResponse]
    total: int
    page: int
    limit: int