import uuid

from pydantic import BaseModel, Field


class Question(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    text: str = Field(...)
    type: str = Field(...)
    choices: list = Field(...)


class Survey(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str = Field(...)
    desc: str = Field(...)
    questions: list[Question]
