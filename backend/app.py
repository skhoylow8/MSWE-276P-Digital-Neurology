import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from routes.assessment import assessment_router
from routes.auth import auth_router
from routes.survey import survey_router
from routes.participant import participant_router
from settings import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Set this to a list of allowed origins (e.g., ["http://localhost", "https://example.com"])
    allow_credentials=True,  # Set this to True if you want to allow cookies with credentials
    allow_methods=["*"],  # Set this to a list of allowed HTTP methods (e.g., ["GET", "POST"])
    allow_headers=["*"],  # Set this to a list of allowed HTTP headers
)

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(settings.DB_URL)
    app.mongodb = app.mongodb_client[settings.DB_NAME]


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()


app.include_router(survey_router, tags=["surveys"], prefix="/survey")
app.include_router(participant_router, tags=["participant"], prefix="/participant")
app.include_router(auth_router, tags=["auth"], prefix="")
app.include_router(assessment_router, tags=["assessments"], prefix="/assessment")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )