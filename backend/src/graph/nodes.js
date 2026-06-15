import dotenv from "dotenv";
dotenv.config();

import { OpenRouter } from "@openrouter/sdk";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/* ---------- INIT ---------- */

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7,
});

/* ---------- SAFE CALL ---------- */

async function safeCall(payload) {
  try {
    const res = await openrouter.chat.send(payload);
    return res.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.error("Model failed:", err.message);
    return "";
  }
}

/* ---------- BASE MODELS ---------- */

export async function gptNode(state) {
  const content = await safeCall({
    model: "openai/gpt-4o-mini",
    messages: [{ role: "user", content: state.question }],
  });
  return { gpt: content };
}

export async function deepseekNode(state) {
  const content = await safeCall({
    model: "deepseek/deepseek-chat",
    messages: [{ role: "user", content: state.question }],
  });
  return { deepseek: content };
}

export async function nvidiaNode(state) {
  const content = await safeCall({
    model: "nvidia/llama-3.1-nemotron-70b-instruct",
    messages: [{ role: "user", content: state.question }],
  });
  return { nvidia: content };
}

export async function geminiNode(state) {
  try {
    const res = await gemini.invoke(state.question);
    return { gemini: res.content };
  } catch {
    return { gemini: "" };
  }
}

/* ---------- PROMPT ---------- */

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
  "preferred_ai": "GPT" | "DeepSeek" | "Nvidia" | "Gemini"
}
`;
}

/* ---------- SAFE JSON ---------- */

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
  if (lower.includes("nvidia")) return "Nvidia";
  if (lower.includes("gemini")) return "Gemini";

  return null;
}

function safeJSON(text, fallbackAI) {
  try {
    const jsonString = extractJSON(text);
    const parsed = JSON.parse(jsonString);

    return {
      answer: parsed.answer || text,
      confidence:
        typeof parsed.confidence === "number"
          ? parsed.confidence
          : 50,
      preferred_ai:
        parsed.preferred_ai ||
        detectAI(text) ||
        fallbackAI,
    };
  } catch {
    return {
      answer: text.trim(),
      confidence: 50,
      preferred_ai: detectAI(text) || fallbackAI,
    };
  }
}

/* ---------- REFINEMENT ---------- */

function ensureAI(ai, fallback) {
  return ai || fallback;
}

export async function gptRefineNode(state) {
  const content = await safeCall({
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.gpt,
          `DeepSeek:${state.deepseek}\nNvidia:${state.nvidia}\nGemini:${state.gemini}`,
          "GPT"
        ),
      },
    ],
  });

  const parsed = safeJSON(content, "GPT");

  return {
    gpt_refined: parsed.answer,
    gpt_confidence: parsed.confidence,
    gpt_preferred: ensureAI(parsed.preferred_ai, "GPT"),
  };
}

export async function deepseekRefineNode(state) {
  const content = await safeCall({
    model: "deepseek/deepseek-chat",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.deepseek,
          `GPT:${state.gpt}\nNvidia:${state.nvidia}\nGemini:${state.gemini}`,
          "DeepSeek"
        ),
      },
    ],
  });

  const parsed = safeJSON(content, "DeepSeek");

  return {
    deepseek_refined: parsed.answer,
    deepseek_confidence: parsed.confidence,
    deepseek_preferred: ensureAI(parsed.preferred_ai, "DeepSeek"),
  };
}

export async function nvidiaRefineNode(state) {
  const content = await safeCall({
    model: "nvidia/llama-3.1-nemotron-70b-instruct",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.nvidia,
          `GPT:${state.gpt}\nDeepSeek:${state.deepseek}\nGemini:${state.gemini}`,
          "Nvidia"
        ),
      },
    ],
  });

  const parsed = safeJSON(content, "Nvidia");

  return {
    nvidia_refined: parsed.answer,
    nvidia_confidence: parsed.confidence,
    nvidia_preferred: ensureAI(parsed.preferred_ai, "Nvidia"),
  };
}

export async function geminiRefineNode(state) {
  try {
    const res = await gemini.invoke(
      buildRefinePrompt(
        state.gemini,
        `GPT:${state.gpt}\nDeepSeek:${state.deepseek}\nNvidia:${state.nvidia}`,
        "Gemini"
      )
    );

    const parsed = safeJSON(res.content, "Gemini");

    return {
      gemini_refined: parsed.answer,
      gemini_confidence: parsed.confidence,
      gemini_preferred: ensureAI(parsed.preferred_ai, "Gemini"),
    };
  } catch {
    return {
      gemini_refined: "",
      gemini_confidence: 0,
      gemini_preferred: "Gemini",
    };
  }
}

/* ---------- PEER REVIEWS (NEVER EMPTY) ---------- */

function buildPeerReviews(state) {
  return [
    { model: "GPT", preferred_ai: state.gpt_preferred || "GPT" },
    { model: "DeepSeek", preferred_ai: state.deepseek_preferred || "DeepSeek" },
    { model: "Nvidia", preferred_ai: state.nvidia_preferred || "Nvidia" },
    { model: "Gemini", preferred_ai: state.gemini_preferred || "Gemini" },
  ];
}

/* ---------- SELECT BEST ---------- */

export function selectBestNode(state) {
  const options = [
    { model: "GPT", answer: state.gpt_refined, confidence: state.gpt_confidence },
    { model: "DeepSeek", answer: state.deepseek_refined, confidence: state.deepseek_confidence },
    { model: "Nvidia", answer: state.nvidia_refined, confidence: state.nvidia_confidence },
    { model: "Gemini", answer: state.gemini_refined, confidence: state.gemini_confidence },
  ];

  options.sort((a, b) => b.confidence - a.confidence);

  return {
    finalAnswer: options[0]?.answer || "",
    bestModel: options[0]?.model || "GPT",
    refinedAnswers: options,
    peerReviews: buildPeerReviews(state),
  };
}