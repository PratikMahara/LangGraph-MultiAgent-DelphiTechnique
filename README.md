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
| Backend | Node.js, Express |
| AI Orchestration | [LangGraph](https://github.com/langchain-ai/langgraphjs) |
| Observability | [LangSmith](https://smith.langchain.com/) |
| Models | GPT (via OpenRouter), DeepSeek (via OpenRouter), NVIDIA Nemotron (via OpenRouter), Gemini 2.5 Flash (via Google AI) |

---

## Project Structure

```
AI_Delphi_Techique/
├── backend/
│   └── src/
│       ├── graph/
│       │   ├── graph.js      # LangGraph state machine definition
│       │   ├── nodes.js      # All AI model nodes (base + refine + select)
│       │   └── state.js      # Graph state schema
│       ├── app.js            # Express app + /api/analyze route
│       └── index.js          # Entry point, dotenv config
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

- Node.js 18+
- OpenRouter API key → [openrouter.ai](https://openrouter.ai)
- Google AI API key → [aistudio.google.com](https://aistudio.google.com)
- LangSmith API key (optional, for tracing) → [smith.langchain.com](https://smith.langchain.com)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/AI_Delphi_Techique.git
cd AI_Delphi_Techique
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
OPENROUTER_API_KEY=<your_openrouter_api_key>
GOOGLE_API_KEY=<your_google_api_key>

# Optional — LangSmith tracing
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=<your_langsmith_api_key>
LANGCHAIN_PROJECT=ai-delphi-technique
```

```bash
npm start
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

---

## API

### `POST /api/analyze`

**Request body:**
```json
{
  "prompt": "What is the best way to learn machine learning?"
}
```

**Response:**
```json
{
  "finalAnswer": "...",
  "bestModel": "GPT",
  "refinedAnswers": [
    { "model": "gpt", "answer": "...", "confidence": 88 },
    { "model": "deepseek", "answer": "...", "confidence": 75 },
    { "model": "nvidia", "answer": "...", "confidence": 70 },
    { "model": "gemini", "answer": "...", "confidence": 82 }
  ]
}
```

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
