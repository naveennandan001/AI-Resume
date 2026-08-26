from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Resume Schemas ---
class StructuredResume(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = []
    experience: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    certifications: List[str] = []
    achievements: List[str] = []

class CategoryScore(BaseModel):
    score: float
    explanation: str
    problems: List[str] = []
    suggestions: List[str] = []

class ResumeAnalysisResponse(BaseModel):
    overall_score: int
    categories: Dict[str, CategoryScore]
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    detected_issues: List[str] = []

class ResumeResponse(BaseModel):
    id: str
    filename: str
    raw_text: str
    structured_data: Optional[StructuredResume] = None
    created_at: datetime
    analysis: Optional[ResumeAnalysisResponse] = None

    class Config:
        from_attributes = True

class SectionImprovementRequest(BaseModel):
    section_name: str  # summary, experience, project, skills, achievements
    original_text: str

class SectionImprovementResponse(BaseModel):
    section_name: str
    original_text: str
    improved_text: str
    why_better: List[str]
    suggested_metrics_to_add: List[str] = []

# --- Job Match Schemas ---
class JobDescriptionCreate(BaseModel):
    title: str
    company: str = "Target Company"
    description: str

class JobDescriptionResponse(BaseModel):
    id: str
    title: str
    company: str
    description: str
    parsed_data: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SkillGapItem(BaseModel):
    skill: str
    why_it_matters: str
    priority: str  # High, Medium, Low
    learning_resources: List[str]
    suggested_mini_project: str

class JobMatchResponse(BaseModel):
    id: str
    resume_id: str
    job_description_id: str
    match_score: int
    category_scores: Dict[str, int]
    strong_matches: List[str]
    partial_matches: List[str]
    missing_skills: List[str]
    skill_gaps: List[SkillGapItem]
    created_at: datetime

class TailorResumeRequest(BaseModel):
    resume_id: str
    job_description_id: str

class TailoredSuggestionsResponse(BaseModel):
    tailored_summary: str
    skills_reordering: List[str]
    improved_bullets: List[Dict[str, str]]
    recommended_keywords: List[str]
    note: str = "AI suggestions should be reviewed before submission."

# --- Interview Schemas ---
class InterviewSessionCreate(BaseModel):
    resume_id: Optional[str] = None
    job_description_id: Optional[str] = None
    interview_type: str = "Technical"  # Technical, HR, Behavioral, Project-based, Mixed
    difficulty: str = "Intermediate"    # Beginner, Intermediate, Advanced
    num_questions: int = 5

class InterviewQuestionResponse(BaseModel):
    id: str
    question_text: str
    question_type: str
    sequence: int

class InterviewSessionResponse(BaseModel):
    id: str
    interview_type: str
    difficulty: str
    overall_score: Optional[int] = 0
    status: str
    questions: List[InterviewQuestionResponse]
    current_question_index: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

class InterviewAnswerSubmit(BaseModel):
    question_id: str
    answer_text: str
    transcript: Optional[str] = None

class StarBreakdown(BaseModel):
    situation: str  # Present, Weak, Missing
    task: str
    action: str
    result: str

class InterviewFeedbackResponse(BaseModel):
    id: str
    answer_id: str
    relevance: int
    accuracy: int
    clarity: int
    structure: int
    completeness: int
    overall_answer_score: int
    what_did_well: List[str]
    needs_improvement: List[str]
    star_breakdown: Optional[StarBreakdown] = None
    better_answer_structure: str
    suggested_model_answer: str

class NextQuestionResponse(BaseModel):
    session_id: str
    question: Optional[InterviewQuestionResponse] = None
    is_completed: bool = False
    follow_up_note: Optional[str] = None

class InterviewSummaryResponse(BaseModel):
    session_id: str
    overall_score: int
    category_scores: Dict[str, int]
    top_strengths: List[str]
    biggest_weaknesses: List[str]
    struggled_questions: List[str]
    recommended_practice_areas: List[str]
    next_interview_focus: str

# --- Improvement Plan Schemas ---
class ImprovementPlanTask(BaseModel):
    task: str
    category: str
    priority: str

class WeeklyPlan(BaseModel):
    week: int
    title: str
    tasks: List[ImprovementPlanTask]

class ImprovementPlanResponse(BaseModel):
    id: str
    user_id: str
    overall_readiness_score: int
    weekly_plans: List[WeeklyPlan]
    created_at: datetime

# --- Dashboard & Progress Schemas ---
class ActivityItem(BaseModel):
    id: str
    type: str  # resume_analysis, job_match, interview
    title: str
    score: int
    timestamp: datetime

class DashboardResponse(BaseModel):
    user_name: str
    readiness_score: int
    score_breakdown: Dict[str, int]  # Resume Quality, Job Match, Interview Readiness, Communication
    recent_activities: List[ActivityItem]
    top_recommendations: List[str]
    has_resume: bool
    has_job_match: bool
    has_interview: bool

class ProgressHistoryPoint(BaseModel):
    date: str
    resume_score: int
    job_match_score: int
    interview_score: int
    communication: int
    technical_knowledge: int
    structure: int

class ProgressResponse(BaseModel):
    history: List[ProgressHistoryPoint]
    insight: str
    total_interviews: int
    total_matches: int
