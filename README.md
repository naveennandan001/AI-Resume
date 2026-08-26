# 🚀 AI-Powered Resume & Interview Coach

Production-quality full-stack career platform designed to help job seekers, fresh graduates, and career changers analyze their resume, match against job descriptions, detect skill gaps, tailor resume content, conduct interactive text/voice AI mock interviews, and follow a personalized week-by-week improvement plan.

---

## 🎯 Product Vision

> **“Understand the candidate. Understand the job. Identify the gap. Coach the candidate to close the gap.”**

---

## 🌟 Key Features

1. **AI Resume Analysis**: Upload PDF, DOCX, or TXT resumes for instant text extraction and multi-category scoring (Structure, Content, Skills, Experience, Projects, Achievements, Keywords, Clarity).
2. **Resume Weakness Detection**: Detects generic action verbs, missing metrics, formatting issues, and repeated skills without fabricating fake experience.
3. **Job-to-Resume Matching Engine**: Paste target job postings to generate an instant match score (e.g., **83%**), category breakdown, and strong vs missing skill chips.
4. **Skill Gap Analysis & Learning Resources**: Categorizes missing skills (Docker, AWS, Kubernetes) with priority badges, learning resources, and suggested hands-on mini-projects.
5. **AI Resume Section Improvement & Tailoring**: Side-by-side comparison of original vs AI-improved bullet points with "Why it's better" explanations and metric suggestions.
6. **Interactive AI Mock Interview**: Customized technical & behavioral question generation based on the candidate's resume and target job requirements. Supports both **Text** and **Voice Audio Microphone Recording** (Web Speech API).
7. **Instant Answer Evaluation & STAR Method Coaching**: Answer-level scoring (Relevance, Accuracy, Clarity, Structure, Completeness) with automated STAR method checklist indicators.
8. **Interview Summary & Targeted Practice**: Session breakdown with a one-click **“Practice Weak Areas”** button.
9. **Personalized Career Improvement Plan**: Actionable 3-week roadmap with high, medium, and low priority tasks.
10. **Progress Analytics**: Track performance metrics across sessions using interactive Recharts charts.
11. **Hackathon Judge Demo Mode**: One-click **"Try Demo"** pre-loads sample candidate data for instant end-to-end evaluation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS + Tailwind CSS + Glassmorphism aesthetic
- **Icons**: Lucide React
- **Charts**: Recharts
- **Routing**: React Router v6

### Backend
- **Framework**: Python 3.11 + FastAPI + Uvicorn
- **ORM & DB**: SQLAlchemy 2.0 Async + SQLite (Zero-config fallback) & PostgreSQL support
- **Auth**: JWT tokens + bcrypt password hashing + Quick Judge Demo route
- **Resume Parsing**: `pypdf`, `python-docx`
- **AI Service Abstraction**: OpenAI / LLM API integration with built-in Smart Local AI Fallback Engine for zero-API-key hackathon demos.

---

## 📁 Project Structure

```text
AI-Resume/
├── backend/
│   ├── app/
│   │   ├── api/          # Auth, Resumes, Jobs, Interviews, Dashboard, Demo routers
│   │   ├── core/         # Config, Security, Database connection
│   │   ├── models/       # SQLAlchemy domain models (User, Resume, JobMatch, Interview, etc.)
│   │   ├── schemas/      # Pydantic request/response models
│   │   ├── services/     # AI service abstraction & Resume parser
│   │   └── main.py       # FastAPI application entrypoint
│   ├── tests/            # Pytest suite (Auth, Resume, Matching, Interview)
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, NextStepBanner, Cards
│   │   ├── context/      # AuthContext, AppContext
│   │   ├── pages/        # Landing, Login, Dashboard, Resume, JobMatch, Interview, etc.
│   │   ├── services/     # Axios client & Web Speech Audio helper
│   │   ├── types/        # TypeScript type interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚦 Quick Start Guide

### Option 1: Docker Compose (Recommended)

Run the entire platform (PostgreSQL DB, FastAPI Backend, React Frontend) with a single command:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:3000`
- **Backend API Docs**: `http://localhost:8000/docs`

---

### Option 2: Local Development Setup

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

Run backend pytest unit suites covering auth, resume parsing, job matching, and interview evaluation:

```bash
cd backend
python -m pytest tests/
```

---

## 🎬 3-Minute Live Hackathon Demo Walkthrough

1. **Step 1**: Open the app and click **"Try Demo"** on the landing page or login screen.
2. **Step 2**: The **Dashboard** loads displaying a **78/100 Career Readiness Score**.
3. **Step 3**: Click **"Analyze Resume"** -> View extracted sections, overall score (78/100), and detected weaknesses.
4. **Step 4**: Click **"Match a Job"** -> Paste target Software Engineer job description.
5. **Step 5**: View the **83% Job Match Score** and missing skill chips (**Docker, AWS, Kubernetes**).
6. **Step 6**: Click **"Tailor Resume"** -> View AI-suggested summary and bullet optimization (with review notice).
7. **Step 7**: Click **"Start Mock Interview"** -> Select Technical focus & Intermediate difficulty.
8. **Step 8**: Practice answering via **Text** or click the **Microphone** to record voice.
9. **Step 9**: Click **"Submit Answer"** -> Inspect answer score (74/100), STAR method status check, and model answer.
10. **Step 10**: Click **"Finish Interview"** -> View overall interview evaluation summary.
11. **Step 11**: Click **"Practice Weak Areas"** -> Launch targeted drill session.
12. **Step 12**: View the generated **3-Week Career Improvement Plan** and progress trajectory charts.

---

## 🔮 Future Scope
- LinkedIn profile & GitHub repo automated import
- Video emotion and eye-contact feedback analysis
- Company-specific interview question packs (FAANG, Startups)
- Live coding whiteboard sandbox
