from fastapi import APIRouter, Request, Body
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi import status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from models.researcher import ResearcherSignUp, Researcher
from utils.auth import get_hashed_password, verify_password, create_access_token
from models.config import HOST, USERNAME, PASSWORD, PORT, MailBody
from ssl import create_default_context
from email.mime.text import MIMEText
from smtplib import SMTP
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl

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
        raise  HTTPException(
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
    return JSONResponse(status_code=status.HTTP_201_CREATED, content={
        "access_token": create_access_token(data={"user_id": created_researcher['_id']}),
        "token_type": "bearer",
        "researcher": created_researcher
    })


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
        "researcher_id": user['_id'],
        "researcher_name": user['first_name'],
        "researcher_email": user['email'],
    }

'''@auth_router.post('/reset', response_description="Reset password using rest password link")
async def reset(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    message = MIMEMultipart()
    message["From"] = ""
    message["To"] = ""
    message["Subject"] = "send email"

    context=ssl._create_unverified_context()
    body = 'send link for reset password page'
    message.attach(MIMEText(body, 'plain'))

    try:
        with SMTP(HOST, PORT) as server:
            server.ehlo()
            server.starttls(context=context)
            server.ehlo()
            server.login(USERNAME, "password")
            server.sendmail(USERNAME, "email", message.as_string())
            server.quit() 
        
    except Exception as e:
        return {"status": 500, "errors": e}'''
    

