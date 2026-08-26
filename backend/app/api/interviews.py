from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.domain import (
    User, Resume, JobDescription, InterviewSession, InterviewQuestion, InterviewAnswer, InterviewFeedback
)
from app.schemas.pydantic_models import (
    InterviewSessionCreate, InterviewSessionResponse, InterviewQuestionResponse,
    InterviewAnswerSubmit, InterviewFeedbackResponse, NextQuestionResponse, InterviewSummaryResponse
)
from app.services.ai.ai_service import AIService

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.post("", response_model=InterviewSessionResponse)
async def create_interview_session(
    sess_in: InterviewSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    resume_text = "Software engineering student with Python and React skills."
    job_text = "Software Engineer position requiring Python, SQL, React, and Docker."
    
    if sess_in.resume_id:
        res = await db.execute(select(Resume).filter(Resume.id == sess_in.resume_id, Resume.user_id == current_user.id))
        resume_obj = res.scalars().first()
        if resume_obj:
            resume_text = resume_obj.raw_text
            
    if sess_in.job_description_id:
        j_res = await db.execute(select(JobDescription).filter(JobDescription.id == sess_in.job_description_id, JobDescription.user_id == current_user.id))
        job_obj = j_res.scalars().first()
        if job_obj:
            job_text = job_obj.description

    # Generate questions with AI service
    questions_data = await AIService.generate_interview_questions(
        resume_text=resume_text,
        job_text=job_text,
        interview_type=sess_in.interview_type,
        difficulty=sess_in.difficulty,
        num_questions=sess_in.num_questions
    )

    session = InterviewSession(
        user_id=current_user.id,
        resume_id=sess_in.resume_id,
        job_description_id=sess_in.job_description_id,
        interview_type=sess_in.interview_type,
        difficulty=sess_in.difficulty,
        status="in_progress"
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    # Add questions
    for idx, q in enumerate(questions_data, start=1):
        q_obj = InterviewQuestion(
            session_id=session.id,
            question_text=q.get("question_text", "Describe a challenging technical problem you solved."),
            question_type=q.get("question_type", sess_in.interview_type),
            sequence=idx
        )
        db.add(q_obj)
    await db.commit()

    # Query with questions
    res = await db.execute(
        select(InterviewSession)
        .filter(InterviewSession.id == session.id)
        .options(selectinload(InterviewSession.questions))
    )
    session_loaded = res.scalars().first()

    return InterviewSessionResponse(
        id=session_loaded.id,
        interview_type=session_loaded.interview_type,
        difficulty=session_loaded.difficulty,
        overall_score=session_loaded.overall_score or 0,
        status=session_loaded.status,
        questions=[
            InterviewQuestionResponse(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                sequence=q.sequence
            ) for q in session_loaded.questions
        ],
        current_question_index=0,
        created_at=session_loaded.created_at
    )

@router.get("", response_model=List[InterviewSessionResponse])
async def list_interviews(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id)
        .options(selectinload(InterviewSession.questions))
        .order_by(InterviewSession.created_at.desc())
    )
    sessions = res.scalars().all()
    
    out = []
    for s in sessions:
        out.append(
            InterviewSessionResponse(
                id=s.id,
                interview_type=s.interview_type,
                difficulty=s.difficulty,
                overall_score=s.overall_score or 0,
                status=s.status,
                questions=[
                    InterviewQuestionResponse(
                        id=q.id,
                        question_text=q.question_text,
                        question_type=q.question_type,
                        sequence=q.sequence
                    ) for q in s.questions
                ],
                current_question_index=0,
                created_at=s.created_at
            )
        )
    return out

@router.get("/{session_id}", response_model=InterviewSessionResponse)
async def get_interview_session(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .options(selectinload(InterviewSession.questions))
    )
    s = res.scalars().first()
    if not s:
        raise HTTPException(status_code=404, detail="Interview session not found")

    return InterviewSessionResponse(
        id=s.id,
        interview_type=s.interview_type,
        difficulty=s.difficulty,
        overall_score=s.overall_score or 0,
        status=s.status,
        questions=[
            InterviewQuestionResponse(
                id=q.id,
                question_text=q.question_text,
                question_type=q.question_type,
                sequence=q.sequence
            ) for q in s.questions
        ],
        current_question_index=0,
        created_at=s.created_at
    )

@router.post("/{session_id}/answer", response_model=InterviewFeedbackResponse)
async def submit_answer(
    session_id: str,
    ans_in: InterviewAnswerSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch question
    q_res = await db.execute(
        select(InterviewQuestion).filter(InterviewQuestion.id == ans_in.question_id)
    )
    question = q_res.scalars().first()
    if not question:
        raise HTTPException(status_code=404, detail="Interview question not found")

    # Create answer entry
    ans_obj = InterviewAnswer(
        question_id=question.id,
        answer_text=ans_in.answer_text,
        transcript=ans_in.transcript or ans_in.answer_text
    )
    db.add(ans_obj)
    await db.commit()
    await db.refresh(ans_obj)

    # Evaluate answer with AI engine
    eval_dict = await AIService.evaluate_answer(question.question_text, ans_in.answer_text)

    feedback = InterviewFeedback(
        answer_id=ans_obj.id,
        relevance=eval_dict.get("relevance", 7),
        accuracy=eval_dict.get("accuracy", 7),
        clarity=eval_dict.get("clarity", 7),
        structure=eval_dict.get("structure", 7),
        completeness=eval_dict.get("completeness", 7),
        feedback_json=eval_dict
    )
    db.add(feedback)
    await db.commit()
    await db.refresh(feedback)

    return InterviewFeedbackResponse(
        id=feedback.id,
        answer_id=feedback.answer_id,
        relevance=feedback.relevance,
        accuracy=feedback.accuracy,
        clarity=feedback.clarity,
        structure=feedback.structure,
        completeness=feedback.completeness,
        overall_answer_score=eval_dict.get("overall_answer_score", 72),
        what_did_well=eval_dict.get("what_did_well", []),
        needs_improvement=eval_dict.get("needs_improvement", []),
        star_breakdown=eval_dict.get("star_breakdown"),
        better_answer_structure=eval_dict.get("better_answer_structure", ""),
        suggested_model_answer=eval_dict.get("suggested_model_answer", "")
    )

@router.post("/{session_id}/finish", response_model=InterviewSummaryResponse)
async def finish_interview(
    session_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    s_res = await db.execute(
        select(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .options(selectinload(InterviewSession.questions).selectinload(InterviewQuestion.answers).selectinload(InterviewAnswer.feedback))
    )
    session = s_res.scalars().first()
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")

    feedbacks = []
    for q in session.questions:
        for a in q.answers:
            if a.feedback:
                feedbacks.append(a.feedback.feedback_json)

    summary_dict = await AIService.generate_interview_summary(session.id, feedbacks)

    session.status = "completed"
    session.overall_score = summary_dict.get("overall_score", 74)
    session.summary_json = summary_dict
    await db.commit()

    return InterviewSummaryResponse(**summary_dict)
