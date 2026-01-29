import { OpenRouter } from "@openrouter/sdk";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/* ================== CLIENTS ================== */

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY 
});

const gemini = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  apiKey: GOOGLE_API_KEY
});

/* ================== BASE NODES ================== */

export async function gptNode(state) {
  const res = await openrouter.chat.send({
    model: "openai/gpt-oss-120b:free",
    messages: [{ role: "user", content: state.question }]
  });
  return { gpt: res.choices[0].message.content };
}

export async function deepseekNode(state) {
  const res = await openrouter.chat.send({
    model: "tngtech/deepseek-r1t2-chimera:free",
    messages: [{ role: "user", content: state.question }]
  });
  return { deepseek: res.choices[0].message.content };
}

export async function nvidiaNode(state) {
  const res = await openrouter.chat.send({
    model: "nvidia/nemotron-3-nano-30b-a3b:free",
    messages: [{ role: "user", content: state.question }]
  });
  return { nvidia: res.choices[0].message.content };
}

export async function geminiNode(state) {
  const res = await gemini.invoke(state.question);
  return { gemini: res.content };
}

/* ================== REFINE PROMPT ================== */

function buildRefinePrompt(self, others) {
  return `
You are refining your own answer after seeing peer answers.

Your answer:
${self}

Other answers:
${others}

Tasks:
1. Improve ONLY your own answer
2. Give confidence score (0-100)
3. Output strict JSON:

{
  "answer": "...",
  "confidence": number
}
`;
}

/* ================== REFINE NODES ================== */

export async function gptRefineNode(state) {
  const res = await openrouter.chat.send({
    model: "openai/gpt-oss-120b:free",
    messages: [{
      role: "user",
      content: buildRefinePrompt(
        state.gpt,
        `DeepSeek:\n${state.deepseek}\nNVIDIA:\n${state.nvidia}\nGemini:\n${state.gemini}`
      )
    }]
  });

  const parsed = JSON.parse(res.choices[0].message.content);
  return { gpt_refined: parsed.answer, gpt_confidence: parsed.confidence };
}

export async function deepseekRefineNode(state) {
  const res = await openrouter.chat.send({
    model: "tngtech/deepseek-r1t2-chimera:free",
    messages: [{
      role: "user",
      content: buildRefinePrompt(
        state.deepseek,
        `GPT:\n${state.gpt}\nNVIDIA:\n${state.nvidia}\nGemini:\n${state.gemini}`
      )
    }]
  });

  const parsed = JSON.parse(res.choices[0].message.content);
  return { deepseek_refined: parsed.answer, deepseek_confidence: parsed.confidence };
}

export async function nvidiaRefineNode(state) {
  const res = await openrouter.chat.send({
    model: "nvidia/nemotron-3-nano-30b-a3b:free",
    messages: [{
      role: "user",
      content: buildRefinePrompt(
        state.nvidia,
        `GPT:\n${state.gpt}\nDeepSeek:\n${state.deepseek}\nGemini:\n${state.gemini}`
      )
    }]
  });

  const parsed = JSON.parse(res.choices[0].message.content);
  return { nvidia_refined: parsed.answer, nvidia_confidence: parsed.confidence };
}

export async function geminiRefineNode(state) {
  const res = await gemini.invoke(
    buildRefinePrompt(
      state.gemini,
      `GPT:\n${state.gpt}\nDeepSeek:\n${state.deepseek}\nNVIDIA:\n${state.nvidia}`
    )
  );

  const parsed = JSON.parse(res.content);
  return { gemini_refined: parsed.answer, gemini_confidence: parsed.confidence };
}

/* ================== FINAL SELECT ================== */

export function selectBestNode(state) {
  const options = [
    { answer: state.gpt_refined, score: state.gpt_confidence },
    { answer: state.deepseek_refined, score: state.deepseek_confidence },
    { answer: state.nvidia_refined, score: state.nvidia_confidence },
    { answer: state.gemini_refined, score: state.gemini_confidence }
  ];

  options.sort((a, b) => b.score - a.score);
  return { finalAnswer: options[0].answer };
}
