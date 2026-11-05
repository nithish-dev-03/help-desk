from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.users import User
from app.models.tickets import Ticket
from app.models.comments import Comment
from app.schemas.users import UserRegister, UserLogin
from app.core.security import hash_password, verify_password
from app.core.security import encode
from app.core.config import SECRET_KEY, ALGORITHM, TIME_LIMIT
from datetime import datetime, timedelta, timezone

class UserRepository:
    def __init__(self,db:Session):
        self.db=db

    def create_user(self,payload:UserRegister):
        user_data = User(
            name = payload.name,
            email = payload.email,
            password_hash = hash_password(payload.password)
        )

        self.db.add(user_data)
        self.db.commit()
        self.db.refresh(user_data)
        return user_data

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def login_user(self, payload: UserLogin):
        db_data =self.db.query(User).filter(User.email == payload.email).first()

        if db_data is None:
            return False

        if not verify_password(payload.password,db_data.password_hash,):
            return False
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=TIME_LIMIT)
        token_data = {
            "sub": str(db_data.id),
            "email": db_data.email,
            "role": db_data.role,
        }
        token_data.update({"exp":expires_at})

        return encode(token_data,SECRET_KEY,ALGORITHM)

    def reset_password(self,payload:UserLogin):
        db_data = self.db.query(User).filter(User.email == payload.email).first()
        if db_data:
            db_data.password_hash = hash_password(payload.password)
            self.db.commit()
            self.db.refresh(db_data)
            return db_data
        else:
            return None

    def delete_user(self,id:int):
        db_data = self.db.get(User,id)
        if not db_data:
            return None

        try:
            owned_ticket_ids = self.db.query(Ticket.id).filter(Ticket.created_by == id).subquery()
            self.db.query(Comment).filter((Comment.user_id == id) |(Comment.ticket_id.in_(owned_ticket_ids))).delete(synchronize_session=False)
            self.db.query(Ticket).filter(Ticket.assigned_to == id,Ticket.created_by != id,).update({Ticket.assigned_to: None}, synchronize_session=False)
            self.db.query(Ticket).filter(Ticket.created_by == id).delete(synchronize_session=False)

            self.db.delete(db_data)
            self.db.commit()
            return db_data
        except SQLAlchemyError:
            self.db.rollback()
            raise
