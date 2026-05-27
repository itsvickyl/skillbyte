from fastapi import APIRouter, HTTPException
from app.services.db_service import db_service

router = APIRouter(prefix="/api")

@router.get("/analytics")
async def get_analytics():
    try:
        data = await db_service.get_analytics()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
