from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import User, Resume, ResumeAnalysis
from app.schemas.pydantic_models import (
    ResumeResponse, ResumeAnalysisResponse, SectionImprovementRequest, SectionImprovementResponse
)
from app.services.resume_parser import ResumeParserService
from app.services.ai.ai_service import AIService

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")
    
    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="File is empty")
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    
    raw_text = ResumeParserService.extract_text(file_bytes, file.filename)
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract readable text from resume")
    
    structured_data = ResumeParserService.parse_structure_heuristics(raw_text)
    
    # Create DB resume
    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        raw_text=raw_text,
        structured_data=structured_data
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)
    
    # Automatically generate initial analysis
    analysis_dict = await AIService.analyze_resume(raw_text)
    analysis = ResumeAnalysis(
        resume_id=resume.id,
        overall_score=analysis_dict.get("overall_score", 75),
        analysis_json=analysis_dict
    )
    db.add(analysis)
    await db.commit()
    
    # Reload with analysis relationship
    result = await db.execute(
        select(Resume).filter(Resume.id == resume.id).options(selectinload(Resume.analysis))
    )
    resume_obj = result.scalars().first()
    
    return ResumeResponse(
        id=resume_obj.id,
        filename=resume_obj.filename,
        raw_text=resume_obj.raw_text,
        structured_data=resume_obj.structured_data,
        created_at=resume_obj.created_at,
        analysis=ResumeAnalysisResponse(**resume_obj.analysis.analysis_json) if resume_obj.analysis else None
    )

@router.get("", response_model=List[ResumeResponse])
async def list_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Resume)
        .filter(Resume.user_id == current_user.id)
        .options(selectinload(Resume.analysis))
        .order_by(Resume.created_at.desc())
    )
    resumes = result.scalars().all()
    
    response_list = []
    for r in resumes:
        analysis_resp = ResumeAnalysisResponse(**r.analysis.analysis_json) if r.analysis else None
        response_list.append(
            ResumeResponse(
                id=r.id,
                filename=r.filename,
                raw_text=r.raw_text,
                structured_data=r.structured_data,
                created_at=r.created_at,
                analysis=analysis_resp
            )
        )
    return response_list

@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == current_user.id)
        .options(selectinload(Resume.analysis))
    )
    r = result.scalars().first()
    if not r:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    analysis_resp = ResumeAnalysisResponse(**r.analysis.analysis_json) if r.analysis else None
    return ResumeResponse(
        id=r.id,
        filename=r.filename,
        raw_text=r.raw_text,
        structured_data=r.structured_data,
        created_at=r.created_at,
        analysis=analysis_resp
    )

@router.post("/{resume_id}/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume_endpoint(
    resume_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    analysis_dict = await AIService.analyze_resume(resume.raw_text)
    
    # Update or insert analysis
    res_analysis = await db.execute(select(ResumeAnalysis).filter(ResumeAnalysis.resume_id == resume.id))
    existing = res_analysis.scalars().first()
    
    if existing:
        existing.overall_score = analysis_dict.get("overall_score", 75)
        existing.analysis_json = analysis_dict
    else:
        existing = ResumeAnalysis(
            resume_id=resume.id,
            overall_score=analysis_dict.get("overall_score", 75),
            analysis_json=analysis_dict
        )
        db.add(existing)
    
    await db.commit()
    return ResumeAnalysisResponse(**analysis_dict)

@router.post("/{resume_id}/improve", response_model=SectionImprovementResponse)
async def improve_resume_section_endpoint(
    resume_id: str,
    req: SectionImprovementRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id)
    )
    resume = result.scalars().first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    improved_dict = await AIService.improve_section(req.section_name, req.original_text)
    return SectionImprovementResponse(**improved_dict)
