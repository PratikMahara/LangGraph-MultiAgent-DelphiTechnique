import { StateGraph, Annotation } from "@langchain/langgraph";

import {
  gptNode,
  deepseekNode,
  nvidiaNode,
  geminiNode,
  gptRefineNode,
  deepseekRefineNode,
  nvidiaRefineNode,
  geminiRefineNode,
  selectBestNode
} from "./nodes.js";

/* ================== STATE ================== */

const GraphState = Annotation.Root({
  question: Annotation(),

  gpt: Annotation(),
  deepseek: Annotation(),
  nvidia: Annotation(),
  gemini: Annotation(),

  gpt_refined: Annotation(),
  deepseek_refined: Annotation(),
  nvidia_refined: Annotation(),
  gemini_refined: Annotation(),

  gpt_confidence: Annotation(),
  deepseek_confidence: Annotation(),
  nvidia_confidence: Annotation(),
  gemini_confidence: Annotation(),

  finalAnswer: Annotation(),
  bestModel: Annotation(),
  refinedAnswers: Annotation()
});

/* ================== GRAPH ================== */

export function createGraph() {
  const graph = new StateGraph(GraphState);

  /* ===== BASE MODELS ===== */
  graph.addNode("runGPT", gptNode);
  graph.addNode("runDeepSeek", deepseekNode);
  graph.addNode("runNvidia", nvidiaNode);
  graph.addNode("runGemini", geminiNode);

  /* ===== REFINEMENT ===== */
  graph.addNode("refineGPT", gptRefineNode);
  graph.addNode("refineDeepSeek", deepseekRefineNode);
  graph.addNode("refineNvidia", nvidiaRefineNode);
  graph.addNode("refineGemini", geminiRefineNode);

 
  graph.addNode("selectBest", selectBestNode);

  graph.setEntryPoint("runGPT");

  graph.addEdge("runGPT", "runDeepSeek");
  graph.addEdge("runDeepSeek", "runNvidia");
  graph.addEdge("runNvidia", "runGemini");

  graph.addEdge("runGemini", "refineGPT");
  graph.addEdge("refineGPT", "refineDeepSeek");
  graph.addEdge("refineDeepSeek", "refineNvidia");
  graph.addEdge("refineNvidia", "refineGemini");

  graph.addEdge("refineGemini", "selectBest");

  graph.setFinishPoint("selectBest");

  return graph.compile();
}
