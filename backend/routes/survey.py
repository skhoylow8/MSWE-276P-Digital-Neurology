from fastapi import APIRouter, Request, Body, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.survey import Survey

survey_router = APIRouter()


@survey_router.post("/", response_description="Add new survey")
async def create_survey(request: Request, survey: Survey = Body(...)):
    survey = jsonable_encoder(survey)
    new_survey = await request.app.mongodb["Survey"].insert_one(survey)
    created_survey = await request.app.mongodb["Survey"].find_one({"_id": new_survey.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_survey)


@survey_router.get("/", response_description="Get all survey")
async def get_survey(request: Request):
    # implement this later
    return JSONResponse(content={"hi":"Neha"})
