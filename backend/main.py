from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import spacy
import pandas as pd
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


# Extract keywords using spaCy
def extract_keywords(text):
    doc = nlp(text)
    keywords = []

    for token in doc:
        if not token.is_stop and not token.is_punct:
            if token.pos_ in ["NOUN", "PROPN"]:
                keywords.append(token.text)

    return list(set(keywords))


# Simple skill categorization
def categorize_skill(skill):
    technical_keywords = [
        "python", "react", "docker", "kubernetes",
        "aws", "api", "javascript", "node",
        "sql", "mongodb", "git", "linux"
    ]

    if skill.lower() in technical_keywords:
        return "Technical"

    return "Domain"


# Generate interview questions using Gemini
def generate_question(keywords):

    prompt = f"""
    Given these job skills: {keywords}

    Generate 10 interview questions in JSON format:

    {{
        "questions": [
            {{
                "question": "...",
                "difficulty": "easy/medium/hard",
                "category": "Technical/HR/Behavioral"
            }}
        ]
    }}

    Return ONLY JSON.
    """

    response = model.generate_content(prompt)

    text = (
        response.text
        .strip()
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    if text:
        return json.loads(text)

    return []


@app.post("/analyze")
async def analyze(job_desc: str = Form(...)):

    keywords = extract_keywords(job_desc)

    categorized = []

    for skill in keywords:
        categorized.append({
            "skill": skill,
            "category": categorize_skill(skill)
        })

    df = pd.DataFrame(categorized)

    questions = generate_question(keywords)

    return {
        "skills": df.to_dict(orient="records"),
        "questions": questions.get("questions", [])
        if isinstance(questions, dict)
        else [],
    }