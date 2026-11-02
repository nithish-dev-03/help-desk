from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

class Ticket(Base):
    __tablename__ = "tickets"
    id: Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
    title: Mapped[str] = mapped_column(String(200),nullable=False)
    description: Mapped[str] = mapped_column(Text,nullable=False)
    priority: Mapped[str] = mapped_column(String(20),nullable=False,default="medium",server_default="medium")
    category: Mapped[str] = mapped_column(String(100),nullable=False)
    status: Mapped[str] = mapped_column(String(20),nullable=False,default="open",server_default="open")
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"),nullable=False)
    assigned_to: Mapped[int | None] = mapped_column(ForeignKey("users.id"),nullable=True)
    created_at: Mapped[datetime] = mapped_column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now()
        )
    updated_at: Mapped[datetime] = mapped_column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now(),
            onupdate=func.now()
        )
    creator: Mapped["User"] = relationship(
        "User",
        foreign_keys=[created_by],
        backref="created_tickets"
    )
    assignee: Mapped["User | None"] = relationship(
        "User",
        foreign_keys=[assigned_to],
        backref="assigned_tickets"
    )
    
