from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import spacy
import pandas as pd
from transformers import pipeline
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv #used for reading env file

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# now lets load the model we will use
nlp=spacy.load("en_core_web_sm")
classifier=pipeline("zero-shot-classification")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model= genai.GenerativeModel("gemini-2.5-flash")


# wirting spacy function
def extract_keywords(text):
    doc=nlp(text)
    keywords=[]
    for token in doc:
        if not token.is_stop and not token.is_punct:
            if token.pos_ in ["NOUN","PROPN"]:
                keywords.append(token.text)
    return keywords

#hugging face function
def categorize_skill(skill):
    labels=["Technical","Soft skill","Domain"]
    result=classifier(skill,labels)
    return result["labels"][0]             # classifeir ka output kuch aisa hai { "sequence":"python", "labels": ["Technical","Soft skill","Domain"], scores: [0.98,0.01.0.01 ]}
                                            # toh kya krte hai labels sort hote hai orr sbse jada score vala phele aa jata hai 

# gemini function 
def generate_question(keywords):
    prompt=f"""
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
    Return ONLY JSON, nothing else.
    """
    response = model.generate_content(prompt) #gemini ko prompt bheja orr response aaya api call jaisa hee hai
    text = response.text.strip().strip("```json").strip("```").strip()    #gemini return json wrapped ````json...``` markdown bloack so json.loads cant parse it
    if text:
        return json.loads(text)
    return []                     #string mai aayega response usko dic mai kr diya isliye loads orr .text isliiye kyuki response object hai drect acess nhi kr skte 

@app.post("/analyze")
async def analyze(job_desc: str=Form(...)):
    
    #spacy
    keywords=extract_keywords(job_desc)
    #hugging face
    categorized=[]
    for i in keywords:
        category = categorize_skill(i)
        categorized.append({"skill": i, "category":category})
    #organize by pandas
    df= pd.DataFrame(categorized) #table bana deta hai

    #gemini se question
    questions=generate_question(keywords)

    return {
        "skills": df.to_dict(orient="records"), #df.to_dict(orient="records") table ko dic vps jisse react easily use kr ske
    }
