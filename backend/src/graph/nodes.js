import dotenv from "dotenv";
dotenv.config();

import { OpenRouter } from "@openrouter/sdk";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7,
});

/* ---------- SAFE CALL ---------- */

async function safeCall(payload) {
  try {
    const res = await openrouter.chat.send(payload);
    const content = res.choices?.[0]?.message?.content || "";
    return content;
  } catch (err) {
    console.error("Model failed:", err.message);
    return "";
  }
}

/* ---------- BASE MODELS ---------- */

export async function gptNode(state) {
  const content = await safeCall({
    model: "arcee-ai/trinity-large-preview:free",
    messages: [{ role: "user", content: state.question }],
  });

  return { gpt: content };
}

export async function deepseekNode(state) {
  const content = await safeCall({
    model: "liquid/lfm-2.5-1.2b-thinking:free",
    messages: [{ role: "user", content: state.question }],
  });

  return { deepseek: content };
}

export async function nvidiaNode(state) {
  const content = await safeCall({
    model: "nvidia/nemotron-3-super-120b-a12b:free",
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

function buildRefinePrompt(self, others) {
  return `
You are refining ONLY your own answer after seeing peer answers.

Your answer:
${self}

Other answers:
${others}

RULES:
- Improve ONLY your own answer
- Choose ONE AI whose answer you agree with MOST
- DO NOT use LaTeX like \\boxed{}
- Return ONLY valid JSON

{
  "answer": "refined answer",
  "confidence": number,
  "preferred_ai": "GPT | DeepSeek | Nvidia | Gemini"
}
`;
}

/* ---------- SAFE JSON (STRONG) ---------- */

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

  if (/\\boxed\{(.*?)\}/i.test(text)) {
    return text.match(/\\boxed\{(.*?)\}/i)[1];
  }

  if (/gpt/i.test(text)) return "GPT";
  if (/deepseek/i.test(text)) return "DeepSeek";
  if (/nvidia/i.test(text)) return "Nvidia";
  if (/gemini/i.test(text)) return "Gemini";

  return null;
}

function safeJSON(text) {
  try {
    const jsonString = extractJSON(text);
    const parsed = JSON.parse(jsonString);

    return {
      answer: parsed.answer || text,
      confidence: parsed.confidence ?? 50,
      preferred_ai: parsed.preferred_ai || detectAI(text), // ✅ fallback
    };
  } catch {
    return {
      answer: text.trim(),
      confidence: 50,
      preferred_ai: detectAI(text), // ✅ FORCE DETECTION
    };
  }
}

/* ---------- REFINEMENT ---------- */

function ensureAI(ai, fallback) {
  return ai || fallback; // 🔥 NEVER NULL
}

export async function gptRefineNode(state) {
  const content = await safeCall({
    model: "arcee-ai/trinity-large-preview:free",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.gpt,
          `DeepSeek:${state.deepseek}\nNvidia:${state.nvidia}\nGemini:${state.gemini}`
        ),
      },
    ],
  });

  const parsed = safeJSON(content);

  return {
    gpt_refined: parsed.answer,
    gpt_confidence: parsed.confidence,
    gpt_preferred: ensureAI(parsed.preferred_ai, "GPT"), // ✅ FIX
  };
}

export async function deepseekRefineNode(state) {
  const content = await safeCall({
    model: "liquid/lfm-2.5-1.2b-thinking:free",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.deepseek,
          `GPT:${state.gpt}\nNvidia:${state.nvidia}\nGemini:${state.gemini}`
        ),
      },
    ],
  });

  const parsed = safeJSON(content);

  return {
    deepseek_refined: parsed.answer,
    deepseek_confidence: parsed.confidence,
    deepseek_preferred: ensureAI(parsed.preferred_ai, "GPT"), // ✅ FIX
  };
}

export async function nvidiaRefineNode(state) {
  const content = await safeCall({
    model: "nvidia/nemotron-3-super-120b-a12b:free",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.nvidia,
          `GPT:${state.gpt}\nDeepSeek:${state.deepseek}\nGemini:${state.gemini}`
        ),
      },
    ],
  });

  const parsed = safeJSON(content);

  return {
    nvidia_refined: parsed.answer,
    nvidia_confidence: parsed.confidence,
    nvidia_preferred: ensureAI(parsed.preferred_ai, "GPT"), // ✅ FIX
  };
}

export async function geminiRefineNode(state) {
  try {
    const res = await gemini.invoke(
      buildRefinePrompt(
        state.gemini,
        `GPT:${state.gpt}\nDeepSeek:${state.deepseek}\nNvidia:${state.nvidia}`
      )
    );

    const parsed = safeJSON(res.content);

    return {
      gemini_refined: parsed.answer,
      gemini_confidence: parsed.confidence,
      gemini_preferred: ensureAI(parsed.preferred_ai, "GPT"), // ✅ FIX
    };
  } catch {
    return {
      gemini_refined: "",
      gemini_confidence: 0,
      gemini_preferred: "GPT", // ✅ NEVER NULL
    };
  }
}

/* ---------- BUILD PEER REVIEWS ---------- */

function buildPeerReviews(state) {
  const reviews = [];

  const models = [
    { name: "GPT", preferred: state.gpt_preferred },
    { name: "DeepSeek", preferred: state.deepseek_preferred },
    { name: "Nvidia", preferred: state.nvidia_preferred },
    { name: "Gemini", preferred: state.gemini_preferred },
  ];

  models.forEach((model) => {
    if (!model.preferred) return;

    reviews.push(`${model.name} → ${model.preferred}`); // 🔥 clean format
  });

  return reviews;
}

/* ---------- SELECT BEST ---------- */

export function selectBestNode(state) {
  const options = [
    {
      model: "GPT",
      answer: state.gpt_refined,
      confidence: state.gpt_confidence,
    },
    {
      model: "DeepSeek",
      answer: state.deepseek_refined,
      confidence: state.deepseek_confidence,
    },
    {
      model: "Nvidia",
      answer: state.nvidia_refined,
      confidence: state.nvidia_confidence,
    },
    {
      model: "Gemini",
      answer: state.gemini_refined,
      confidence: state.gemini_confidence,
    },
  ];

  options.sort((a, b) => b.confidence - a.confidence);

  return {
    finalAnswer: options[0].answer,
    bestModel: options[0].model,
    refinedAnswers: options,
    peerReviews: buildPeerReviews(state),
  };
}