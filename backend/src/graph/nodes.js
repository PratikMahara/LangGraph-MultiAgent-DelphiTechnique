import dotenv from "dotenv";
dotenv.config();

import { OpenRouter } from "@openrouter/sdk";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import OpenAI from "openai";
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
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
    return res.choices?.[0]?.message?.content || "";
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
  
    model: "stepfun/step-3.5-flash:free",
    messages: [{ role: "user", content: state.question }],
  });

  return { deepseek: content };
}
export async function nvidiaNode(state) {
  const content = await safeCall({
    model: "liquid/lfm-2.5-1.2b-thinking:free",
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
- Maximum 4 short sentences
- No explanation
- Output JSON only

{
  "answer": "refined answer",
  "confidence": 0-100
}
`;
}

/* ---------- SAFE JSON ---------- */

function safeJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { answer: text, confidence: 50 };
  }
}

/* ---------- REFINEMENT ---------- */

export async function gptRefineNode(state) {
  const content = await safeCall({
    model: "arcee-ai/trinity-large-preview:free",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.gpt,
          `DeepSeek:${state.deepseek}\nMistral:${state.nvidia}\nGemini:${state.gemini}`,
        ),
      },
    ],
  });

  const parsed = safeJSON(content);
  return { gpt_refined: parsed.answer, gpt_confidence: parsed.confidence };
}

export async function deepseekRefineNode(state) {
  const content = await safeCall({
    model: "stepfun/step-3.5-flash:free",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.deepseek,
          `GPT:${state.gpt}\nMistral:${state.nvidia}\nGemini:${state.gemini}`,
        ),
      },
    ],
  });

  const parsed = safeJSON(content);
  return {
    deepseek_refined: parsed.answer,
    deepseek_confidence: parsed.confidence,
  };
}

export async function nvidiaRefineNode(state) {
  const content = await safeCall({
    model: "liquid/lfm-2.5-1.2b-thinking:free",
    messages: [
      {
        role: "user",
        content: buildRefinePrompt(
          state.nvidia,
          `GPT:${state.gpt}\nDeepSeek:${state.deepseek}\nGemini:${state.gemini}`,
        ),
      },
    ],
  });

  const parsed = safeJSON(content);
  return {
    nvidia_refined: parsed.answer,
    nvidia_confidence: parsed.confidence,
  };
}

export async function geminiRefineNode(state) {
  try {
    const res = await gemini.invoke(
      buildRefinePrompt(
        state.gemini,
        `GPT:${state.gpt}\nDeepSeek:${state.deepseek}\nMistral:${state.nvidia}`,
      ),
    );

    const parsed = safeJSON(res.content);

    return {
      gemini_refined: parsed.answer,
      gemini_confidence: parsed.confidence,
    };
  } catch {
    return { gemini_refined: "", gemini_confidence: 0 };
  }
}

/* ---------- SELECT BEST ---------- */

export function selectBestNode(state) {
  const options = [
    {
      model: "gpt",
      answer: state.gpt_refined,
      confidence: state.gpt_confidence,
    },
    {
      model: "deepseek",
      answer: state.deepseek_refined,
      confidence: state.deepseek_confidence,
    },
    {
      model: "nvidia",
      answer: state.nvidia_refined,
      confidence: state.nvidia_confidence,
    },
    {
      model: "gemini",
      answer: state.gemini_refined,
      confidence: state.gemini_confidence,
    },
  ];

  options.sort((a, b) => b.confidence - a.confidence);

  return {
    finalAnswer: options[0].answer,
    bestModel: options[0].model,
    refinedAnswers: options,
  };
}
