from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional, List, Any

from graph.nodes import (
    gpt_node, deepseek_node, nvidia_node, gemini_node,
    gpt_refine_node, deepseek_refine_node, nvidia_refine_node, gemini_refine_node,
    select_best_node,
)


class GraphState(TypedDict, total=False):
    question: str
    gpt: str
    deepseek: str
    nvidia: str
    gemini: str
    gpt_refined: str
    deepseek_refined: str
    nvidia_refined: str
    gemini_refined: str
    gpt_confidence: int
    deepseek_confidence: int
    nvidia_confidence: int
    gemini_confidence: int
    gpt_preferred: Optional[str]
    deepseek_preferred: Optional[str]
    nvidia_preferred: Optional[str]
    gemini_preferred: Optional[str]
    finalAnswer: str
    bestModel: str
    refinedAnswers: List[Any]
    peerReviews: List[Any]


def create_graph():
    g = StateGraph(GraphState)

    g.add_node("runGPT", gpt_node)
    g.add_node("runDeepSeek", deepseek_node)
    g.add_node("runNvidia", nvidia_node)
    g.add_node("runGemini", gemini_node)

    g.add_node("refineGPT", gpt_refine_node)
    g.add_node("refineDeepSeek", deepseek_refine_node)
    g.add_node("refineNvidia", nvidia_refine_node)
    g.add_node("refineGemini", gemini_refine_node)

    g.add_node("selectBest", select_best_node)

    g.set_entry_point("runGPT")

    g.add_edge("runGPT", "runDeepSeek")
    g.add_edge("runDeepSeek", "runNvidia")
    g.add_edge("runNvidia", "runGemini")

    g.add_edge("runGemini", "refineGPT")
    g.add_edge("refineGPT", "refineDeepSeek")
    g.add_edge("refineDeepSeek", "refineNvidia")
    g.add_edge("refineNvidia", "refineGemini")

    g.add_edge("refineGemini", "selectBest")
    g.add_edge("selectBest", END)

    return g.compile()
