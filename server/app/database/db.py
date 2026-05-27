from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# Initialize Motor Client
client = AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.DATABASE_NAME]

# Expose collections
users_collection = db["users"]
exams_collection = db["exams"]
subjects_collection = db["subjects"]
chapters_collection = db["chapters"]
questions_collection = db["questions"]
quiz_sessions_collection = db["quiz_sessions"]
responses_collection = db["responses"]

async def check_db_connection():
    try:
        # The ismaster command is cheap and does not require auth
        await db.command("ping")
        return True
    except Exception as e:
        print(f"Database connection error: {e}")
        return False
