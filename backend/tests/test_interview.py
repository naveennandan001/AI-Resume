import pytest
from app.services.ai.ai_service import AIService

@pytest.mark.asyncio
async def test_interview_question_generator():
    resume = "Python, React"
    job = "Software Engineer"
    questions = await AIService.generate_interview_questions(resume, job, "Technical", "Intermediate", 3)
    assert len(questions) == 3
    assert "question_text" in questions[0]

@pytest.mark.asyncio
async def test_answer_evaluation_star():
    question = "Describe a time you solved a difficult performance bug."
    answer = "In my React app, page load took 3 seconds. I implemented lazy loading and reduced render time by 60%."
    
    eval_res = await AIService.evaluate_answer(question, answer)
    assert "overall_answer_score" in eval_res
    assert "star_breakdown" in eval_res
    assert eval_res["star_breakdown"]["result"] == "Present"
