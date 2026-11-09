import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const steps = [
  "Sending your question to the selected models",
  "Models are preparing their responses",
  "Comparing perspectives and confidence",
  "Preparing your consensus answer",
];

export default function PromptInput({ onSubmit, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"fast" | "delphi">("delphi");
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const requestStartedAt = useRef<number | null>(null);
  const [selectedModels, setSelectedModels] = useState<ModelName[]>([
    "GPT",
    "Gemini",
    "DeepSeek",
    "NVIDIA",
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let finishTimeout: ReturnType<typeof setTimeout> | undefined;

    if (loading) {
      requestStartedAt.current = Date.now();
      setProgress(1);
      setLoadingStep(0);
      setShowProgress(true);
      interval = setInterval(() => {
        const startedAt = requestStartedAt.current;
        if (startedAt === null) return;
        const elapsed = Date.now() - startedAt;
        setProgress(Math.min(97, Math.floor(1 + (1 - Math.exp(-elapsed / 14000)) * 96)));
        setLoadingStep(Math.min(steps.length - 1, Math.floor(elapsed / 5000)));
      }, 200);
    } else if (requestStartedAt.current !== null) {
      setProgress(100);
      setLoadingStep(steps.length - 1);
      finishTimeout = setTimeout(() => {
        setShowProgress(false);
        setProgress(0);
        requestStartedAt.current = null;
      }, 700);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, [loading]);

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
                {(["GPT", "Gemini", "DeepSeek", "NVIDIA"] as ModelName[]).map(
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
                <>
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Analyzing perspectives...</span>
                </>
              )}

            </span>
          </Button>

          <AnimatePresence>
            {showProgress && (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-violet-500/20 bg-gray-950/60 p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={loadingStep}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="truncate text-sm font-medium text-gray-200"
                        >
                          {progress === 100 ? "Request finished" : steps[loadingStep]}
                        </motion.p>
                      </AnimatePresence>
                      <p className="mt-1 text-xs text-gray-500">
                        {progress === 100
                          ? "The request has completed."
                          : "Progress is an estimate while we wait for the models."}
                      </p>
                    </div>
                    <motion.span
                      key={progress}
                      initial={{ opacity: 0.5, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="shrink-0 font-mono text-lg font-semibold tabular-nums text-violet-300"
                    >
                      {progress}%
                    </motion.span>
                  </div>

                  <div
                    role="progressbar"
                    aria-label="Estimated analysis progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    className="h-2 overflow-hidden rounded-full bg-gray-800"
                  >
                    <motion.div
                      className="relative h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      {loading && (
                        <motion.div
                          className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                          animate={{ x: [-64, 280] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </Card>
    </div>
  );
}