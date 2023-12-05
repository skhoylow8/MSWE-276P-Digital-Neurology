import os

from fastapi import APIRouter, Request, status, Body, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.participant import Participant, ParticipantRequest


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
        
    
@participant_router.get("/{id}", response_description="Get all Participants and their Assessment names")
async def list_participants(id: str, request: Request):
    participants = []
    participant_list = await request.app.mongodb["Participant"].find().to_list(length=None)
    for participant in participant_list:
      assessment_obj=[]
      for assessment in participant.get('assessment_ids') :
         if(await request.app.mongodb["Assessment"].find_one({"_id": assessment})) is not None:
            assessmentForParticularParticipant = await request.app.mongodb["Assessment"].find_one({"_id": assessment})
            if(assessmentForParticularParticipant.get("researcher_id") == id and 
            await request.app.mongodb["AssessmentResponse"].find_one({"assessment_id": assessment}) is not None) :
               assessment_obj.append(await request.app.mongodb["Assessment"].find_one({"_id": assessment}))

      if len(assessment_obj) != 0:
         participant["assessment_ids"] = assessment_obj  
         participants.append(participant)
    return participants
  