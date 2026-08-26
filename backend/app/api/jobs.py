from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, Resume, JobDescription, JobMatch
from app.schemas.pydantic_models import (
    JobDescriptionCreate, JobDescriptionResponse, JobMatchResponse, TailorResumeRequest, TailoredSuggestionsResponse
)
from app.services.ai.ai_service import AIService

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("", response_model=JobDescriptionResponse)
async def create_job_description(
    job_in: JobDescriptionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    job = JobDescription(
        user_id=current_user.id,
        title=job_in.title,
        company=job_in.company,
        description=job_in.description,
        parsed_data={
            "title": job_in.title,
            "company": job_in.company,
            "skills_extracted": ["Python", "SQL", "React", "Docker", "AWS"]
        }
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return JobDescriptionResponse.model_validate(job)

@router.get("", response_model=List[JobDescriptionResponse])
async def list_jobs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(JobDescription)
        .filter(JobDescription.user_id == current_user.id)
        .order_by(JobDescription.created_at.desc())
    )
    jobs = result.scalars().all()
    return [JobDescriptionResponse.model_validate(j) for j in jobs]

@router.post("/{job_id}/match", response_model=JobMatchResponse)
async def match_job_to_resume(
    job_id: str,
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch job & resume
    job_res = await db.execute(
        select(JobDescription).filter(JobDescription.id == job_id, JobDescription.user_id == current_user.id)
    )
    job = job_res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    resume_res = await db.execute(
        select(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = resume_res.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Generate match using AI service
    match_dict = await AIService.match_job_description(resume.raw_text, job.description)
    
    job_match = JobMatch(
        resume_id=resume.id,
        job_description_id=job.id,
        match_score=match_dict.get("match_score", 80),
        analysis_json=match_dict
    )
    db.add(job_match)
    await db.commit()
    await db.refresh(job_match)
    
    return JobMatchResponse(
        id=job_match.id,
        resume_id=job_match.resume_id,
        job_description_id=job_match.job_description_id,
        match_score=job_match.match_score,
        category_scores=match_dict.get("category_scores", {}),
        strong_matches=match_dict.get("strong_matches", []),
        partial_matches=match_dict.get("partial_matches", []),
        missing_skills=match_dict.get("missing_skills", []),
        skill_gaps=match_dict.get("skill_gaps", []),
        created_at=job_match.created_at
    )

@router.post("/{job_id}/tailor", response_model=TailoredSuggestionsResponse)
async def tailor_resume_endpoint(
    job_id: str,
    req: TailorResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    job_res = await db.execute(
        select(JobDescription).filter(JobDescription.id == job_id, JobDescription.user_id == current_user.id)
    )
    job = job_res.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job description not found")
    
    resume_res = await db.execute(
        select(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id)
    )
    resume = resume_res.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    tailored = await AIService.tailor_resume(resume.raw_text, job.description)
    return TailoredSuggestionsResponse(**tailored)
