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
  