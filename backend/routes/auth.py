from fastapi import APIRouter, Request, Body, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import FastAPI, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from models.researcher import ResearcherSignUp

from uuid import uuid4

from utils.auth import get_hashed_password, verify_password, create_access_token

auth_router = APIRouter()


@auth_router.post('/signup', response_description="Create new user")
async def create_user(request: Request, researcher: ResearcherSignUp = Body(...)):
    # querying database to check if user already exists
    existing_researcher = await request.app.mongodb["Researcher"].find_one({"email": researcher.email})
    if existing_researcher is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Researcher with this email already exists"
    )
    researcher.password = get_hashed_password(researcher.password)
    researcher = jsonable_encoder(researcher)
    new_researcher = await request.app.mongodb["Researcher"].insert_one(researcher)
    created_researcher = await request.app.mongodb["Researcher"].find_one({"_id": new_researcher.inserted_id})
    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_researcher)


@auth_router.post('/login', response_description="Create access and refresh tokens for user")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    user = await request.app.mongodb["Researcher"].find_one({"email": form_data.username})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    hashed_pass = user['password']
    if not verify_password(form_data.password, hashed_pass):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    return {
        "access_token": create_access_token(data={"user_id": user['_id']}),
        "token_type": "bearer",
    }

