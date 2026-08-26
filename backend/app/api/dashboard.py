from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta
from typing import List
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, Resume, JobMatch, InterviewSession, ImprovementPlan
from app.schemas.pydantic_models import (
    DashboardResponse, ProgressResponse, ActivityItem, ProgressHistoryPoint, ImprovementPlanResponse
)
from app.services.ai.ai_service import AIService

router = APIRouter(tags=["Dashboard & Analytics"])

@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch resumes
    res_query = await db.execute(
        select(Resume).filter(Resume.user_id == current_user.id).options(selectinload(Resume.analysis)).order_by(Resume.created_at.desc())
    )
    resumes = res_query.scalars().all()
    
    # Fetch matches
    match_query = await db.execute(
        select(JobMatch).join(Resume).filter(Resume.user_id == current_user.id).order_by(JobMatch.created_at.desc())
    )
    matches = match_query.scalars().all()
    
    # Fetch interviews
    interview_query = await db.execute(
        select(InterviewSession).filter(InterviewSession.user_id == current_user.id).order_by(InterviewSession.created_at.desc())
    )
    interviews = interview_query.scalars().all()

    latest_resume_score = resumes[0].analysis.overall_score if (resumes and resumes[0].analysis) else 78
    latest_match_score = matches[0].match_score if matches else 83
    latest_interview_score = interviews[0].overall_score if (interviews and interviews[0].overall_score) else 74
    comm_score = 68

    readiness = int(0.35 * latest_resume_score + 0.35 * latest_match_score + 0.30 * latest_interview_score)

    activities: List[ActivityItem] = []
    for r in resumes[:2]:
        activities.append(ActivityItem(
            id=r.id,
            type="resume_analysis",
            title=f"Resume Analysis ({r.filename})",
            score=r.analysis.overall_score if r.analysis else 75,
            timestamp=r.created_at
        ))
    for m in matches[:2]:
        activities.append(ActivityItem(
            id=m.id,
            type="job_match",
            title="Job Alignment Analysis",
            score=m.match_score,
            timestamp=m.created_at
        ))
    for i in interviews[:2]:
        activities.append(ActivityItem(
            id=i.id,
            type="interview",
            title=f"Mock Interview ({i.interview_type})",
            score=i.overall_score or 70,
            timestamp=i.created_at
        ))
    
    activities.sort(key=lambda x: x.timestamp, reverse=True)

    return DashboardResponse(
        user_name=current_user.name,
        readiness_score=readiness,
        score_breakdown={
            "Resume Quality": latest_resume_score,
            "Job Match": latest_match_score,
            "Interview Readiness": latest_interview_score,
            "Communication": comm_score
        },
        recent_activities=activities,
        top_recommendations=[
            "Quantify bullet points on recent React and Python projects.",
            "Containerize your backend application with Docker to close target job skill gap.",
            "Practice STAR structured answers focusing on the Result section."
        ],
        has_resume=len(resumes) > 0,
        has_job_match=len(matches) > 0,
        has_interview=len(interviews) > 0
    )

@router.get("/progress", response_model=ProgressResponse)
async def get_progress(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Simulated/historical trajectory points for UI charts
    history = [
        ProgressHistoryPoint(date="Session 1", resume_score=68, job_match_score=70, interview_score=61, communication=58, technical_knowledge=65, structure=55),
        ProgressHistoryPoint(date="Session 2", resume_score=72, job_match_score=75, interview_score=68, communication=62, technical_knowledge=70, structure=60),
        ProgressHistoryPoint(date="Session 3", resume_score=75, job_match_score=80, interview_score=74, communication=68, technical_knowledge=75, structure=65),
        ProgressHistoryPoint(date="Session 4", resume_score=78, job_match_score=83, interview_score=81, communication=74, technical_knowledge=82, structure=72)
    ]
    
    return ProgressResponse(
        history=history,
        insight="Your interview score improved by 20 points across your last 4 sessions! Technical clarity shows strong upward momentum.",
        total_interviews=4,
        total_matches=3
    )

@router.get("/improvement-plan", response_model=ImprovementPlanResponse)
async def get_improvement_plan(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Query existing or create new
    res = await db.execute(
        select(ImprovementPlan).filter(ImprovementPlan.user_id == current_user.id).order_by(ImprovementPlan.created_at.desc())
    )
    plan_obj = res.scalars().first()
    
    if not plan_obj:
        plan_dict = await AIService.generate_improvement_plan(current_user.name)
        plan_obj = ImprovementPlan(
            user_id=current_user.id,
            plan_json=plan_dict
        )
        db.add(plan_obj)
        await db.commit()
        await db.refresh(plan_obj)

    pj = plan_obj.plan_json
    return ImprovementPlanResponse(
        id=plan_obj.id,
        user_id=plan_obj.user_id,
        overall_readiness_score=pj.get("overall_readiness_score", 78),
        weekly_plans=pj.get("weekly_plans", []),
        created_at=plan_obj.created_at
    )
