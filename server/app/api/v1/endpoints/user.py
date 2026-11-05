from fastapi import APIRouter, Depends, Response
from app.schemas.users import UserLogin, UserRegister
from app.db.postgres import get_db
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from datetime import datetime, timedelta, timezone
from app.core.config import TIME_LIMIT,SESSION_KEY
from app.core.rate_limit import rate_limit

user_router = APIRouter(prefix="/auth",tags=["auth"])

@user_router.post("/login", dependencies=[Depends(rate_limit("login", max_requests=5, window_seconds=60))])
def login(payload: UserLogin, response: Response, db=Depends(get_db)):
    repo = UserRepository(db)
    service = UserService(repo)
    data = service.verify_user(payload)
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

@user_router.post("/register", dependencies=[Depends(rate_limit("register", max_requests=10, window_seconds=3600))])
def register(payload:UserRegister,db=Depends(get_db)):
    repo = UserRepository(db)
    service = UserService(repo)
    res_data = service.register_user(payload)

    return {
        "status":True,
        "data": res_data,
        "message":f"Welcome {res_data.name}!"
    }

@user_router.post("/forget", dependencies=[Depends(rate_limit("forget-password", max_requests=5, window_seconds=3600))])
def forget_password(payload:UserLogin,db=Depends(get_db)):
    repo= UserRepository(db)
    service = UserService(repo)
    res = service.reset_pass(payload)
    if res:
        return{
            "status":True,
            "message":"Password reset successfully!"
        }
    else:
        return{
            "status":False,
            "message":"Invalid credential"
        }

@user_router.delete("/{id}")
def delete_user(id:int,db=Depends(get_db)):
    repo = UserRepository(db)
    service = UserService(repo)
    pop_item = service.remove_user(id)
    if pop_item:
        return {
            "status":True,
            "message":f"{pop_item.name} entry have been deleted successfully"
        }
    else:
        return{
            "status":False,
            "message":"Invalid user ID"
        }

@user_router.get("/logout")
def logout(response:Response): 
    response.delete_cookie(SESSION_KEY)
    return {
        "status":True,
        "message":"Logout succesfully"
    }
