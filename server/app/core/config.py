import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = os.getenv("APP_NAME")
DB_URL = os.getenv("DB_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
TIME_LIMIT = int(os.getenv("EXP_DURATION","60"))
SESSION_KEY = os.getenv("SESSION_KEY")
# Cross-origin production deployments (Vercel -> Render) require Secure + None.
# Local development overrides these in server/.env.
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "true").lower() == "true"
SESSION_COOKIE_SAMESITE = os.getenv("SESSION_COOKIE_SAMESITE", "none")

PUBLIC_ROUTES = ["/auth/login","/auth/register","/auth/forget","/tickets/health-check","/comments/health"]

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
RATE_LIMIT_FAIL_OPEN = os.getenv("RATE_LIMIT_FAIL_OPEN", "false").lower() == "true"
TRUST_PROXY = os.getenv("TRUST_PROXY", "false").lower() == "true"
