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

export function createGraph() {
  return {
    async invoke(state) {
      let result = { ...state };
      for (const node of [
        gptNode,
        deepseekNode,
        nvidiaNode,
        geminiNode,
        gptRefineNode,
        deepseekRefineNode,
        nvidiaRefineNode,
        geminiRefineNode,
        selectBestNode,
      ]) {
        result = { ...result, ...(await node(result)) };
      }
      return result;
    },
  };
}