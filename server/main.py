from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from graph.graph import create_graph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graph = create_graph()


class AnalyzeRequest(BaseModel):
    prompt: str


@app.post("/api/analyze")
async def analyze(body: AnalyzeRequest):
    try:
        result = await graph.ainvoke({"question": body.prompt})
        return {
            "finalAnswer": result.get("finalAnswer", ""),
            "bestModel": result.get("bestModel", ""),
            "refinedAnswers": result.get("refinedAnswers", []),
            "peerReviews": result.get("peerReviews", []),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
