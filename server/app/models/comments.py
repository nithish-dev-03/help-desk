from sqlalchemy import DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id"),nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"),nullable=False)
    content: Mapped[str] = mapped_column(Text,nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),nullable=False,server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    ticket = relationship("Ticket",backref="comments")
    author = relationship("User",backref="comments")