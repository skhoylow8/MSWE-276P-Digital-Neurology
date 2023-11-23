from fastapi import APIRouter, Request, Body
from fastapi.encoders import jsonable_encoder
from fastapi.openapi.models import Response
from fastapi.responses import JSONResponse
from fastapi import status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from models.researcher import ResearcherSignUp, Researcher
from utils.auth import get_hashed_password, verify_password, create_access_token, get_current_user

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
    if researcher.email != researcher.confirm_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Emails do not match"
        )
    if researcher.password != researcher.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    researcher = Researcher(
        first_name=researcher.first_name,
        last_name=researcher.last_name,
        email=researcher.email,
        password=get_hashed_password(researcher.password)
    )
    researcher = jsonable_encoder(researcher)
    new_researcher = await request.app.mongodb["Researcher"].insert_one(researcher)
    created_researcher = await request.app.mongodb["Researcher"].find_one({"_id": new_researcher.inserted_id})
    token = create_access_token(data={"user_id": created_researcher['_id']})

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "access_token": token,
            "token_type": "bearer",
            "researcher": created_researcher
        },
        headers={"Set-Cookie": f'X-AUTH={token}'}
    )


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

    token = create_access_token(data={"user_id": user['_id']})
    return JSONResponse(
        content={
            "access_token": token,
            "token_type": "bearer",
            "researcher_id": user['_id'],
            "researcher_name": user['first_name'],
            "researcher_email": user['email'],
        },
        headers={"Set-Cookie": f'X-AUTH={token}'}
    )


@auth_router.post('/logout', response_description="Logout user")
async def logout(current_user: str = Depends(get_current_user)):
    # Perform additional actions if needed (e.g., token invalidation, session clearance)
    # In a real application, you might want to implement token blacklisting or revocation mechanisms

    # Clear session or perform any cleanup required
    # For example, if you have a session management system or cache, clear the user's session data

    # Respond with a message confirming successful logout
    response = JSONResponse(
        content={"message": "Logged out successfully"},
        headers={"Set-Cookie": "X-AUTH=; HttpOnly; Secure; SameSite=None; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"}
    )
    return response
