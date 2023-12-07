import uuid

from pydantic import BaseModel, Field, EmailStr


class Participant(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")  # how to validate unique ID
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)
    assessment_ids: list[str] = Field(...)


class ParticipantRequest(BaseModel):
    first_name: str = Field(...)
    last_name: str = Field(...)
    email: EmailStr = Field(...)
    assessment_ids: list[str] = Field(...)




