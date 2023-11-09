import datetime
import uuid
from typing import List

from pydantic import BaseModel, Field

from models.survey import Survey


class AssessmentRequest(BaseModel):
    name: str = Field(...)
    desc: str = Field(...)
    survey_ids: List[str] = Field(...)
    researcher_id: str = Field(...)


class Assessment(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)
    desc: str = Field(...)
    created_on: str = Field(default_factory=datetime.datetime.now)
    consent_text: str = Field(...)
    survey_ids: List[str] = Field(...)
    researcher_id: str = Field(...)


class AssessmentDisplay(BaseModel):
    assessment: Assessment
    surveys: List[Survey]
