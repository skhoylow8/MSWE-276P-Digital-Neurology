import uuid

from pydantic import BaseModel, Field


class ResearcherSignUp(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")  # how to validate unique ID
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: str = Field(...)  # add more validation
    password: str = Field(...)  # should this also be a string?


class ResearcherLogin(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    email: str = Field(...)  # add more validation
    password: str = Field(...)  # should this also be a string?
