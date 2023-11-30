from fastapi import APIRouter, Request, status, Body
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.response import AssessmentResponse
from utils.response import mongo_docs_to_csv

response_router = APIRouter()


@response_router.post("/", response_description="Add new assessment response")
async def create_response(request: Request, response: AssessmentResponse = Body(...)):
    assessment_response = jsonable_encoder(response)
    new_assessment_response = await request.app.mongodb["AssessmentResponse"].insert_one(assessment_response)
    created_assessment_response = await request.app.mongodb["AssessmentResponse"].find_one({"_id": new_assessment_response.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_assessment_response)


@response_router.get("/download/{id}", response_description="Download a single assessment response")
async def download_response(request: Request, id:str):
    responses = []
    find_criteria = {"assessment_id": id}
    responses_list = await request.app.mongodb["AssessmentResponse"].find(find_criteria).to_list(length=None)
    for response in responses_list:  # would i need to add pagination?
        responses.append(response)
    mongo_docs_to_csv(responses_list)
    return responses