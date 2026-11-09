import "./env.js";

import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { createGraph } from "./graph/graph.js";

const app = express();
const availableModels = ["GPT", "DeepSeek", "NVIDIA", "Gemini"];
app.use(cors());
app.use(express.json({ limit: "32kb" }));

const graph = createGraph();

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    configured: {
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
      google: Boolean(process.env.GOOGLE_API_KEY),
    },
  });
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { prompt, mode = "delphi", models = availableModels } = req.body || {};
    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "A non-empty prompt is required." });
    }
    if (prompt.length > 20000) {
      return res.status(400).json({ error: "Prompt must be 20,000 characters or fewer." });
    }
    if (!["fast", "delphi"].includes(mode)) {
      return res.status(400).json({ error: "Mode must be 'fast' or 'delphi'." });
    }
    if (!Array.isArray(models) || models.length === 0) {
      return res.status(400).json({ error: "Select at least one model." });
    }
    const invalidModels = models.filter((model) => !availableModels.includes(model));
    if (invalidModels.length > 0) {
      return res.status(400).json({
        error: `Unsupported model selection: ${invalidModels.join(", ")}.`,
      });
    }

    const selectedModels = [...new Set(models)];
    const needsOpenRouter = selectedModels.some((model) => model !== "Gemini");
    const missingKeys = [
      ...(needsOpenRouter && !process.env.OPENROUTER_API_KEY ? ["OPENROUTER_API_KEY"] : []),
      ...(selectedModels.includes("Gemini") && !process.env.GOOGLE_API_KEY ? ["GOOGLE_API_KEY"] : []),
    ];
    if (missingKeys.length > 0) {
      return res.status(503).json({
        error: `Add ${missingKeys.join(" and ")} to backend/.env, then restart the backend.`,
      });
    }

    const result = await graph.invoke(
      { question: prompt.trim(), mode, models: selectedModels },
      {
        configurable: {
          thread_id: `req-${randomUUID()}`,
        },
      },
    );

    if (!result.finalAnswer) {
      return res.status(502).json({
        error: "The selected models did not return an answer. Check the backend logs and try again.",
      });
    }

    res.json({
      finalAnswer: result.finalAnswer,
      bestModel: result.bestModel,
      confidence: result.confidence,
      explanation:
        mode === "fast"
          ? "Fast mode returns the first selected model response without a refinement round."
          : `Selected ${result.bestModel}'s refined response using the model's reported confidence.`,
      refinedAnswers: result.refinedAnswers,
      peerReviews: result.peerReviews,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("DeepAgents execution error:", error);
    res.status(502).json({
      error: "AI analysis failed. Check the backend logs for provider details, then try again.",
    });
  }
});

app.use((error, _req, res, _next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body exceeds the 32 KB limit." });
  }

  console.error("API request error:", error);
  return res.status(500).json({ error: "Unexpected API error. Check the backend logs." });
});

export default app;
