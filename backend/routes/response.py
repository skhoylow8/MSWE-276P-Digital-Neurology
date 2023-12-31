import datetime

from fastapi import APIRouter, Request, status, Body, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.responses import StreamingResponse
from requests import Response

from models.response import AssessmentResponse, AssessmentResponseDTO
from utils.response import create_csv_data

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
            question_dict[question['_id']] = (question['text'], question['type'], question['choices'])
        survey_question_dict[survey_id] = question_dict

    new_data = []
    for item in response['data']:
        question_type = survey_question_dict[item['survey_id']][item['question_id']][1]
        question_choices = survey_question_dict[item['survey_id']][item['question_id']][2]
        if question_type == "cb":
            answers = item['answer'].split(',')
            for choice in question_choices:
                new_data.append({
                    'survey_id': item['survey_id'],
                    'question_id': item['question_id'],
                    'question_text': survey_question_dict[item['survey_id']][item['question_id']][0] + '---' + choice,
                    'answer': 'yes' if choice in answers else 'no'
                })
        else:
            item['question_text'] = survey_question_dict[item['survey_id']][item['question_id']][0]
            new_data.append(item)

    assessment_response = AssessmentResponse(
        assessment_id=response.get('assessment_id'),
        patient_id=response.get('patient_id'),
        data=new_data
    )
    assessment_response = jsonable_encoder(assessment_response)
    new_assessment_response = await request.app.mongodb["AssessmentResponse"].insert_one(assessment_response)
    created_assessment_response = await request.app.mongodb["AssessmentResponse"].find_one({"_id": new_assessment_response.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_assessment_response)


@response_router.get("/download/{id}", response_description="Download a single assessment response")
async def download_response(request: Request, id: str):
    find_criteria = {"assessment_id": id}
    responses_list = await request.app.mongodb["AssessmentResponse"].find(find_criteria).to_list(length=None)
    if len(responses_list) == 0:
        print("no assessments!")
        raise HTTPException(status_code=400, detail="No assessments present")

    assessment = await request.app.mongodb["Assessment"].find_one({"_id": id})

    filename = assessment.get('name') + '-' + str(datetime.datetime.now()) + '.csv'
    headers = {"Content-Disposition": f"attachment; filename={filename}"}

    csv_data = create_csv_data(responses_list)
    response = StreamingResponse(iter([csv_data]), media_type="text/csv", headers=headers)

    return response
