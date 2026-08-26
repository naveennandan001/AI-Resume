from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, Resume, ResumeAnalysis, JobDescription, JobMatch, InterviewSession, InterviewQuestion, InterviewAnswer, InterviewFeedback
from app.services.ai.ai_service import AIService

router = APIRouter(prefix="/demo", tags=["Demo"])

SAMPLE_RESUME_TEXT = """
ALEX CHEN
San Francisco, CA | alex.chen@example.com | github.com/alexchen | linkedin.com/in/alexchen

SUMMARY
Passionate Computer Science senior graduating in May 2026. Skilled in full-stack software development with Python, React, TypeScript, and SQL. Experienced in designing REST APIs and building modern web applications.

SKILLS
- Languages: Python, JavaScript, TypeScript, SQL, HTML/CSS
- Frameworks & Libraries: React, Node.js, FastAPI, Express, Tailwind CSS
- Databases & Tools: PostgreSQL, SQLite, Git, GitHub, RESTful APIs

PROJECTS
AI Resume & Interview Coach | Python, FastAPI, React, PostgreSQL
- Built an interactive web platform that analyzes candidate resumes against job specifications.
- Implemented automated feedback generation and mock interview simulation.
- Designed responsive front-end UI using React and Tailwind CSS.

E-Commerce Platform | React, Node.js, MongoDB
- Developed full-stack shopping cart system with user authentication and order management.
- Integrated payment processing API for real-time sandbox transaction testing.

EDUCATION
B.S. in Computer Science | California State University, Expected May 2026
GPA: 3.8 / 4.0
"""

SAMPLE_JOB_TITLE = "Software Engineer (Full-Stack)"
SAMPLE_JOB_COMPANY = "TechCorp Solutions"
SAMPLE_JOB_DESC = """
TechCorp Solutions is seeking a Full-Stack Software Engineer to join our core products team.

Key Responsibilities:
- Design, build, and maintain efficient RESTful APIs using Python (FastAPI or Django) and PostgreSQL.
- Develop interactive user interfaces using React and modern CSS frameworks.
- Containerize services using Docker and deploy applications onto cloud infrastructure (AWS EC2 / S3).
- Participate in agile sprint planning and code reviews.

Requirements:
- Strong proficiency in Python, JavaScript/TypeScript, and React.
- Solid understanding of SQL and relational database design.
- Hands-on experience with Docker containerization and AWS cloud services.
- Excellent communication skills and problem-solving mindset.
"""

@router.post("/seed")
async def seed_demo_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Seed sample candidate resume, job description, job match, and mock interview session."""
    
    # 1. Create or fetch Sample Resume
    res_query = await db.execute(select(Resume).filter(Resume.user_id == current_user.id))
    existing_resumes = res_query.scalars().all()
    
    if not existing_resumes:
        resume = Resume(
            user_id=current_user.id,
            filename="Alex_Chen_Resume_2026.pdf",
            raw_text=SAMPLE_RESUME_TEXT,
            structured_data={
                "name": "Alex Chen",
                "email": "alex.chen@example.com",
                "skills": ["Python", "JavaScript", "TypeScript", "React", "SQL", "FastAPI", "Git"],
                "education": [{"degree": "B.S. Computer Science", "institution": "State University"}],
                "projects": [{"name": "AI Resume Coach", "tech": "Python, React"}]
            }
        )
        db.add(resume)
        await db.commit()
        await db.refresh(resume)

        # Resume Analysis
        analysis_data = await AIService.analyze_resume(SAMPLE_RESUME_TEXT)
        analysis = ResumeAnalysis(
            resume_id=resume.id,
            overall_score=analysis_data.get("overall_score", 78),
            analysis_json=analysis_data
        )
        db.add(analysis)
        await db.commit()
    else:
        resume = existing_resumes[0]

    # 2. Create or fetch Sample Job
    job_query = await db.execute(select(JobDescription).filter(JobDescription.user_id == current_user.id))
    existing_jobs = job_query.scalars().all()
    
    if not existing_jobs:
        job = JobDescription(
            user_id=current_user.id,
            title=SAMPLE_JOB_TITLE,
            company=SAMPLE_JOB_COMPANY,
            description=SAMPLE_JOB_DESC,
            parsed_data={"title": SAMPLE_JOB_TITLE, "company": SAMPLE_JOB_COMPANY}
        )
        db.add(job)
        await db.commit()
        await db.refresh(job)

        # Job Match
        match_data = await AIService.match_job_description(SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESC)
        job_match = JobMatch(
            resume_id=resume.id,
            job_description_id=job.id,
            match_score=83,
            analysis_json=match_data
        )
        db.add(job_match)
        await db.commit()
    else:
        job = existing_jobs[0]

    # 3. Create sample interview session if not exists
    int_query = await db.execute(select(InterviewSession).filter(InterviewSession.user_id == current_user.id))
    existing_interviews = int_query.scalars().all()

    if not existing_interviews:
        interview = InterviewSession(
            user_id=current_user.id,
            resume_id=resume.id,
            job_description_id=job.id,
            interview_type="Technical",
            difficulty="Intermediate",
            status="completed",
            overall_score=78,
            summary_json={
                "session_id": "demo-session-id",
                "overall_score": 78,
                "category_scores": {"technical_knowledge": 82, "communication": 74, "structure": 68, "relevance": 85},
                "top_strengths": ["Clear explanation of React & FastAPI architecture", "Strong SQL knowledge"],
                "biggest_weaknesses": ["Missing STAR results in behavioral response"],
                "struggled_questions": ["Docker & Cloud containerization workflow"],
                "recommended_practice_areas": ["STAR Method Results framing", "Docker multi-stage builds"],
                "next_interview_focus": "Practice framing project results with metrics."
            }
        )
        db.add(interview)
        await db.commit()
        await db.refresh(interview)

        # Questions & Answers
        q1 = InterviewQuestion(
            session_id=interview.id,
            question_text="Your resume mentions an AI Resume Coach project with React and Python. Explain one technical issue you encountered and how you solved it.",
            question_type="Technical",
            sequence=1
        )
        db.add(q1)
        await db.commit()
        await db.refresh(q1)

        ans1 = InterviewAnswer(
            question_id=q1.id,
            answer_text="When building the backend API in FastAPI, large PDF uploads caused parsing timeouts. I refactored text extraction to run asynchronously and added structured JSON output caching, which improved response latency.",
            transcript="When building the backend API in FastAPI, large PDF uploads caused parsing timeouts..."
        )
        db.add(ans1)
        await db.commit()
        await db.refresh(ans1)

        fb1 = InterviewFeedback(
            answer_id=ans1.id,
            relevance=9, accuracy=8, clarity=8, structure=7, completeness=7,
            feedback_json={
                "overall_answer_score": 78,
                "what_did_well": ["Directly addressed the technical issue", "Explained FastAPI refactoring clearly"],
                "needs_improvement": ["Quantify exact latency improvement percentage"],
                "star_breakdown": {"situation": "Present", "task": "Present", "action": "Present", "result": "Weak"},
                "better_answer_structure": "Situation -> Task -> Action -> Result (with metrics)",
                "suggested_model_answer": "Large PDF uploads took >3s to parse (Situation). I was tasked with bringing load time under 800ms (Task). I introduced async processing and cached extracted embeddings in Redis (Action), reducing processing time by 75% (Result)."
            }
        )
        db.add(fb1)
        await db.commit()

    return {"message": "Demo data successfully seeded for judge evaluation!", "resume_id": resume.id, "job_id": job.id}
