import os
import json
import re
import httpx
from langchain_google_genai import ChatGoogleGenerativeAI

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

gemini = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.7,
)


async def safe_call(model: str, messages: list) -> str:
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(
                OPENROUTER_URL,
                headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}"},
                json={"model": model, "messages": messages},
            )
            data = res.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Model failed: {e}")
        return ""


def build_refine_prompt(self_answer: str, others: str, self_name: str) -> str:
    return f"""
You are {self_name}.

You are refining ONLY your own answer after seeing peer answers.

Your answer:
{self_answer}

Other answers:
{others}

STRICT RULES:
- Improve ONLY your own answer
- You MUST choose ONE AI whose answer you agree with MOST
- You CANNOT choose yourself ({self_name})
- Choose ONLY from other models
- RETURN ONLY JSON
- NO explanation
- NO markdown
- NO extra text

FORMAT:

{{
  "answer": "refined answer",
  "confidence": number (0-100),
  "preferred_ai": "GPT" | "DeepSeek" | "Nvidia" | "Gemini"
}}
"""


def extract_json(text: str) -> str:
    cleaned = re.sub(r"```json|```", "", text).strip()
    match = re.search(r"\{[\s\S]*\}", cleaned)
    return match.group(0) if match else cleaned


def detect_ai(text: str):
    if not text:
        return None
    lower = text.lower()
    if "gpt" in lower:
        return "GPT"
    if "deepseek" in lower:
        return "DeepSeek"
    if "nvidia" in lower:
        return "Nvidia"
    if "gemini" in lower:
        return "Gemini"
    return None


def safe_json(text: str, fallback_ai: str) -> dict:
    try:
        parsed = json.loads(extract_json(text))
        return {
            "answer": parsed.get("answer", text),
            "confidence": parsed["confidence"] if isinstance(parsed.get("confidence"), (int, float)) else 50,
            "preferred_ai": parsed.get("preferred_ai") or detect_ai(text) or fallback_ai,
        }
    except Exception:
        return {"answer": text.strip(), "confidence": 50, "preferred_ai": detect_ai(text) or fallback_ai}


# ---------- BASE NODES ----------

async def gpt_node(state: dict) -> dict:
    content = await safe_call("openai/gpt-4o-mini", [{"role": "user", "content": state["question"]}])
    return {"gpt": content}


async def deepseek_node(state: dict) -> dict:
    content = await safe_call("deepseek/deepseek-chat", [{"role": "user", "content": state["question"]}])
    return {"deepseek": content}


async def nvidia_node(state: dict) -> dict:
    content = await safe_call("nvidia/llama-3.1-nemotron-70b-instruct", [{"role": "user", "content": state["question"]}])
    return {"nvidia": content}


async def gemini_node(state: dict) -> dict:
    try:
        res = await gemini.ainvoke(state["question"])
        return {"gemini": res.content}
    except Exception:
        return {"gemini": ""}


# ---------- REFINE NODES ----------

async def gpt_refine_node(state: dict) -> dict:
    content = await safe_call(
        "openai/gpt-4o-mini",
        [{"role": "user", "content": build_refine_prompt(
            state["gpt"],
            f"DeepSeek:{state['deepseek']}\nNvidia:{state['nvidia']}\nGemini:{state['gemini']}",
            "GPT"
        )}],
    )
    parsed = safe_json(content, "GPT")
    return {"gpt_refined": parsed["answer"], "gpt_confidence": parsed["confidence"], "gpt_preferred": parsed["preferred_ai"] or "GPT"}


async def deepseek_refine_node(state: dict) -> dict:
    content = await safe_call(
        "deepseek/deepseek-chat",
        [{"role": "user", "content": build_refine_prompt(
            state["deepseek"],
            f"GPT:{state['gpt']}\nNvidia:{state['nvidia']}\nGemini:{state['gemini']}",
            "DeepSeek"
        )}],
    )
    parsed = safe_json(content, "DeepSeek")
    return {"deepseek_refined": parsed["answer"], "deepseek_confidence": parsed["confidence"], "deepseek_preferred": parsed["preferred_ai"] or "DeepSeek"}


async def nvidia_refine_node(state: dict) -> dict:
    content = await safe_call(
        "nvidia/llama-3.1-nemotron-70b-instruct",
        [{"role": "user", "content": build_refine_prompt(
            state["nvidia"],
            f"GPT:{state['gpt']}\nDeepSeek:{state['deepseek']}\nGemini:{state['gemini']}",
            "Nvidia"
        )}],
    )
    parsed = safe_json(content, "Nvidia")
    return {"nvidia_refined": parsed["answer"], "nvidia_confidence": parsed["confidence"], "nvidia_preferred": parsed["preferred_ai"] or "Nvidia"}


async def gemini_refine_node(state: dict) -> dict:
    try:
        res = await gemini.ainvoke(build_refine_prompt(
            state["gemini"],
            f"GPT:{state['gpt']}\nDeepSeek:{state['deepseek']}\nNvidia:{state['nvidia']}",
            "Gemini"
        ))
        parsed = safe_json(res.content, "Gemini")
        return {"gemini_refined": parsed["answer"], "gemini_confidence": parsed["confidence"], "gemini_preferred": parsed["preferred_ai"] or "Gemini"}
    except Exception:
        return {"gemini_refined": "", "gemini_confidence": 0, "gemini_preferred": "Gemini"}


# ---------- SELECT BEST ----------

def select_best_node(state: dict) -> dict:
    options = [
        {"model": "GPT", "answer": state.get("gpt_refined", ""), "confidence": state.get("gpt_confidence", 0)},
        {"model": "DeepSeek", "answer": state.get("deepseek_refined", ""), "confidence": state.get("deepseek_confidence", 0)},
        {"model": "Nvidia", "answer": state.get("nvidia_refined", ""), "confidence": state.get("nvidia_confidence", 0)},
        {"model": "Gemini", "answer": state.get("gemini_refined", ""), "confidence": state.get("gemini_confidence", 0)},
    ]
    options.sort(key=lambda x: x["confidence"], reverse=True)

    peer_reviews = [
        {"model": "GPT", "preferred_ai": state.get("gpt_preferred") or "GPT"},
        {"model": "DeepSeek", "preferred_ai": state.get("deepseek_preferred") or "DeepSeek"},
        {"model": "Nvidia", "preferred_ai": state.get("nvidia_preferred") or "Nvidia"},
        {"model": "Gemini", "preferred_ai": state.get("gemini_preferred") or "Gemini"},
    ]

    return {
        "finalAnswer": options[0]["answer"] if options else "",
        "bestModel": options[0]["model"] if options else "GPT",
        "refinedAnswers": options,
        "peerReviews": peer_reviews,
    }
