import uuid

from pydantic import BaseModel, Field


class AssessmentRequest(BaseModel):
    survey_ids: list[str] = Field(...)
    researcher_id: str = Field(...)


class Assessment(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    consent_text: str = Field(...)
    survey_ids: list[str] = Field(...)
    researcher_id: str = Field(...)
