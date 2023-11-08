import uuid

from pydantic import BaseModel, Field, EmailStr


class ResearcherSignUp(BaseModel):
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)
    confirm_email : EmailStr = Field(...)
    password: str = Field(...)
    confirm_password: str = Field(...)


class Researcher(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")  # how to validate unique ID
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)
    password: EmailStr = Field(...)


class ResearcherLogin(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email: EmailStr = Field(...)
    password: str = Field(...)
