import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../common/Button";
import Card from "../common/Card";
import { Send, Zap, GitBranch } from "lucide-react";
import { ModelName } from "../../types";

interface PromptInputProps {
  onSubmit: (
    prompt: string,
    mode: "fast" | "delphi",
    models: ModelName[]
  ) => void;
  loading: boolean;
}

// 🔥 AI Steps
const steps = [
  "Connecting to GPT...",
  "GPT thinking...",
  "GPT replying...",
  "Consulting Gemini...",
  "Claude refining...",
  "DeepSeek analyzing...",
  "Finalizing answer...",
];

// 🔥 Fancy Loading Text
function FancyLoadingText() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % steps.length;
      setStep(i);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.span
      key={step}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative text-sm font-medium"
    >
      {/* 🌈 Gradient Text */}
      <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
        {steps[step]}
      </span>

      {/* ✨ Shimmer */}
      <motion.span
        className="absolute inset-0 bg-white/20 blur-sm"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.span>
  );
}

export default function PromptInput({ onSubmit, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"fast" | "delphi">("delphi");
  const [selectedModels, setSelectedModels] = useState<ModelName[]>([
    "GPT",
    "Gemini",
    "Claude",
    "DeepSeek",
  ]);

  const toggleModel = (model: ModelName) => {
    setSelectedModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : [...prev, model]
    );
  };

  const handleSubmitClick = () => {
    if (!prompt.trim() || selectedModels.length === 0) return;
    onSubmit(prompt, mode, selectedModels);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card glass className="p-6">
        <div className="space-y-6">

          {/* 🔥 Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Question
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a complex question that requires deep analysis..."
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
              rows={6}
              disabled={loading}
            />
          </div>

          {/* 🔥 Mode + Models */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Mode */}
            <div className="flex-1">
              <label className="text-sm text-gray-300 mb-2 block">Mode</label>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode("fast")}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                    mode === "fast"
                      ? "border-blue-500 text-blue-400"
                      : "border-gray-700 text-gray-400"
                  }`}
                >
                  <Zap className="w-4 h-4 inline mr-1" />
                  Fast Mode
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMode("delphi")}
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 ${
                    mode === "delphi"
                      ? "border-violet-500 text-violet-400"
                      : "border-gray-700 text-gray-400"
                  }`}
                >
                  <GitBranch className="w-4 h-4 inline mr-1" />
                  Delphi Mode
                </motion.button>
              </div>
            </div>

            {/* Models */}
            <div className="flex-1">
              <label className="text-sm text-gray-300 mb-2 block">
                Models
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["GPT", "Gemini", "Claude", "DeepSeek"] as ModelName[]).map(
                  (model) => (
                    <button
                      key={model}
                      onClick={() => toggleModel(model)}
                      disabled={loading}
                      className={`py-2 px-3 rounded-lg border ${
                        selectedModels.includes(model)
                          ? "border-blue-500 text-blue-400"
                          : "border-gray-700 text-gray-400"
                      }`}
                    >
                      {model}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* 🔥 SUPER BUTTON */}
          <Button
            onClick={handleSubmitClick}
            disabled={!prompt.trim() || selectedModels.length === 0 || loading}
            className="w-full relative overflow-hidden group"
            size="lg"
          >

            {/* 🌈 Moving Gradient */}
            {loading && (
              <motion.div
                className="absolute inset-0 opacity-30 blur-xl"
                animate={{
                  background: [
                    "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
                    "linear-gradient(90deg, #ec4899, #3b82f6, #8b5cf6)",
                    "linear-gradient(90deg, #8b5cf6, #ec4899, #3b82f6)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}

            {/* ⚡ Shine Sweep */}
            {loading && (
              <motion.div
                className="absolute top-0 left-[-100%] h-full w-[50%] bg-white/10 skew-x-12"
                animate={{ left: ["-100%", "150%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}

            {/* 🔥 Glow */}
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              animate={
                loading
                  ? {
                      boxShadow: [
                        "0 0 10px rgba(59,130,246,0.4)",
                        "0 0 20px rgba(139,92,246,0.6)",
                        "0 0 25px rgba(236,72,153,0.6)",
                        "0 0 10px rgba(59,130,246,0.4)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* CONTENT */}
            <span className="relative flex items-center justify-center gap-2 font-medium">

              {!loading ? (
                <>
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                    Analyze with AI Consensus
                  </span>
                  <Send className="w-5 h-5" />
                </>
              ) : (
                <FancyLoadingText />
              )}

            </span>
          </Button>

        </div>
      </Card>
    </div>
  );
}