from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

class MatchRequest(BaseModel):
    resume_text: str
    job_text: str

@app.post("/match")
def match(req: MatchRequest):
    vectorizer = TfidfVectorizer(stop_words="english")

    vectors = vectorizer.fit_transform([
        req.resume_text,
        req.job_text
    ])

    score = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    score_percent = round(score * 100, 2)

    return {
        "match_score": score_percent,
        "recommended": score_percent >= 60
    }
