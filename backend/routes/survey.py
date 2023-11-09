from fastapi import APIRouter, Request, Body, status, HTTPException
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


@survey_router.get("/", response_description="Get all surveys")
async def list_surveys(request: Request):
    surveys = []
    for survey in await request.app.mongodb["Survey"].find().to_list(10):  # would i need to add pagination?
        surveys.append(survey)
    return surveys


@survey_router.get("/{id}", response_description="Get a single survey")
async def get_survey(id: str, request: Request):
    if (survey := await request.app.mongodb["Survey"].find_one({"_id":id})) is not None:
        return survey

    return HTTPException(status_code=404, detail=f"Task {id} not found")


# put, delete => do we need?