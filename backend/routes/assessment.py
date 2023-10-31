import os

from fastapi import APIRouter, Request, HTTPException, status, File, Depends, UploadFile
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.assessment import AssessmentRequest, Assessment
from utils.misc import convert_file_to_text

assessment_router = APIRouter()


@assessment_router.post("/", response_description="Add new assessment request")
async def create_assessment_request(request: Request, assessment_request: AssessmentRequest = Depends(), consent_file: UploadFile = File(None)):
    assessment_request = assessment_request.model_dump()
    if not consent_file and not assessment_request.get('consent_text'):
        raise HTTPException(status_code=400, detail="Consent not provided")

    consent_text = assessment_request.get('consent_text')

    if consent_file:
        file_path = os.path.join(consent_file.filename)
        with open(file_path, "wb") as file_object:
            file_object.write(await consent_file.read())
        consent_text = convert_file_to_text(file_path)

    assessment = Assessment(
        consent_text=consent_text,
        survey_ids=assessment_request.get('survey_ids'),
        researcher_id=assessment_request.get('researcher_id')
    )

    assessment = jsonable_encoder(assessment)

    new_assessment = await request.app.mongodb["Assessment"].insert_one(assessment)
    created_assessment = await request.app.mongodb["Assessment"].find_one({"_id": new_assessment.inserted_id})

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_assessment)
