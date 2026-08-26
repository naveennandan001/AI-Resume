import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    job_descriptions = relationship("JobDescription", back_populates="user", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    improvement_plans = relationship("ImprovementPlan", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    raw_text = Column(Text, nullable=False)
    structured_data = Column(JSON, nullable=True)  # parsed sections: skills, education, experience, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resumes")
    analysis = relationship("ResumeAnalysis", back_populates="resume", uselist=False, cascade="all, delete-orphan")
    job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="resume", cascade="all, delete-orphan")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=False, unique=True)
    overall_score = Column(Integer, nullable=False, default=70)
    analysis_json = Column(JSON, nullable=False)  # breakdown of categories, weaknesses, suggestions
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="analysis")

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False, default="Target Company")
    description = Column(Text, nullable=False)
    parsed_data = Column(JSON, nullable=True)  # required_skills, preferred_skills, responsibilities, etc.
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="job_descriptions")
    job_matches = relationship("JobMatch", back_populates="job_description", cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="job_description", cascade="all, delete-orphan")

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=False)
    job_description_id = Column(String(36), ForeignKey("job_descriptions.id"), nullable=False)
    match_score = Column(Integer, nullable=False, default=75)
    analysis_json = Column(JSON, nullable=False)  # strong, partial, missing skills, category match breakdown
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="job_matches")
    job_description = relationship("JobDescription", back_populates="job_matches")

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    job_description_id = Column(String(36), ForeignKey("job_descriptions.id"), nullable=True)
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=True)
    interview_type = Column(String(50), nullable=False, default="Technical")  # Technical, HR, Behavioral, Project-based, Mixed
    difficulty = Column(String(50), nullable=False, default="Intermediate")   # Beginner, Intermediate, Advanced
    overall_score = Column(Integer, nullable=True, default=0)
    status = Column(String(50), nullable=False, default="in_progress")        # in_progress, completed
    summary_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interview_sessions")
    resume = relationship("Resume", back_populates="interview_sessions")
    job_description = relationship("JobDescription", back_populates="interview_sessions")
    questions = relationship("InterviewQuestion", back_populates="session", cascade="all, delete-orphan", order_by="InterviewQuestion.sequence")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("interview_sessions.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), nullable=False, default="Behavioral")
    sequence = Column(Integer, nullable=False, default=1)
    
    session = relationship("InterviewSession", back_populates="questions")
    answers = relationship("InterviewAnswer", back_populates="question", cascade="all, delete-orphan")

class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    question_id = Column(String(36), ForeignKey("interview_questions.id"), nullable=False)
    answer_text = Column(Text, nullable=False)
    transcript = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("InterviewQuestion", back_populates="answers")
    feedback = relationship("InterviewFeedback", back_populates="answer", uselist=False, cascade="all, delete-orphan")

class InterviewFeedback(Base):
    __tablename__ = "interview_feedback"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    answer_id = Column(String(36), ForeignKey("interview_answers.id"), nullable=False, unique=True)
    relevance = Column(Integer, nullable=False, default=7)
    accuracy = Column(Integer, nullable=False, default=7)
    clarity = Column(Integer, nullable=False, default=7)
    structure = Column(Integer, nullable=False, default=7)
    completeness = Column(Integer, nullable=False, default=7)
    feedback_json = Column(JSON, nullable=False)  # what went well, needs improvement, STAR breakdown, model answer
    created_at = Column(DateTime, default=datetime.utcnow)

    answer = relationship("InterviewAnswer", back_populates="feedback")

class ImprovementPlan(Base):
    __tablename__ = "improvement_plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    plan_json = Column(JSON, nullable=False)  # week 1, week 2, week 3 priorities and tasks
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="improvement_plans")
