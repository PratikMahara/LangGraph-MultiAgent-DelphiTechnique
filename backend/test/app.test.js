import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import { getHarnessProfile } from "deepagents";
import app from "../src/app.js";
import { getModelAgent, selectBestNode } from "../src/graph/nodes.js";

test("fast mode follows selected model order and Delphi mode ranks confidence", () => {
  const answers = {
    gpt_refined: "GPT answer",
    gpt_confidence: 70,
    gemini_refined: "Gemini answer",
    gemini_confidence: 92,
  };
  const fastResult = selectBestNode({
    ...answers,
    gpt_confidence: 0,
    gemini_confidence: 0,
    mode: "fast",
    models: ["GPT", "Gemini"],
  });
  assert.equal(fastResult.bestModel, "GPT");
  assert.equal(fastResult.confidence, 0);

  const delphiResult = selectBestNode({
    ...answers,
    mode: "delphi",
    models: ["GPT", "Gemini"],
  });
  assert.equal(delphiResult.bestModel, "Gemini");
  assert.equal(delphiResult.confidence, 92);
});

test("DeepAgents initializes configured OpenRouter and Gemini models", async () => {
  assert.ok(
    getHarnessProfile("google:gemini-3.8-flash").excludedTools.has("grep"),
    "Gemini DeepAgents should omit its unsupported grep tool schema",
  );

  for (const modelId of [
    "openai/gpt-4o-mini",
    "deepseek/deepseek-chat",
    "nvidia/nemotron-3-nano-30b-a3b",
    "google:gemini-2.5-flash",
  ]) {
    const agent = await getModelAgent(modelId);
    assert.equal(typeof agent.invoke, "function", `${modelId} should create an agent`);
  }
});

test("API health and request validation work without provider keys", async (t) => {
  const server = app.listen(0);
  await once(server, "listening");
  t.after(() => server.close());

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const wildcardOrigin = allowedOrigins.includes("*");
  const allowedOrigin = wildcardOrigin ? "https://frontend.example.com" : allowedOrigins[0];

  const preflightResponse = await fetch(`${baseUrl}/api/analyze`, {
    method: "OPTIONS",
    headers: {
      origin: allowedOrigin,
      "access-control-request-method": "POST",
      "access-control-request-headers": "content-type",
    },
  });
  assert.equal(preflightResponse.status, 204);
  assert.equal(
    preflightResponse.headers.get("access-control-allow-origin"),
    wildcardOrigin ? "*" : allowedOrigin,
  );
  if (!wildcardOrigin) {
    const disallowedResponse = await fetch(`${baseUrl}/api/health`, {
      headers: { origin: "https://unconfigured.example.com" },
    });
    assert.equal(disallowedResponse.headers.get("access-control-allow-origin"), null);
  }

  const healthResponse = await fetch(`${baseUrl}/api/health`);
  assert.equal(healthResponse.status, 200);
  assert.deepEqual(await healthResponse.json(), {
    status: "ok",
    configured: {
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      google: Boolean(process.env.GOOGLE_API_KEY),
    },
  });

  const invalidResponse = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: "question", mode: "invalid", models: ["GPT"] }),
  });
  assert.equal(invalidResponse.status, 400);
  assert.deepEqual(await invalidResponse.json(), {
    error: "Mode must be 'fast' or 'delphi'.",
  });

  const unsupportedModelResponse = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt: "question", models: ["Claude"] }),
  });
  assert.equal(unsupportedModelResponse.status, 400);
  assert.deepEqual(await unsupportedModelResponse.json(), {
    error: "Unsupported model selection: Claude.",
  });

  const malformedResponse = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(malformedResponse.status, 400);
  assert.deepEqual(await malformedResponse.json(), {
    error: "Request body must be valid JSON.",
  });
});
