# SkillBytes — Interactive Quiz Assessment Platform

A full-stack quiz assessment platform built with **React**, **FastAPI**, and **MongoDB**. Users can browse exams, select subjects and chapters, take timed quizzes in a WhatsApp-style chat interface, and view detailed results. Includes an analytics dashboard with real-time metrics.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Recharts, Lucide Icons |
| **Backend** | FastAPI, Uvicorn, Pydantic v2 |
| **Database** | MongoDB Atlas (Motor async driver) |
| **API Client** | Axios |

---

## 📁 Project Structure

```
skillbytes/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── pages/           # ExamsPage, SubjectsPage, ChaptersPage,
│   │   │                    # QuizPage, ResultsPage, AnalyticsDashboard
│   │   ├── layouts/         # AppLayout (shared navbar/wrapper)
│   │   ├── services/        # api.js (Axios HTTP client)
│   │   ├── App.jsx          # Router setup
│   │   └── index.css        # Tailwind v4 + custom styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # FastAPI Backend
│   ├── app/
│   │   ├── routes/          # quiz.py, analytics.py
│   │   ├── models/          # Pydantic models (User, Exam, Question, etc.)
│   │   ├── services/        # db_service.py (business logic + mock fallback)
│   │   ├── database/        # db.py (Motor client + collections)
│   │   ├── seed/            # seed.py (populate DB with sample data)
│   │   ├── config.py        # Settings from .env
│   │   └── main.py          # FastAPI app entry point
│   ├── requirements.txt
│   └── .env                 # MongoDB URI (not committed)
│
└── .gitignore
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.10+)
- **MongoDB Atlas** account (or local MongoDB instance)

### 1. Clone the Repository

```bash
git clone https://github.com/itsvickyl/skillbyte.git
cd skillbyte
```

### 2. Backend Setup

```bash
cd server

# Create and configure environment variables
# Create a .env file with:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0
# DATABASE_NAME=skillbytes_quiz

# Install dependencies
pip install -r requirements.txt

# Seed the database with sample data (optional but recommended)
python -m app.seed.seed

# Start the server
python -m uvicorn app.main:app --reload
```

The API server runs at `http://127.0.0.1:8000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend runs at `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/exams` | List all exams |
| `GET` | `/api/subjects/{examId}` | List subjects for an exam |
| `GET` | `/api/chapters/{subjectId}` | List chapters for a subject |
| `POST` | `/api/quiz/start` | Start a new quiz session |
| `GET` | `/api/quiz/question/{sessionId}` | Fetch next question |
| `POST` | `/api/quiz/answer` | Submit an answer |
| `POST` | `/api/quiz/finish` | Complete quiz and get score |
| `GET` | `/api/analytics` | Dashboard metrics |

---

## 🎮 User Flow

```
Browse Exams → Select Subject → Pick Chapter → Enter Name → Take Quiz → View Results
```

1. **Exams Page** — Browse available exam categories
2. **Subjects Page** — Select a subject within the exam
3. **Chapters Page** — Pick a chapter and enter your name to start
4. **Quiz Page** — Answer questions one-by-one in a WhatsApp-style chat UI
5. **Results Page** — View score, accuracy, and average response time
6. **Analytics Dashboard** — Platform-wide metrics (DAU/WAU, peak hours, drop-off rates, activity trends)

---

## 🧠 Key Features

- **WhatsApp-Style Quiz Interface** — Questions appear as chat bubbles with typing indicators
- **Smart Fallback** — If MongoDB is unavailable, the backend auto-seeds an in-memory database so the app always works
- **Real-Time Analytics** — DAU/WAU, completion rates, peak activity hours, chapter drop-off analysis
- **Response Time Tracking** — Timestamps when questions are shown and answered for performance analytics
- **Glassmorphism UI** — Modern design with smooth animations, custom scrollbars, and responsive layouts

---

## 📊 Database Collections

| Collection | Purpose |
|-----------|---------|
| `exams` | Exam categories |
| `subjects` | Subjects per exam |
| `chapters` | Chapters per subject |
| `questions` | MCQ questions (4 options each) |
| `users` | Registered usernames |
| `quiz_sessions` | Quiz attempt tracking |
| `responses` | Individual answer records with timing |

---

## 📝 Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0
DATABASE_NAME=skillbytes_quiz
```

> ⚠️ The `.env` file is excluded from version control via `.gitignore`

---

## 🛠️ Built By

**Vignesh** — [GitHub](https://github.com/itsvickyl)
