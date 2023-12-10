import os
from asyncio import Future
from typing import Annotated

from fastapi import APIRouter, Request, status, Body, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.participant import Participant, ParticipantRequest
from utils.auth import get_current_user

participant_router = APIRouter()


@participant_router.post("/", response_description="Add new participant")
async def create_participant(request: Request, participant_request: ParticipantRequest = Body(...)):
   
   existing_participant = await request.app.mongodb["Participant"].find_one({"email": participant_request.email})
   if existing_participant is None:
      participant = Participant(
        assessment_ids = participant_request.assessment_ids,
        first_name=participant_request.first_name,
        last_name=participant_request.last_name,
        email=participant_request.email
    )
      participant = jsonable_encoder(participant)
      new_participant = await request.app.mongodb["Participant"].insert_one(participant)
      created_participant = await request.app.mongodb["Participant"].find_one({"_id": new_participant.inserted_id})
      return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_participant)
   else:
      existing_participant = jsonable_encoder(existing_participant)
   
      participant_request.assessment_ids = existing_participant["assessment_ids"] + participant_request.assessment_ids
      new_participant = await request.app.mongodb["Participant"].replace_one({"email": participant_request.email}, jsonable_encoder(participant_request))
      created_participant = await request.app.mongodb["Participant"].find_one({"email": participant_request.email})
      return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_participant)
        
    
@participant_router.get("/", response_description="Get all Participants and their Assessment names")
async def list_participants(request: Request, user: Annotated[Future, Depends(get_current_user)]):
    user = await user
    filter_criteria = {"researcher_id": user.get('_id')}
    projection = {"_id": 1}
    assessment_ids = await request.app.mongodb["Assessment"].find(filter_criteria, projection).to_list(length=None)
    assessment_ids = [assessment_id['_id'] for assessment_id in assessment_ids]
    assessment_responses = await request.app.mongodb["AssessmentResponse"]\
        .find({"assessment_id": {"$in": assessment_ids}})\
        .sort("created_on", -1)\
        .to_list(length=None)
    responses = []
    for assessment_response in assessment_responses:
        assessment = await request.app.mongodb["Assessment"].find_one({"_id": assessment_response["assessment_id"]})
        participant =  await request.app.mongodb["Participant"].find_one({"_id": assessment_response["patient_id"]})
        response = {
            "participant_first_name": participant.get('first_name'),
             "participant_last_name": participant.get('last_name'),
            "assessment_name": assessment.get('name'),
            "created_on": assessment_response.get('created_on')
        }
        responses.append(response)

    return responses

  