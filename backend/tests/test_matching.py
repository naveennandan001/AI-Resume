import pytest
from app.services.ai.ai_service import AIService

@pytest.mark.asyncio
async def test_job_match_service():
    resume = "Skills: Python, SQL, React, Git. Experience in REST APIs."
    job = "Requirements: Python, React, SQL, Docker, AWS EC2."
    
    match_result = await AIService.match_job_description(resume, job)
    assert "match_score" in match_result
    assert match_result["match_score"] > 0
    assert "strong_matches" in match_result
    assert "missing_skills" in match_result
    assert "skill_gaps" in match_result
