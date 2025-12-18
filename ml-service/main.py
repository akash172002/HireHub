from fastapi import FastAPI
from pydantic import BaseModel
from model import match_resume_job

app = FastAPI()

class MatchRequest(BaseModel):
    resume_text: str
    job_text: str

@app.post("/match")
def get_match_score(data: MatchRequest):
    score = match_resume_job(data.resume_text, data.job_text)
    return {
        "match_score": score,
        "recommended": score >= 70
    }
