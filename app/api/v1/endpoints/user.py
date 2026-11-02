from fastapi import APIRouter, Depends, Response
from app.schemas.users import UserLogin, UserRegister, UserResponse
from app.core.security import hash_password, verify_password
from app.db.postgres import get_db
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from datetime import datetime, timedelta, timezone
from app.core.config import TIME_LIMIT,SESSION_KEY

user_router = APIRouter(prefix="/auth",tags=["auth"])

@user_router.post("/login")
def login(payload: UserLogin, response: Response, db=Depends(get_db)):
    repo = UserRepository(db)
    service = UserService(repo)
    data = service.repo.login_user(payload)
    if data:
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=TIME_LIMIT)
        response.set_cookie(key=SESSION_KEY,value=data,expires=expires_at,httponly=False)
        
        return{
            "status":True,
            "message":"Logged in Successfully"
        }
    else:
        return{
            "status":False,
            "Message":"Invalid credential"
        }

@user_router.post("/register")
def register(payload:UserRegister,db=Depends(get_db)):
    repo = UserRepository(db)
    service = UserService(repo)
    res_data = service.repo.create_user(payload)

    return {
        "status":True,
        "data": res_data,
        "message":f"Welcome {res_data.name}!"
    }
