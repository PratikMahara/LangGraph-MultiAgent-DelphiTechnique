# 🧠 AI Delphi Technique — Multi-Model Consensus Platform

> Ask a question. Four AI models answer, challenge each other, refine their responses, and converge on the single best answer — inspired by the **Delphi Method**.

<!-- Replace with a screenshot or demo gif of the landing page -->
![Landing Page](https://res.cloudinary.com/pratikmahara/image/upload/v1781514544/Screenshot_2026-06-15_082226_jctj8o.png)

---

## What is the Delphi Technique?

The [Delphi Method](https://en.wikipedia.org/wiki/Delphi_method) is a structured process where a panel of experts independently answer questions, review each other's answers, and iteratively refine their views until a consensus emerges. This project applies that idea to AI — replacing human experts with **GPT, DeepSeek, NVIDIA Nemotron, and Gemini**.

---

## How It Works

![Landing Page](https://res.cloudinary.com/pratikmahara/image/upload/v1781514395/Gemini_Generated_Image_wy75z4wy75z4wy75_dlfdtt.png)


---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express **or** Python, FastAPI |
| AI Orchestration | [DeepAgents](https://docs.langchain.com/oss/javascript/deepagents/overview) on [LangGraph](https://github.com/langchain-ai/langgraphjs) |
| Observability | [LangSmith](https://smith.langchain.com/) |
| Models | GPT (via OpenRouter), DeepSeek (via OpenRouter), NVIDIA Nemotron (via OpenRouter), Gemini 2.5 Flash (via Google AI) |

---

## Project Structure

```
AI_Delphi_Techique/
├── backend/                   # Primary Node.js / Express backend
│   └── src/
│       ├── graph/
│       │   ├── graph.js      # Ordered Delphi workflow using DeepAgents
│       │   ├── nodes.js      # Per-model DeepAgents and result selection
│       │   └── state.js      # Graph state schema
│       ├── app.js            # Express app + /api/analyze route
│       └── index.js          # Entry point, dotenv config
├── server/                    # Experimental Python / FastAPI alternative
│   ├── graph/
│   │   ├── graph.py          # LangGraph state machine definition
│   │   └── nodes.py          # All AI model nodes (base + refine + select)
│   ├── main.py               # FastAPI app + /api/analyze route
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── pages/
        │   ├── Landing.tsx
        │   ├── ConsensusApp.tsx   # Main app page
        │   ├── HowItWorks.tsx
        │   └── History.tsx
        ├── components/
        │   ├── app/               # PromptInput, ReasoningPanel, PeerReview, ConsensusCard
        │   ├── landing/           # Hero, Features
        │   └── common/
        ├── types/index.ts
        └── utils/api.ts
```

---

## Screenshots

<!-- Replace with actual screenshots -->

| Page | Preview |
|---|---|
| Landing | ![Landing](https://res.cloudinary.com/pratikmahara/image/upload/v1781514544/Screenshot_2026-06-15_082226_jctj8o.png) |
| Consensus App | ![App](https://res.cloudinary.com/pratikmahara/image/upload/v1781514745/Screenshot_2026-06-15_091212_hzfkfe.png) |
| Reasoning Panel | ![Reasoning](https://res.cloudinary.com/pratikmahara/image/upload/v1781514958/0e4e385e-00f3-42f1-ae7c-f16995f82b87.png) |
| Final Answer | ![Final Answer](https://res.cloudinary.com/pratikmahara/image/upload/v1781514994/49ade31b-afad-4de0-a3c0-4fdecadb51ca.png) |
| LangSmith Trace | ![LangSmith](https://res.cloudinary.com/pratikmahara/image/upload/v1781514252/WhatsApp_Image_2026-06-15_at_14.47.35_d2mzsg.jpg) |

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- OpenRouter API key → [openrouter.ai](https://openrouter.ai)
- Google AI API key → [aistudio.google.com](https://aistudio.google.com)
- LangSmith API key (optional, for tracing) → [smith.langchain.com](https://smith.langchain.com)

### Setup and run

From the project root:

1. If needed, create `backend/.env` from `.env.example` (`cp .env.example backend/.env`), then set `OPENROUTER_API_KEY` and `GOOGLE_API_KEY`. These are needed for the default selection of all four models. The OpenRouter key is used for the OpenRouter-backed DeepAgents; no Anthropic key is required. For LangSmith tracing, create the `ai-delphi-technique` agent in an agent-based LangSmith workspace and set `LANGSMITH_API_KEY`; the example configures tracing to the `production` environment.
2. Install dependencies and start both the API and frontend:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend proxies `/api` requests to the Node API on port `5000` (override the proxy target with `VITE_API_PROXY_TARGET` in the root `.env`). The Node API reads `backend/.env`; provider and LangSmith keys are never sent to the browser. The health endpoint at `http://localhost:5000/api/health` shows whether required providers are configured without revealing key values.

The Python/FastAPI implementation in `server/` is an experimental alternative and is not started by the default command.

---

## API

### `POST /api/analyze`

**Request body:**
```json
{
  "prompt": "What is the best way to learn machine learning?"
}
```

**Request body:**
```json
{
  "prompt": "What is the best way to learn machine learning?",
  "mode": "delphi",
  "models": ["GPT", "DeepSeek", "NVIDIA", "Gemini"]
}
```

`mode` can be `fast` (initial answers only) or `delphi` (answers are refined and compared). `models` can include any non-empty selection of `GPT`, `DeepSeek`, `NVIDIA`, and `Gemini`.

The response contains the selected `finalAnswer`, `bestModel`, its `confidence`, per-model `refinedAnswers`, `peerReviews`, an explanation, and a timestamp. Successful results are saved in the browser's local history.

---

## LangSmith Observability

This project supports full LangGraph tracing via LangSmith. Each run is traced with:
- All node executions (base + refine + select)
- Token usage per model
- Confidence scores over time
- Full message history

<!-- Replace with LangSmith dashboard screenshot -->
![LangSmith Dashboard](https://res.cloudinary.com/pratikmahara/image/upload/v1781514254/WhatsApp_Image_2026-06-15_at_14.48.18_zw7dsq.jpg)

---

## Models Used

| Model | Provider | Purpose |
|---|---|---|
| `openai/gpt-oss-120b` | OpenRouter | Base + Refine |
| `tngtech/deepseek-r1t2-chimera` | OpenRouter | Base + Refine |
| `nvidia/nemotron-3-nano-30b-a3b` | OpenRouter | Base + Refine |
| `gemini-2.5-flash` | Google AI | Base + Refine |

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
