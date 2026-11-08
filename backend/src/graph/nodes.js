import { createDeepAgent, registerHarnessProfile } from "deepagents";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { initChatModel } from "langchain/chat_models/universal";
const ALL_MODELS = ["GPT", "DeepSeek", "NVIDIA", "Gemini"];
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
registerHarnessProfile("google", { excludedTools: ["grep"] });

const MODEL_FACTORIES = {
  "openai/gpt-4o-mini": () =>
    initChatModel("nvidia/nemotron-3.5-super-vl:free", {
      modelProvider: "openai",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: { baseURL: OPENROUTER_BASE_URL },
    }),
  "deepseek/deepseek-chat": () =>
    initChatModel("liquid/lfm-3-1.7b:free", {
      modelProvider: "openai",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: { baseURL: OPENROUTER_BASE_URL },
    }),
  "nvidia/nemotron-3-nano-30b-a3b": () =>
    initChatModel("nvidia/nemotron-3-nano-30b-a3b", {
      modelProvider: "openai",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: { baseURL: OPENROUTER_BASE_URL },
    }),
  "google:gemini-2.5-flash": () =>
    new ChatGoogleGenerativeAI({
      model: "gemini-3.8-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    }),
};

const modelAgents = new Map();

export async function getModelAgent(modelId) {
  if (!modelAgents.has(modelId)) {
    const createModel = MODEL_FACTORIES[modelId];
    if (!createModel) {
      throw new Error(`No DeepAgents model is configured for ${modelId}.`);
    }

    modelAgents.set(
      modelId,
      Promise.resolve(createModel()).then((model) =>
        createDeepAgent({
          model,
          systemPrompt:
            "Answer the user's task directly. Do not create a plan, use tools, delegate, or access files. Follow any response format specified in the user message.",
        }),
      ),
    );
  }
  try {
    return await modelAgents.get(modelId);
  } catch (error) {
    modelAgents.delete(modelId);
    throw error;
  }
}

async function safeCall({ model, messages }) {
  const agent = await getModelAgent(model);
  const result = await agent.invoke({ messages });
  const finalMessage = [...(result.messages || [])]
    .reverse()
    .find((message) => message.type === "ai" || message.getType?.() === "ai");
  const content = finalMessage?.content;
  const text =
    typeof content === "string"
      ? content
      : Array.isArray(content)
        ? content
            .filter((block) => block.type === "text" && typeof block.text === "string")
            .map((block) => block.text)
            .join("\n")
        : "";
  if (!text.trim()) {
    throw new Error(`${model} DeepAgent returned an empty response.`);
  }
  return text;
}

function isSelected(state, model) {
  return (state.models || ALL_MODELS).includes(model);
}

export async function gptNode(state) {
  if (!isSelected(state, "GPT")) return { gpt: "" };
  const content = await safeCall({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: state.question }],
  });
  return { gpt: content };
}

export async function deepseekNode(state) {
  if (!isSelected(state, "DeepSeek")) return { deepseek: "" };
  const content = await safeCall({
    model: "deepseek/deepseek-chat",
    messages: [{ role: "user", content: state.question }],
  });
  return { deepseek: content };
}

export async function nvidiaNode(state) {
  if (!isSelected(state, "NVIDIA")) return { nvidia: "" };
  const content = await safeCall({
    model: "nvidia/nemotron-3-nano-30b-a3b",
    messages: [{ role: "user", content: state.question }],
  });
  return { nvidia: content };
}

export async function geminiNode(state) {
  if (!isSelected(state, "Gemini")) return { gemini: "" };
  const content = await safeCall({
    model: "google:gemini-2.5-flash",
    messages: [{ role: "user", content: state.question }],
  });
  return { gemini: content };
}

function buildRefinePrompt(self, others, selfName) {
  return `
You are ${selfName}.

You are refining ONLY your own answer after seeing peer answers.

Your answer:
${self}

Other answers:
${others}

STRICT RULES:
- Improve ONLY your own answer
- You MUST choose ONE AI whose answer you agree with MOST
- You CANNOT choose yourself (${selfName})
- Choose ONLY from other models
- RETURN ONLY JSON
- NO explanation
- NO markdown
- NO extra text

FORMAT:

{
  "answer": "refined answer",
  "confidence": number (0-100),
  "preferred_ai": "GPT" | "DeepSeek" | "NVIDIA" | "Gemini"
}
`;
}

function extractJSON(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
}

function detectAI(text) {
  if (!text) return null;

  const lower = text.toLowerCase();

  if (lower.includes("gpt")) return "GPT";
  if (lower.includes("deepseek")) return "DeepSeek";
  if (lower.includes("nvidia")) return "NVIDIA";
  if (lower.includes("gemini")) return "Gemini";

  return null;
}

function safeJSON(text, fallbackAI) {
  try {
    const jsonString = extractJSON(text);
    const parsed = JSON.parse(jsonString);
    const answer = typeof parsed.answer === "string" ? parsed.answer.trim() : "";
    const confidence =
      typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
        ? Math.max(0, Math.min(100, parsed.confidence))
        : 50;
    const preferredAI =
      typeof parsed.preferred_ai === "string" ? parsed.preferred_ai : "";

    return {
      answer: answer || text.trim(),
      confidence,
      preferred_ai: preferredAI || detectAI(text) || fallbackAI,
    };
  } catch {
    return {
      answer: text.trim(),
      confidence: 50,
      preferred_ai: detectAI(text) || fallbackAI,
    };
  }
}

