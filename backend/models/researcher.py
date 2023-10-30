import uuid

from pydantic import BaseModel, Field, EmailStr


class ResearcherSignUp(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")  # how to validate unique ID
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)  # should this also be a string?


class ResearcherView(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")  # how to validate unique ID
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)


class ResearcherLogin(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email: EmailStr = Field(...)
    password: str = Field(...)  # should this also be a string?
