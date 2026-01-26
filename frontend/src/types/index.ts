export type ModelName = 'GPT' | 'Gemini' | 'Claude' | 'DeepSeek';

export type ModelStatus = 'thinking' | 'reviewing' | 'completed' | 'failed';

export type AgreementLevel = 'agree' | 'partial' | 'disagree';

export interface ModelResponse {
  model: ModelName;
  status: ModelStatus;
  response: string;
  confidence?: number;
}

export interface PeerReview {
  reviewer: ModelName;
  reviewed: ModelName;
  agreement: AgreementLevel;
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
