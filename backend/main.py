import os
import io
import json
import pdfplumber
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = "gemini-2.5-flash"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Profile(BaseModel):
    name: str = ""
    education: str = ""
    skills: str
    goal: str


JSON_FORMAT = """{
  "career_score": <integer 0-100, how ready the student is for the target role>,
  "interview_readiness": <integer 0-100>,
  "current_skills": ["skill1", "skill2"],
  "missing_skills": [{"name": "skill", "priority": "high|medium|low"}],
  "roadmap": [{"month": 1, "focus": "short title", "topics": ["topic1", "topic2", "topic3"]}],
  "projects": [{"level": "Beginner|Intermediate|Advanced", "title": "project name", "description": "one sentence"}],
  "interview_questions": [{"question": "question text", "answer_hint": "one or two sentence hint"}]
}"""

RULES = """Rules:
- current_skills: skills the student already has that are relevant to the target role.
- 5 to 7 missing skills, most important first.
- Roadmap of exactly 4 months.
- Exactly 6 projects: 2 Beginner, 2 Intermediate, 2 Advanced.
- Exactly 10 interview questions specific to the target role.
- Be realistic and specific, not generic."""


def build_prompt(goal, name="", education="", skills="", resume_text=""):
    if resume_text:
        source = f"Here is the student's resume text. Extract their skills, education and projects from it:\n\n{resume_text[:6000]}"
    else:
        source = f"Student name: {name}\nEducation: {education}\nCurrent skills: {skills}"

    return f"""You are an expert career mentor for students.

{source}

Target role: {goal}

Analyze the student and return ONLY valid JSON in exactly this structure:
{JSON_FORMAT}

{RULES}
"""


def run_gemini(prompt):
    last_error = None
    for _ in range(2):  # try twice if the JSON is broken
        try:
            response = client.models.generate_content(
                model=MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                ),
            )
            return json.loads(response.text)
        except json.JSONDecodeError as e:
            last_error = e
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    raise HTTPException(status_code=502, detail="AI returned invalid JSON, please try again")


@app.get("/")
def home():
    return {"status": "CareerCatalyst AI running"}


@app.post("/analyze")
def analyze(profile: Profile):
    prompt = build_prompt(
        goal=profile.goal,
        name=profile.name,
        education=profile.education,
        skills=profile.skills,
    )
    return run_gemini(prompt)


@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), goal: str = Form(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF file")

    data = await file.read()
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read this PDF")

    if len(text.strip()) < 30:
        raise HTTPException(
            status_code=400,
            detail="No readable text found. Use a text-based PDF, not a scanned image",
        )

    prompt = build_prompt(goal=goal, resume_text=text)
    return run_gemini(prompt)