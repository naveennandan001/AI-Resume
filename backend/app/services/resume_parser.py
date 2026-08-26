import io
import re
from typing import Dict, Any, List
from pypdf import PdfReader
from docx import Document

class ResumeParserService:
    @staticmethod
    def extract_text(file_bytes: bytes, filename: str) -> str:
        """Extract raw text from PDF, DOCX, or TXT file bytes."""
        ext = filename.lower().split('.')[-1] if '.' in filename else ''
        
        if ext == 'pdf':
            return ResumeParserService._extract_pdf(file_bytes)
        elif ext in ['docx', 'doc']:
            return ResumeParserService._extract_docx(file_bytes)
        else:
            # Fallback to text decoding
            try:
                return file_bytes.decode('utf-8')
            except UnicodeDecodeError:
                return file_bytes.decode('latin-1', errors='ignore')

    @staticmethod
    def _extract_pdf(file_bytes: bytes) -> str:
        text_parts = []
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text_parts.append(extracted)
        except Exception as e:
            text_parts.append(f"Error parsing PDF file: {str(e)}")
        return "\n".join(text_parts)

    @staticmethod
    def _extract_docx(file_bytes: bytes) -> str:
        try:
            doc = Document(io.BytesIO(file_bytes))
            return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        except Exception as e:
            return f"Error parsing DOCX file: {str(e)}"

    @staticmethod
    def parse_structure_heuristics(raw_text: str) -> Dict[str, Any]:
        """Perform heuristic extraction of basic sections before/alongside AI processing."""
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
        phone_match = re.search(r'\(?\+?\d{1,3}\)?[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}', raw_text)
        
        lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
        name = lines[0] if lines else "Candidate"
        if len(name.split()) > 4 or "@" in name:
            name = "Candidate"

        # Heuristic section extraction
        skills = []
        common_skills = [
            "Python", "JavaScript", "TypeScript", "React", "Node.js", "SQL", "PostgreSQL",
            "MongoDB", "Docker", "Kubernetes", "AWS", "Git", "REST API", "FastAPI",
            "GraphQL", "Java", "C++", "HTML", "CSS", "Tailwind", "CI/CD", "Linux"
        ]
        for skill in common_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', raw_text, re.IGNORECASE):
                skills.append(skill)

        return {
            "name": name,
            "email": email_match.group(0) if email_match else None,
            "phone": phone_match.group(0) if phone_match else None,
            "summary": raw_text[:300] + "...",
            "skills": list(set(skills)),
            "experience": [],
            "education": [],
            "projects": [],
            "certifications": [],
            "achievements": []
        }
