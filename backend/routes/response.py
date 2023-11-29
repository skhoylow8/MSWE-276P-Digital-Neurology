from fastapi import APIRouter, Request, status, Body
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.response import AssessmentResponse

response_router = APIRouter()


@response_router.post("/", response_description="Add new assessment response")
async def create_response(request: Request, response: AssessmentResponse = Body(...)):
    assessment_response = jsonable_encoder(response)
    new_assessment_response = await request.app.mongodb["AssessmentResponse"].insert_one(assessment_response)
    created_assessment_response = await request.app.mongodb["AssessmentResponse"].find_one({"_id": new_assessment_response.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_assessment_response)

