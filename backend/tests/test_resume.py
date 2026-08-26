import pytest
from app.services.resume_parser import ResumeParserService
from app.services.ai.ai_service import AIService

@pytest.mark.asyncio
async def test_resume_parser_heuristics():
    raw_text = """
    Alex Chen
    alex.chen@example.com | (555) 123-4567
    
    SKILLS
    Python, React, SQL, Git, FastAPI
    """
    struct = ResumeParserService.parse_structure_heuristics(raw_text)
    assert struct["name"] == "Alex Chen"
    assert struct["email"] == "alex.chen@example.com"
    assert "Python" in struct["skills"]
    assert "React" in struct["skills"]

@pytest.mark.asyncio
async def test_ai_resume_analysis_fallback():
    raw_text = "Experienced Python & React engineer."
    analysis = await AIService.analyze_resume(raw_text)
    assert "overall_score" in analysis
    assert analysis["overall_score"] >= 0
    assert "categories" in analysis
    assert "strengths" in analysis
    assert "weaknesses" in analysis