function skipRefinement(state, model, answerKey) {
  if (!isSelected(state, model)) {
    return { answer: "", confidence: 0, preferredAI: null };
  }
  if (state.mode === "fast") {
    return {
      answer: state[answerKey] || "",
      confidence: 0,
      preferredAI: null,
    };
  }
  return null;
}

function validPeerChoice(choice, state, self) {
  const selectedModels = (state.models || ALL_MODELS).filter((model) => model !== self);
  return selectedModels.includes(choice) ? choice : selectedModels[0] || null;
}

export async function gptRefineNode(state) {
  const skipped = skipRefinement(state, "GPT", "gpt");
  if (skipped) {
    return {
      gpt_refined: skipped.answer,
      gpt_confidence: skipped.confidence,
      gpt_preferred: skipped.preferredAI,
    };
  }
  const content = await safeCall({
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.gpt,
          `DeepSeek:${state.deepseek}\nNVIDIA:${state.nvidia}\nGemini:${state.gemini}`,
          "GPT"
        ),
      },
    ],
  });

  const parsed = safeJSON(content, "GPT");

  return {
    gpt_refined: parsed.answer,
    gpt_confidence: parsed.confidence,
    gpt_preferred: validPeerChoice(parsed.preferred_ai, state, "GPT"),
  };
}

export async function deepseekRefineNode(state) {
  const skipped = skipRefinement(state, "DeepSeek", "deepseek");
  if (skipped) {
    return {
      deepseek_refined: skipped.answer,
      deepseek_confidence: skipped.confidence,
      deepseek_preferred: skipped.preferredAI,
    };
  }
  const content = await safeCall({
    model: "deepseek/deepseek-chat",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.deepseek,
          `GPT:${state.gpt}\nNVIDIA:${state.nvidia}\nGemini:${state.gemini}`,
          "DeepSeek"
        ),
      },
    ],
  });

  const parsed = safeJSON(content, "DeepSeek");

  return {
    deepseek_refined: parsed.answer,
    deepseek_confidence: parsed.confidence,
    deepseek_preferred: validPeerChoice(parsed.preferred_ai, state, "DeepSeek"),
  };
}

export async function nvidiaRefineNode(state) {
  const skipped = skipRefinement(state, "NVIDIA", "nvidia");
  if (skipped) {
    return {
      nvidia_refined: skipped.answer,
      nvidia_confidence: skipped.confidence,
      nvidia_preferred: skipped.preferredAI,
    };
  }
  const content = await safeCall({
    model: "nvidia/nemotron-3-nano-30b-a3b",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.nvidia,
          `GPT:${state.gpt}\nDeepSeek:${state.deepseek}\nGemini:${state.gemini}`,
          "NVIDIA"
        ),
      },
    ],
  });

  const parsed = safeJSON(content, "NVIDIA");

  return {
    nvidia_refined: parsed.answer,
    nvidia_confidence: parsed.confidence,
    nvidia_preferred: validPeerChoice(parsed.preferred_ai, state, "NVIDIA"),
  };
}

export async function geminiRefineNode(state) {
  const skipped = skipRefinement(state, "Gemini", "gemini");
  if (skipped) {
    return {
      gemini_refined: skipped.answer,
      gemini_confidence: skipped.confidence,
      gemini_preferred: skipped.preferredAI,
    };
  }
  const content = await safeCall({
    model: "google:gemini-2.5-flash",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.gemini,
          `GPT:${state.gpt}\nDeepSeek:${state.deepseek}\nNVIDIA:${state.nvidia}`,
          "Gemini"
        ),
      },
    ],
  });
  const parsed = safeJSON(content, "Gemini");

  return {
    gemini_refined: parsed.answer,
    gemini_confidence: parsed.confidence,
    gemini_preferred: validPeerChoice(parsed.preferred_ai, state, "Gemini"),
  };
}

function buildPeerReviews(state) {
  return (state.models || ALL_MODELS)
    .map((model) => {
      const preferredAI = state[`${model.toLowerCase()}_preferred`];
      return preferredAI
        ? {
            reviewer: model,
            reviewed: preferredAI,
            agreement: "agree",
            comment: `${model} selected ${preferredAI}'s response as the closest match.`,
          }
        : null;
    })
    .filter(Boolean);
}

export function selectBestNode(state) {
  const options = [
    { model: "GPT", answer: state.gpt_refined, confidence: state.gpt_confidence },
    { model: "DeepSeek", answer: state.deepseek_refined, confidence: state.deepseek_confidence },
    { model: "NVIDIA", answer: state.nvidia_refined, confidence: state.nvidia_confidence },
    { model: "Gemini", answer: state.gemini_refined, confidence: state.gemini_confidence },
  ].filter((option) => isSelected(state, option.model) && option.answer?.trim());

  if (state.mode === "fast") {
    const modelOrder = state.models || ALL_MODELS;
    options.sort((a, b) => modelOrder.indexOf(a.model) - modelOrder.indexOf(b.model));
  } else {
    options.sort((a, b) => b.confidence - a.confidence);
  }

  return {
    finalAnswer: options[0]?.answer || "",
    bestModel: options[0]?.model || "",
    confidence: options[0]?.confidence || 0,
    refinedAnswers: options,
    peerReviews: buildPeerReviews(state),
  };
}