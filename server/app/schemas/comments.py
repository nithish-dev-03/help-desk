from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

class CommentCreate(BaseModel):
    content: str = Field(min_length=1,max_length=2000)

class CommentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: int
    user_id: int
    content: str
    created_at: datetime
    updated_at: datetime
