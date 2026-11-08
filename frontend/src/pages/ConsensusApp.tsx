import { useState } from "react";
import PromptInput from "../components/app/PromptInput";
import ReasoningPanel from "../components/app/ReasoningPanel";
import PeerReview from "../components/app/PeerReview";
import ConsensusCard from "../components/app/ConsensusCard";
import { ModelName, ConsensusResult } from "../types";
import { analyzePrompt } from "../utils/api";

export default function ConsensusApp() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsensusResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (
    prompt: string,
    mode: "fast" | "delphi",
    models: ModelName[]
  ) => {
    setLoading(true);
    setResult(null);
    setErrorMessage("");

    try {
      setResult(await analyzePrompt(prompt, mode, models));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "The analysis could not be completed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            AI Consensus Platform
          </h1>
          <p className="text-gray-400 text-lg">
            Multi-model reasoning and unified answers
          </p>
        </div>

        {/* Input */}
        <PromptInput onSubmit={handleSubmit} loading={loading} />

        {errorMessage && (
          <div role="alert" className="mx-auto max-w-5xl rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            <ReasoningPanel modelResponses={result.modelResponses || []} />
            <PeerReview peerReviews={result.peerReviews || []} />

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