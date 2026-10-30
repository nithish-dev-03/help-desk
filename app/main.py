from fastapi import FastAPI
from app.core.config import APP_NAME
from app.api.v1.router import router
from app.db.postgres import Base, engine

app = FastAPI(docs_url="/",title=APP_NAME )
Base.metadata.create_all(bind=engine)

app.include_router(router)

