from fastapi import FastAPI, Body
from pydantic import BaseModel
from your_ai_model import analyze_job_post, suggest_cv_improvements  # import AI model functions

app = FastAPI()

# Define request and response models using Pydantic
class JobPostRequest(BaseModel):
    job_post: str
    cv: str

class AnalysisResponse(BaseModel):
    analysis: str
    recommendations: list

# Create an endpoint to analyze job posts and CVs
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: JobPostRequest):
    job_post = request.job_post
    cv = request.cv

    # Call your AI model functions to process the job post and CV
    analysis = analyze_job_post(job_post)
    recommendations = suggest_cv_improvements(cv, job_post)

    return AnalysisResponse(analysis=analysis, recommendations=recommendations)

# To run the server, use: uvicorn main:app --reload
