import axios from 'axios';
import type { AgreementLevel, ConsensusResult, ModelName, ModelResponse } from '../types';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://langgraph-multiagent-delphitechnique.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface AnalysisResponse {
  finalAnswer: string;
  bestModel: ModelName;
  confidence: number;
  explanation: string;
  refinedAnswers: Array<{
    model: ModelName;
    answer: string;
    confidence: number;
  }>;
  peerReviews: Array<{
    reviewer: ModelName;
    reviewed: ModelName;
    agreement: AgreementLevel;
    comment: string;
  }>;
  timestamp: string;
}

const HISTORY_KEY = 'delphi-consensus-history';
const MAX_HISTORY_ITEMS = 50;

export const analyzePrompt = async (
  prompt: string,
  mode: 'fast' | 'delphi',
  models: ModelName[]
): Promise<ConsensusResult> => {
  try {
    const { data } = await api.post<AnalysisResponse>('/api/analyze', { prompt, mode, models });
    const result: ConsensusResult = {
      id: `${Date.now()}`,
      prompt,
      finalAnswer: data.finalAnswer,
      confidence: data.confidence,
      explanation: data.explanation,
      modelResponses: data.refinedAnswers.map((item): ModelResponse => ({
        model: item.model,
        status: 'completed',
        response: item.answer,
        confidence: item.confidence,
      })),
      peerReviews: data.peerReviews,
      timestamp: data.timestamp,
    };
    saveHistory(result);
    return result;
  } catch (error) {
    if (axios.isAxiosError<{ error?: string }>(error)) {
      throw new Error(error.response?.data?.error || 'Could not reach the API server. Start it with `npm run dev`.');
    }
    throw error;
  }
};

function isConsensusResult(value: unknown): value is ConsensusResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Partial<ConsensusResult>;
  return (
    typeof result.id === 'string' &&
    typeof result.prompt === 'string' &&
    typeof result.finalAnswer === 'string' &&
    typeof result.timestamp === 'string' &&
    Array.isArray(result.modelResponses) &&
    Array.isArray(result.peerReviews)
  );
}

function saveHistory(result: ConsensusResult) {
  const history = getHistory();
  const updated = [result, ...history.filter((item) => item.id !== result.id)]
    .slice(0, MAX_HISTORY_ITEMS);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function getHistory(): ConsensusResult[] {
  const stored = window.localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || !parsed.every(isConsensusResult)) {
    throw new Error("Saved query history is invalid. Clear this browser's site data to reset it.");
  }
  return parsed;
}
