import express from "express";
import cors from "cors";
import { createGraph } from "./graph/graph.js";

const app = express();

app.use(cors());
app.use(express.json());


const graph = createGraph();


app.post("/api/analyze", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        error: "Request body missing. Did you send JSON?"
      });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const result = await graph.invoke({
      question: prompt
    });

    res.json({ finalAnswer: result.finalAnswer });

  } catch (error) {
    console.error("Graph execution error:", error);
    res.status(500).json({ error: error.message });
  }
});


export default app;
