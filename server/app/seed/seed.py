import random
import sys
import os
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

# Load env variables from .env file
load_dotenv()

# Simple script to seed the database with mock data for testing and analytics
def seed_database():
    print("Connecting to MongoDB...")
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("DATABASE_NAME", "skillbytes_quiz")
    client = MongoClient(mongo_uri)
    db = client[db_name]

    # Clear existing collections
    print("Clearing existing collections...")
    db["exams"].delete_many({})
    db["subjects"].delete_many({})
    db["chapters"].delete_many({})
    db["questions"].delete_many({})
    db["users"].delete_many({})
    db["quiz_sessions"].delete_many({})
    db["responses"].delete_many({})

    # 1. Seed Exams
    print("Seeding exams...")
    exams_data = [
        {
            "_id": ObjectId("6654b9f2b84f23b2c286a111"),
            "title": "Science & Tech Board",
            "description": "Comprehensive evaluation of basic science and technological applications.",
            "created_at": datetime.utcnow() - timedelta(days=15)
        },
        {
            "_id": ObjectId("6654b9f2b84f23b2c286a222"),
            "title": "General Knowledge & Aptitude",
            "description": "Assessment of geographical awareness, logical reasoning, and world history.",
            "created_at": datetime.utcnow() - timedelta(days=15)
        }
    ]
    db["exams"].insert_many(exams_data)

    # 2. Seed Subjects
    print("Seeding subjects...")
    subjects_data = [
        # Science & Tech Subjects
        {
            "_id": ObjectId("6654b9f2b84f23b2c286a333"),
            "exam_id": ObjectId("6654b9f2b84f23b2c286a111"),
            "title": "Physics",
            "description": "Core mechanics, optics, thermodynamics, and electromagnetism."
        },
        {
            "_id": ObjectId("6654b9f2b84f23b2c286a444"),
            "exam_id": ObjectId("6654b9f2b84f23b2c286a111"),
            "title": "Chemistry",
            "description": "Organic chemistry, states of matter, and chemical bonding."
        },
        {
            "_id": ObjectId("6654b9f2b84f23b2c286a555"),
            "exam_id": ObjectId("6654b9f2b84f23b2c286a111"),
            "title": "Biology",
            "description": "Human anatomy, plant systems, genetics, and ecology."
        },
        # GK & Aptitude Subjects
        {
            "_id": ObjectId("6654b9f2b84f23b2c286a666"),
            "exam_id": ObjectId("6654b9f2b84f23b2c286a222"),
            "title": "Geography",
            "description": "World geography, continents, oceans, and atmospheres."
        },
        {
            "_id": ObjectId("6654b9f2b84f23b2c286a777"),
            "exam_id": ObjectId("6654b9f2b84f23b2c286a222"),
            "title": "Logical Reasoning",
            "description": "Puzzles, series completion, syllogisms, and coding-decoding."
        }
    ]
    db["subjects"].insert_many(subjects_data)

    # 3. Seed Chapters
    print("Seeding chapters...")
    chapters_data = [
        # Physics Chapters
        {
            "_id": ObjectId("6654b9f2b84f23b2c286b111"),
            "subject_id": ObjectId("6654b9f2b84f23b2c286a333"),
            "title": "Mechanics & Motion",
            "description": "Newton's laws, kinematic equations, speed, velocity, and gravity."
        },
        {
            "_id": ObjectId("6654b9f2b84f23b2c286b222"),
            "subject_id": ObjectId("6654b9f2b84f23b2c286a333"),
            "title": "Light & Optics",
            "description": "Refraction, reflection, mirrors, lenses, and human eye anatomy."
        },
        # Chemistry Chapters
        {
            "_id": ObjectId("6654b9f2b84f23b2c286b333"),
            "subject_id": ObjectId("6654b9f2b84f23b2c286a444"),
            "title": "Organic Foundations",
            "description": "Alkanes, alkenes, functional groups, and carbon properties."
        },
        # Geography Chapters
        {
            "_id": ObjectId("6654b9f2b84f23b2c286b444"),
            "subject_id": ObjectId("6654b9f2b84f23b2c286a666"),
            "title": "Continents & Oceans",
            "description": "Landmasses, ocean depths, coordinates, and regional climates."
        },
        # Logical Chapters
        {
            "_id": ObjectId("6654b9f2b84f23b2c286b555"),
            "subject_id": ObjectId("6654b9f2b84f23b2c286a777"),
            "title": "Number & Letter Series",
            "description": "Pattern identification, logical increments, and grid analysis."
        }
    ]
    db["chapters"].insert_many(chapters_data)

    # 4. Seed Questions (at least 5 questions per chapter)
    print("Seeding questions...")
    questions_data = [
        # Mechanics & Motion Questions
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b111"),
            "text": "What is the SI unit of force?",
            "options": ["Joule", "Pascal", "Newton", "Watt"],
            "correct_option_index": 2
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b111"),
            "text": "Which of Newton's laws state that every action has an equal and opposite reaction?",
            "options": ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
            "correct_option_index": 2
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b111"),
            "text": "What is the standard acceleration due to gravity (g) on the surface of the Earth?",
            "options": ["8.9 m/s²", "9.8 m/s²", "10.2 m/s²", "7.6 m/s²"],
            "correct_option_index": 1
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b111"),
            "text": "Which of the following physical quantities is a scalar?",
            "options": ["Velocity", "Acceleration", "Displacement", "Speed"],
            "correct_option_index": 3
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b111"),
            "text": "If an object is at rest, what is its net acceleration?",
            "options": ["9.8 m/s²", "0 m/s²", "Infinite", "Depends on its mass"],
            "correct_option_index": 1
        },

        # Light & Optics Questions
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b222"),
            "text": "What is the speed of light in a vacuum approximately?",
            "options": ["3 x 10⁵ m/s", "3 x 10⁸ m/s", "3 x 10¹⁰ m/s", "1.5 x 10⁸ m/s"],
            "correct_option_index": 1
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b222"),
            "text": "Which lens is used to correct myopia (short-sightedness)?",
            "options": ["Convex lens", "Concave lens", "Bifocal lens", "Cylindrical lens"],
            "correct_option_index": 1
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b222"),
            "text": "The bending of light when it passes from one medium to another is called:",
            "options": ["Reflection", "Dispersion", "Refraction", "Diffraction"],
            "correct_option_index": 2
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b222"),
            "text": "Which color of light deviates the most when passing through a glass prism?",
            "options": ["Red", "Green", "Yellow", "Violet"],
            "correct_option_index": 3
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b222"),
            "text": "A mirror with a surface curving outwards is a:",
            "options": ["Concave mirror", "Convex mirror", "Plane mirror", "Parabolic mirror"],
            "correct_option_index": 1
        },

        # Organic Foundations Questions
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b333"),
            "text": "What is the simplest alkane?",
            "options": ["Ethane", "Methane", "Propane", "Butane"],
            "correct_option_index": 1
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b333"),
            "text": "How many covalent bonds can a carbon atom form?",
            "options": ["2", "3", "4", "6"],
            "correct_option_index": 2
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b333"),
            "text": "The functional group -OH represents which family?",
            "options": ["Aldehydes", "Ketones", "Carboxylic Acids", "Alcohols"],
            "correct_option_index": 3
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b333"),
            "text": "What is the general chemical formula of Alkenes?",
            "options": ["CnH2n+2", "CnH2n", "CnH2n-2", "CnHn"],
            "correct_option_index": 1
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b333"),
            "text": "Which substance is commonly known as vinegar?",
            "options": ["Formic acid", "Acetic acid", "Citric acid", "Hydrochloric acid"],
            "correct_option_index": 1
        },

        # Continents & Oceans Questions
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b444"),
            "text": "Which is the largest ocean on Earth?",
            "options": ["Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Pacific Ocean"],
            "correct_option_index": 3
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b444"),
            "text": "Which continent is home to the Amazon Rainforest?",
            "options": ["Africa", "Asia", "South America", "Australia"],
            "correct_option_index": 2
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b444"),
            "text": "Which is the smallest continent by land area?",
            "options": ["Europe", "Antarctica", "Australia", "South America"],
            "correct_option_index": 2
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b444"),
            "text": "What is the deepest point in the world's oceans?",
            "options": ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Sunda Deep"],
            "correct_option_index": 0
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b444"),
            "text": "Which ocean is shaped like an 'S'?",
            "options": ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
            "correct_option_index": 1
        },

        # Series Questions
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b555"),
            "text": "Complete the number series: 2, 4, 8, 16, 32, ...",
            "options": ["48", "64", "56", "128"],
            "correct_option_index": 1
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b555"),
            "text": "Find the next term in the alphabet series: A, C, F, J, ...",
            "options": ["M", "N", "O", "P"],
            "correct_option_index": 2
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b555"),
            "text": "Complete the series: 3, 5, 9, 17, 33, ...",
            "options": ["48", "65", "68", "72"],
            "correct_option_index": 1
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b555"),
            "text": "What is the missing number in the grid: 4, 9, 16, 25, [?], 49",
            "options": ["30", "35", "36", "40"],
            "correct_option_index": 2
        },
        {
            "chapter_id": ObjectId("6654b9f2b84f23b2c286b555"),
            "text": "Complete the series: 1, 8, 27, 64, 125, ...",
            "options": ["150", "216", "225", "343"],
            "correct_option_index": 1
        }
    ]
    
    # Store questions and get object ids
    question_ids = []
    for q in questions_data:
        res = db["questions"].insert_one(q)
        q["_id"] = res.inserted_id
        question_ids.append(q)

    # 5. Seed Historical User Sessions and Responses for rich Analytics graphs
    # We will generate analytics over the past 10 days.
    # WAU/DAU, Drop-off, response times, completions, peak hours.
    print("Generating rich historical analytics data (10 days)...")
    
    now = datetime.utcnow()
    usernames = [f"Student_{i:03d}" for i in range(1, 150)]
    
    chapters = chapters_data
    
    # Generate ~200 quiz sessions over the last 10 days
    sessions_to_insert = []
    responses_to_insert = []
    
    # Let's seed static users too
    users_to_insert = [{"username": uname, "created_at": now - timedelta(days=random.randint(1, 12))} for uname in usernames]
    db["users"].insert_many(users_to_insert)

    for i in range(220):
        # Determine day offset: most traffic in last 3 days
        day_offset = random.choices(
            population=list(range(12)),
            weights=[25, 20, 15, 10, 8, 6, 5, 4, 3, 2, 1, 1], # high weights for recent days (higher WAU/DAU)
            k=1
        )[0]
        
        # Determine hour: peak activity in morning and evening
        hour = random.choices(
            population=list(range(24)),
            weights=[2, 1, 0, 0, 1, 2, 4, 8, 12, 10, 8, 6, 8, 10, 14, 16, 20, 22, 18, 15, 10, 8, 5, 3], # peaks at 8-9 AM, 2-5 PM, 6-9 PM
            k=1
        )[0]
        
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        
        started_time = now - timedelta(days=day_offset)
        started_time = started_time.replace(hour=hour, minute=minute, second=second)
        
        username = random.choice(usernames)
        chapter = random.choice(chapters)
        
        # Get questions for this chapter
        chapter_questions = [q for q in questions_data if q["chapter_id"] == chapter["_id"]]
        if not chapter_questions:
            continue
            
        total_q = len(chapter_questions)
        
        # Drop-off simulation
        # Some users start but abandon
        # Completes: 75%, Abandoned: 25%
        status = random.choices(["completed", "abandoned"], weights=[75, 25], k=1)[0]
        
        if status == "completed":
            answered_count = total_q
        else:
            answered_count = random.randint(1, total_q - 1)
            
        session_id = ObjectId()
        
        score = 0
        current_time = started_time
        
        for q_idx in range(answered_count):
            q = chapter_questions[q_idx]
            shown_time = current_time
            
            # response duration between 3 to 22 seconds
            dur = round(random.uniform(4.0, 18.0), 2)
            current_time = shown_time + timedelta(seconds=dur)
            submitted_time = current_time
            
            # correct selection rate ~ 70%
            is_correct = random.choices([True, False], weights=[70, 30], k=1)[0]
            if is_correct:
                selected_idx = q["correct_option_index"]
                score += 1
            else:
                wrong_indices = [idx for idx in range(4) if idx != q["correct_option_index"]]
                selected_idx = random.choice(wrong_indices)
                
            response_doc = {
                "session_id": session_id,
                "question_id": q["_id"],
                "selected_option_index": selected_idx,
                "is_correct": is_correct,
                "shown_at": shown_time,
                "submitted_at": submitted_time,
                "duration_seconds": dur
            }
            responses_to_insert.append(response_doc)
            
            # short break between questions (1 to 3 seconds)
            current_time += timedelta(seconds=random.uniform(1.0, 3.0))

        completed_time = current_time if status == "completed" else None
        
        session_doc = {
            "_id": session_id,
            "user_id": username,
            "chapter_id": chapter["_id"],
            "status": status,
            "started_at": started_time,
            "completed_at": completed_time,
            "score": score if status == "completed" else None,
            "total_questions": total_q
        }
        sessions_to_insert.append(session_doc)

    db["quiz_sessions"].insert_many(sessions_to_insert)
    db["responses"].insert_many(responses_to_insert)

    print("----------------------------------------")
    print("Database seeding completed successfully!")
    print(f"Exams: {db['exams'].count_documents({})}")
    print(f"Subjects: {db['subjects'].count_documents({})}")
    print(f"Chapters: {db['chapters'].count_documents({})}")
    print(f"Questions: {db['questions'].count_documents({})}")
    print(f"Users: {db['users'].count_documents({})}")
    print(f"Quiz Sessions: {db['quiz_sessions'].count_documents({})}")
    print(f"Question Responses: {db['responses'].count_documents({})}")
    print("----------------------------------------")

if __name__ == "__main__":
    seed_database()
