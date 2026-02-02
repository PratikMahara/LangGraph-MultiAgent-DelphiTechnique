import dotenv from "dotenv";
dotenv.config();

import { OpenRouter } from "@openrouter/sdk";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

console.log(`The api key of GEMINI:${process.env.GOOGLE_API_KEY}`)
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY 
});

const gemini = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7
});


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


function buildRefinePrompt(self, others) {
  return `
You are refining ONLY your own answer after seeing peer answers.

Your answer:
${self}

Other answers:
${others}

STRICT RULES (DO NOT BREAK):
- Improve ONLY your own answer
- Be extremely concise and specific
- Maximum length: 4 short bullet points OR 4 short sentences
- No introductions, no conclusions
- No explanations, no examples
- No filler words
- No markdown
- No references to other models
- Output ONLY valid JSON
- Confidence must be an integer between 0 and 100

If a shorter answer is possible, choose the shorter one.

Return EXACTLY this format and nothing else:

{
  "answer": "short, specific answer here",
  "confidence": 85
}
`;
}

function safeJSONParse(text) {
  if (!text || typeof text !== "string") {
    return { answer: "", confidence: 0 };
  }

  try {
    return JSON.parse(text);
  } catch {
    try {
      const match = text.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error("No JSON object found");
      }

      const cleaned = match[0]
        .replace(/[\u0000-\u001F]+/g, " ")
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/\t/g, " ");

      return JSON.parse(cleaned);
    } catch {
      return {
        answer: text.replace(/[\u0000-\u001F]+/g, " ").trim(),
        confidence: 50
      };
    }
  }
}



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

const parsed = safeJSONParse(res.choices[0].message.content);
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

const parsed = safeJSONParse(res.choices[0].message.content);
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

const parsed = safeJSONParse(res.choices[0].message.content);
  return { nvidia_refined: parsed.answer, nvidia_confidence: parsed.confidence };
}

export async function geminiRefineNode(state) {
  const res = await gemini.invoke(
    buildRefinePrompt(
      state.gemini || "",
      `GPT:\n${state.gpt}\nDeepSeek:\n${state.deepseek}\nNVIDIA:\n${state.nvidia}`
    )
  );

  const parsed = safeJSONParse(res?.content);
  return {
    gemini_refined: parsed.answer,
    gemini_confidence: parsed.confidence
  };
}



export function selectBestNode(state) {
  const options = [
    { model: "gpt", answer: state.gpt_refined, confidence: state.gpt_confidence },
    { model: "deepseek", answer: state.deepseek_refined, confidence: state.deepseek_confidence },
    { model: "nvidia", answer: state.nvidia_refined, confidence: state.nvidia_confidence },
    { model: "gemini", answer: state.gemini_refined, confidence: state.gemini_confidence }
  ];

  options.sort((a, b) => b.confidence - a.confidence);

  return {
    finalAnswer: options[0].answer,
    bestModel: options[0].model,
    refinedAnswers: options
  };
}
