from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

class MatchRequest(BaseModel):
    resume_text: str
    job_text: str

@app.get("/")
def health_check():
    return {"status": "ML Service Running"}

@app.post("/match-score")
def match_score(data: MatchRequest):
    texts = [data.resume_text, data.job_text]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf = vectorizer.fit_transform(texts)

    score = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    score_percent = round(score * 100, 2)

    return {
        "match_score": score_percent,
        "recommended": score_percent >= 60
    }
