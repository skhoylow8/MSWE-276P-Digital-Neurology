import datetime
import uuid

from pydantic import BaseModel, Field


class AnsweredQuestionDTO(BaseModel):
    survey_id: str = Field(...)
    question_id: str = Field(...)
    answer: str = Field(...)


class AnsweredQuestion(BaseModel):
    survey_id: str = Field(...)
    question_id: str = Field(...)
    question_text: str = Field(...)
    answer: str = Field(...)


class AssessmentResponseDTO(BaseModel):
    assessment_id: str = Field(...)
    patient_id: str = Field(...)
    data: list[AnsweredQuestionDTO]


class AssessmentResponse(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    created_on: str = Field(default_factory=datetime.datetime.now)
    assessment_id: str = Field(...)
    patient_id: str = Field(...)
    data: list[AnsweredQuestion]
