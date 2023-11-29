import os
from asyncio import Future
from typing import Annotated

from fastapi import APIRouter, Request, HTTPException, status, File, Depends, UploadFile, Form
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.assessment import AssessmentRequest, Assessment, AssessmentDisplay
from utils.misc import convert_file_to_text
from utils.auth import get_current_user

assessment_router = APIRouter()


@assessment_router.post("/", response_description="Add new assessment request")
async def create_assessment_request(
        request: Request,
        user: Annotated[Future, Depends(get_current_user)],
        assessment_request: AssessmentRequest = Depends(),
        consent_file: UploadFile = File(None)
):
    u = await user
    print(u)
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
        name=assessment_request.get('name'),
        desc=assessment_request.get('desc'),
        consent_text=consent_text,
        survey_ids=assessment_request.get('survey_ids')[0].split(','),
        researcher_id=assessment_request.get('researcher_id')
    )

    assessment = jsonable_encoder(assessment)

    new_assessment = await request.app.mongodb["Assessment"].insert_one(assessment)
    created_assessment = await request.app.mongodb["Assessment"].find_one({"_id": new_assessment.inserted_id})

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_assessment)


@assessment_router.get("/", response_description="Get all assessments")
async def list_assessments(request: Request, user: Annotated[Future, Depends(get_current_user)]):
    user = await user  # TODO remove this
    assessments = []
    sort_criteria = [("created_on", -1)]
    find_criteria = {"researcher_id": user['_id']}
    for assessment in await request.app.mongodb["Assessment"].find(find_criteria).sort(sort_criteria).to_list(10):
        assessments.append(assessment)
    return assessments
    


@assessment_router.get("/{id}", response_description="Get an assessment")
async def get_assessment(id: str, request: Request, user: Annotated[Future, Depends(get_current_user)]):
    if (assessment := await request.app.mongodb["Assessment"].find_one({"_id": id})) is not None:
        surveys = []
        for survey_id in assessment.get('survey_ids'):
            surveys.append(await request.app.mongodb["Survey"].find_one({"_id": survey_id}))
        assessment = AssessmentDisplay(
            assessment=assessment,
            surveys=surveys
        )
        return assessment

    return HTTPException(status_code=404, detail=f"Assessment {id} not found")

        
