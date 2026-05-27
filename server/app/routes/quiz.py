from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from app.services.db_service import db_service

router = APIRouter(prefix="/api")

# Pydantic schemas for request payloads
class QuizStartRequest(BaseModel):
    username: str
    chapter_id: str

class QuizAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    selected_option_index: int
    shown_at: datetime
    submitted_at: datetime

class QuizFinishRequest(BaseModel):
    session_id: str

# 1. GET /api/exams
@router.get("/exams")
async def get_exams():
    try:
        exams = await db_service.get_exams()
        # Convert _id to string for JSON serialization
        for e in exams:
            e["id"] = str(e["_id"])
            if "_id" in e:
                del e["_id"]
        return exams
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. GET /api/subjects/{examId}
@router.get("/subjects/{examId}")
async def get_subjects(examId: str):
    try:
        subjects = await db_service.get_subjects(examId)
        for s in subjects:
            s["id"] = str(s["_id"])
            s["exam_id"] = str(s["exam_id"])
            if "_id" in s:
                del s["_id"]
        return subjects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. GET /api/chapters/{subjectId}
@router.get("/chapters/{subjectId}")
async def get_chapters(subjectId: str):
    try:
        chapters = await db_service.get_chapters(subjectId)
        for c in chapters:
            c["id"] = str(c["_id"])
            c["subject_id"] = str(c["subject_id"])
            if "_id" in c:
                del c["_id"]
        return chapters
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. POST /api/quiz/start
@router.post("/quiz/start")
async def start_quiz(payload: QuizStartRequest):
    try:
        session_id, total_questions = await db_service.start_quiz(
            username=payload.username,
            chapter_id=payload.chapter_id
        )
        return {
            "session_id": session_id,
            "total_questions": total_questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 5. GET /api/quiz/question/{sessionId}
@router.get("/quiz/question/{sessionId}")
async def get_question(sessionId: str, next_index: int = Query(0)):
    try:
        q_data = await db_service.get_question(sessionId, next_index)
        if not q_data:
            return {
                "question": None,
                "message": "No more questions in this quiz session."
            }
        return q_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 6. POST /api/quiz/answer
@router.post("/quiz/answer")
async def submit_answer(payload: QuizAnswerRequest):
    try:
        is_correct, correct_option_index = await db_service.submit_answer(
            session_id=payload.session_id,
            question_id=payload.question_id,
            selected_option_index=payload.selected_option_index,
            shown_at=payload.shown_at,
            submitted_at=payload.submitted_at
        )
        return {
            "is_correct": is_correct,
            "correct_option_index": correct_option_index
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 7. POST /api/quiz/finish
@router.post("/quiz/finish")
async def finish_quiz(payload: QuizFinishRequest):
    try:
        results = await db_service.finish_quiz(payload.session_id)
        if not results:
            raise HTTPException(status_code=404, detail="Quiz session not found.")
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
