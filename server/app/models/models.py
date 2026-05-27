from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, Field, GetCoreSchemaHandler
from pydantic_core import core_schema
from typing import Any, List, Optional

# Custom PyObjectId type for Pydantic v2
class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ]),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, value: Any) -> ObjectId:
        if not ObjectId.is_valid(value):
            raise ValueError("Invalid ObjectId")
        return ObjectId(value)


class MongoBaseModel(BaseModel):
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }


# 1. User Schema
class User(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    username: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    username: str


# 2. Exam Schema
class Exam(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    title: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ExamCreate(BaseModel):
    title: str
    description: str


# 3. Subject Schema
class Subject(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    exam_id: PyObjectId
    title: str
    description: str

class SubjectCreate(BaseModel):
    exam_id: str
    title: str
    description: str


# 4. Chapter Schema
class Chapter(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    subject_id: PyObjectId
    title: str
    description: str

class ChapterCreate(BaseModel):
    subject_id: str
    title: str
    description: str


# 5. Question Schema
class Question(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    chapter_id: PyObjectId
    text: str
    options: List[str]
    correct_option_index: int

class QuestionCreate(BaseModel):
    chapter_id: str
    text: str
    options: List[str]
    correct_option_index: int


# 6. QuizSession Schema
class QuizSession(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: str  # Storing username or user's ObjectId as string
    chapter_id: PyObjectId
    status: str = "started"  # started, completed, abandoned
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    score: Optional[int] = None
    total_questions: int

class QuizSessionCreate(BaseModel):
    username: str
    chapter_id: str


# 7. Response Schema
class Response(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    session_id: PyObjectId
    question_id: PyObjectId
    selected_option_index: int
    is_correct: bool
    shown_at: datetime
    submitted_at: datetime
    duration_seconds: float

class ResponseCreate(BaseModel):
    session_id: str
    question_id: str
    selected_option_index: int
    shown_at: datetime
    submitted_at: datetime
