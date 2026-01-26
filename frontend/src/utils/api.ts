import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ModelResponse {
  model: string;
  status: 'thinking' | 'reviewing' | 'completed' | 'failed';
  response: string;
  confidence?: number;
}

export interface PeerReview {
  reviewer: string;
  reviewed: string;
  agreement: 'agree' | 'partial' | 'disagree';
  comment: string;
}

export interface ConsensusResult {
  id: string;
  prompt: string;
  finalAnswer: string;
  confidence: number;
  explanation: string;
  modelResponses: ModelResponse[];
  peerReviews: PeerReview[];
  timestamp: string;
}

export interface QueryResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
}

export const submitQuery = async (
  prompt: string,
  mode: 'fast' | 'delphi',
  models: string[]
): Promise<QueryResponse> => {
  const response = await api.post('/query', { prompt, mode, models });
  return response.data;
};

export const getQueryStatus = async (id: string): Promise<ConsensusResult> => {
  const response = await api.get(`/status/${id}`);
  return response.data;
};

export const getHistory = async (): Promise<ConsensusResult[]> => {
  const response = await api.get('/history');
  return response.data;
};

export default api;
