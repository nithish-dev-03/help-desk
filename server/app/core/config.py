import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = os.getenv("APP_NAME")
DB_URL = os.getenv("DB_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
TIME_LIMIT = int(os.getenv("EXP_DURATION","60"))
SESSION_KEY = os.getenv("SESSION_KEY")

PUBLIC_ROUTES = ["/auth/login","/auth/register","/auth/forget","/tickets/health-check","/comments/health"]