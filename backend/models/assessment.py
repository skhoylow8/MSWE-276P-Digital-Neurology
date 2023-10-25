import uuid

from pydantic import BaseModel, Field

from models.survey import Survey
from models.researcher import ResearcherView


class Assessment(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    consent: str = Field(...)
    survey_ids: list[str] = Field(...)
    choices: list = Field(...)
    researcher_id: str

