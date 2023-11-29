import os

from fastapi import APIRouter, Request, status, Body
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from models.participant import Participant


participant_router = APIRouter()



@participant_router.post("/", response_description="Add new participant")
async def create_participant(request: Request, participant: Participant = Body(...)):
   
   existing_participant = await request.app.mongodb["Participant"].find_one({"email": participant.email})
   if existing_participant is None:
      participant = jsonable_encoder(participant)
      new_participant = await request.app.mongodb["Participant"].insert_one(participant)
      created_participant = await request.app.mongodb["Participant"].find_one({"_id": new_participant.inserted_id})
      return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_participant)
   else:
      existing_participant = jsonable_encoder(existing_participant)
      participant.assessment_ids = existing_participant["assessment_ids"] + participant.assessment_ids
      new_participant = await request.app.mongodb["Participant"].replace_one({"email": participant.email}, jsonable_encoder(participant))
      created_participant = await request.app.mongodb["Participant"].find_one({"email": participant.email})
      return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_participant)
        
    
@participant_router.get("/", response_description="Get all Participants and their Assessment names")
async def list_participants(request: Request):
    participants = []
    participant_list = await request.app.mongodb["Participant"].find().to_list(length=None)
    for participant in participant_list:
      assessment_obj=[]
      for assessment in participant.get('assessment_ids') :
         if(await request.app.mongodb["Assessment"].find_one({"_id": assessment})) is not None:
            assessment_obj.append(await request.app.mongodb["Assessment"].find_one({"_id": assessment}))
      participant["assessment_ids"] = assessment_obj  
      participants.append(participant)
    return participants
  