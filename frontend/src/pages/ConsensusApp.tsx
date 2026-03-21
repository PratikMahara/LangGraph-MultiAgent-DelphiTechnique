import { useState } from "react";
import PromptInput from "../components/app/PromptInput";
import ReasoningPanel from "../components/app/ReasoningPanel";
import PeerReview from "../components/app/PeerReview";
import ConsensusCard from "../components/app/ConsensusCard";
import { ModelName, ConsensusResult } from "../types";

export default function ConsensusApp() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsensusResult | null>(null);

  const handleSubmit = async (
    prompt: string,
    mode: "fast" | "delphi",
    models: ModelName[]
  ) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Backend failed");
      }

      const apiData = await response.json();
      console.log("API DATA:", apiData);

      // ✅ SAFE MODEL NAME MAP
      const modelMap: any = {
        gpt: "GPT",
        gemini: "Gemini",
        claude: "Claude",
        deepseek: "DeepSeek",
        nvidia: "Nvidia",
      };

      // ✅ Transform backend → UI format
      const modelResponses = apiData.refinedAnswers.map((item: any) => {
        let cleanAnswer = item.answer;

        // 🔥 Fix NVIDIA JSON issue
        try {
          if (cleanAnswer.includes("{")) {
            const parsed = JSON.parse(
              cleanAnswer.replace(/```json|```/g, "").trim()
            );
            cleanAnswer = parsed.answer;
          }
        } catch {}

        return {
          model: modelMap[item.model?.toLowerCase()] || "Unknown",
          status: "completed",
          response: cleanAnswer || "No response available",
          confidence: item.confidence ?? 0,
        };
      });

      const formattedResult: ConsensusResult = {
        id: "live-" + Date.now(),
        prompt,
        modelResponses,
        peerReviews: [],
        finalAnswer: apiData.finalAnswer || "No final answer",
        confidence: 90,
        explanation: "Generated via multi-model consensus",
        timestamp: new Date().toISOString(),
      };

      setResult(formattedResult);
    } catch (error) {
      console.error("Error:", error);
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