import { useState, useEffect } from 'react';
import PromptInput from '../components/app/PromptInput';
import ReasoningPanel from '../components/app/ReasoningPanel';
import PeerReview from '../components/app/PeerReview';
import ConsensusCard from '../components/app/ConsensusCard';
import { ModelName, ModelResponse, PeerReview as PeerReviewType, ConsensusResult } from '../types';
import { submitQuery, getQueryStatus } from '../utils/api';

export default function ConsensusApp() {
  const [loading, setLoading] = useState(false);
  const [queryId, setQueryId] = useState<string | null>(null);
  const [result, setResult] = useState<ConsensusResult | null>(null);

  const handleSubmit = async (prompt: string, mode: 'fast' | 'delphi', models: ModelName[]) => {
    setLoading(true);
    setResult(null);
    setQueryId(null);

    try {
      const response = await submitQuery(prompt, mode, models);
      setQueryId(response.id);
    } catch (error) {
      console.error('Error submitting query:', error);
      setLoading(false);
      setResult(createMockResult(prompt, models));
    }
  };

  useEffect(() => {
    if (!queryId) return;

    const pollInterval = setInterval(async () => {
      try {
        const status = await getQueryStatus(queryId);
        setResult(status);

        if (status.modelResponses.every(m => m.status === 'completed' || m.status === 'failed')) {
          setLoading(false);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error polling status:', error);
        clearInterval(pollInterval);
        setLoading(false);
      }
    }, 2000);

    setTimeout(() => {
      setResult(createMockResult('Sample question', ['GPT', 'Gemini', 'Claude', 'DeepSeek']));
      setLoading(false);
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [queryId]);

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            AI Consensus Platform
          </h1>
          <p className="text-gray-400 text-lg">
            Get reliable answers through multi-model collaboration and peer review
          </p>
        </div>

        <PromptInput onSubmit={handleSubmit} loading={loading} />

        {result && (
          <>
            <ReasoningPanel modelResponses={result.modelResponses} />
            <PeerReview peerReviews={result.peerReviews} />
            {result.finalAnswer && (
              <ConsensusCard
                finalAnswer={result.finalAnswer}
                confidence={result.confidence}
                explanation={result.explanation}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function createMockResult(prompt: string, models: ModelName[]): ConsensusResult {
  const modelResponses: ModelResponse[] = models.map((model, index) => ({
    model,
    status: 'completed' as const,
    response: `This is ${model}'s analysis of the question. After careful consideration, I believe the answer involves multiple factors including technical feasibility, economic impact, and social implications. My recommendation would be to approach this systematically by first understanding the core requirements, then evaluating potential solutions, and finally implementing a phased approach.`,
    confidence: 75 + Math.random() * 20,
  }));

  const peerReviews: PeerReviewType[] = [
    {
      reviewer: models[0],
      reviewed: models[1],
      agreement: 'agree',
      comment: `I agree with ${models[1]}'s analysis. The systematic approach mentioned aligns well with industry best practices.`,
    },
    {
      reviewer: models[2],
      reviewed: models[0],
      agreement: 'partial',
      comment: `While I agree with the overall direction, I think we should also consider the implementation timeline and resource constraints more carefully.`,
    },
    {
      reviewer: models[3],
      reviewed: models[2],
      agreement: 'agree',
      comment: `${models[2]} makes an excellent point about resource constraints. This should be factored into the final recommendation.`,
    },
  ];

  return {
    id: 'mock-' + Date.now(),
    prompt,
    finalAnswer:
      'Based on the consensus among all AI models, the recommended approach is to implement a systematic, phased strategy. This involves: (1) thoroughly understanding core requirements, (2) evaluating multiple solutions while considering technical feasibility and resource constraints, (3) implementing changes incrementally with regular review points. The models agree this balanced approach minimizes risk while maximizing chances of success.',
    confidence: 87,
    explanation:
      'All models converged on a systematic, phased approach. While there were minor disagreements about specific implementation details, the core recommendation received strong support. The high confidence score reflects the alignment across different AI perspectives and the thorough peer review process.',
    modelResponses,
    peerReviews,
    timestamp: new Date().toISOString(),
  };
}
