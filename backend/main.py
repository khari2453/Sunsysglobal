from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json

from nlp_engine import extract_keywords_from_jd, evaluate_resume_match, generate_tailored_resume_preview, extract_text_from_pdf
from question_db import generate_interview_questions

app = FastAPI(title="AI Resume Matcher API", version="1.0")

# Enable CORS so our local React development server can access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/tailor")
async def tailor_resume(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    jd_text: str = Form(...)
):
    # Retrieve resume content
    final_resume_text = ""
    file_name = None
    
    if resume_file is not None:
        file_name = resume_file.filename
        content = await resume_file.read()
        if resume_file.filename.endswith(".pdf"):
            final_resume_text = extract_text_from_pdf(content)
        else:
            # Assume raw text
            try:
                final_resume_text = content.decode("utf-8")
            except UnicodeDecodeError:
                final_resume_text = content.decode("latin-1")
    elif resume_text:
        final_resume_text = resume_text
    else:
        raise HTTPException(status_code=400, detail="Please upload a resume file or paste your resume text.")

    if not final_resume_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded resume text is empty or could not be read.")

    if not jd_text.strip():
        raise HTTPException(status_code=400, detail="Please provide the Job Description.")

    # 1. NLP Keyword extraction from Job Description
    jd_keywords = extract_keywords_from_jd(jd_text)
    
    # 2. Match evaluation
    match_result = evaluate_resume_match(final_resume_text, jd_keywords)
    
    # 3. Create Tailored Resume preview
    tailored_resume = generate_tailored_resume_preview(final_resume_text, match_result["missing"])
    
    return {
        "fileName": file_name,
        "matchScore": match_result["score"],
        "keywords": {
            "technical": jd_keywords["technical"],
            "methodologies": jd_keywords["methodologies_soft"]
        },
        "matchedKeywords": match_result["matched"],
        "partialKeywords": match_result["partial"],
        "missingKeywords": match_result["missing"],
        "suggestions": match_result["suggestions"],
        "tailoredResume": tailored_resume
    }

@app.post("/api/interview-prep")
async def interview_prep(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    jd_text: str = Form(...)
):
    final_resume_text = ""
    
    if resume_file is not None:
        content = await resume_file.read()
        if resume_file.filename.endswith(".pdf"):
            final_resume_text = extract_text_from_pdf(content)
        else:
            try:
                final_resume_text = content.decode("utf-8")
            except UnicodeDecodeError:
                final_resume_text = content.decode("latin-1")
    elif resume_text:
        final_resume_text = resume_text
    else:
        raise HTTPException(status_code=400, detail="Please upload a resume file or paste your resume text.")

    if not final_resume_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded resume text is empty or could not be read.")

    if not jd_text.strip():
        raise HTTPException(status_code=400, detail="Please provide the Job Description.")

    # 1. NLP Keyword extraction from Job Description
    jd_keywords = extract_keywords_from_jd(jd_text)
    
    # 2. Generate Interview Questions
    questions = generate_interview_questions(final_resume_text, jd_keywords)
    
    return {
        "questions": questions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
