from app.repositories.user_repository import UserRepository
from app.schemas.users import UserRegister, UserLogin

class UserService:
    def __init__(self, repo:UserRepository):
        self.repo = repo

    def register_user(self,payload:UserRegister):
        return self.repo.create_user(payload)

    def verify_user(self,payload:UserLogin) -> bool:
        return self.repo.login_user(payload)

    def reset_pass(self,payload:UserLogin):
        return self.repo.reset_password(payload)

    def remove_user(self,payload:int):
        return self.repo.delete_user(payload)