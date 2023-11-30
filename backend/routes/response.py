from fastapi import APIRouter, Request, status, Body
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.response import AssessmentResponse, AssessmentResponseDTO
from utils.response import create_csv_file

response_router = APIRouter()


@response_router.post("/", response_description="Add new assessment response")
async def create_response(request: Request, response: AssessmentResponseDTO = Body(...)):
    response = response.model_dump()
    survey_id_set = set()
    for item in response['data']:
        survey_id_set.add(item['survey_id'])

    survey_question_dict = {}

    for survey_id in survey_id_set:
        survey = await request.app.mongodb["Survey"].find_one({'_id': survey_id})
        question_dict = {}
        questions = survey['questions']
        for question in questions:
            question_dict[question['_id']] = question['text']
        survey_question_dict[survey_id] = question_dict

    for item in response['data']:
        item['question_text'] = survey_question_dict[item['survey_id']][item['question_id']]

    assessment_response = AssessmentResponse(
        assessment_id=response.get('assessment_id'),
        patient_id=response.get('patient_id'),
        data=response.get('data')
    )
    assessment_response = jsonable_encoder(assessment_response)
    new_assessment_response = await request.app.mongodb["AssessmentResponse"].insert_one(assessment_response)
    created_assessment_response = await request.app.mongodb["AssessmentResponse"].find_one({"_id": new_assessment_response.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_assessment_response)


@response_router.get("/download/{id}", response_description="Download a single assessment response")
async def download_response(request: Request, id:str):
    responses = []
    find_criteria = {"assessment_id": id}
    responses_list = await request.app.mongodb["AssessmentResponse"].find(find_criteria).to_list(length=None)

    create_csv_file(responses_list)

    # TODO what to return here
    return responses
