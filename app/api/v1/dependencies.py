from fastapi import Cookie, Depends, Request, HTTPException, status
from app.core.config import SESSION_KEY, PUBLIC_ROUTES, SECRET_KEY, ALGORITHM
from app.db.postgres import get_db
from app.core.security import decode
from app.models.users import User

def get_current_user(request: Request,token: str | None = Cookie(default=None, alias=SESSION_KEY),db=Depends(get_db)):
    if request.url.path in PUBLIC_ROUTES:
        return None

    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Authentication required")

    try:
        data = decode(token, SECRET_KEY, ALGORITHM)
        user_id = data.get("sub")

        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid token")

        user_data = db.get(User, user_id)

        if not user_data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="User not found")

        if not user_data.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Account is inactive")

        return user_data

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid or expired token")


def role_based_access(*allowed_roles: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user is None or current_user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="You do not have permission to perform this action")

        return current_user
    return role_checker
