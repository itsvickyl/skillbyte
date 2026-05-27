import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.services.db_service import db_service
from app.routes import quiz, analytics

# Lifespan manager to cleanly initialize our database check at startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize the DB Service (determines MongoDB vs. In-memory)
    await db_service.initialize()
    yield
    # Shutdown: Add any cleanup here if needed
    pass

app = FastAPI(
    title="Skillbytes Quiz API Server",
    description="Production-quality hiring assessment backend using FastAPI and MongoDB (with mock fallbacks).",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend web application development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include sub-routers
app.include_router(quiz.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Skillbytes Quiz Backend",
        "is_mock_db": db_service.is_mock
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
