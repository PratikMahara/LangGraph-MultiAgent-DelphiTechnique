import { motion } from 'framer-motion';
import Card from '../common/Card';
import { Award, TrendingUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ConsensusCardProps {
  finalAnswer: string;
  confidence: number;
  explanation: string;
}

export default function ConsensusCard({ finalAnswer, confidence, explanation }: ConsensusCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-400';
    if (conf >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceLabel = (conf: number) => {
    if (conf >= 80) return 'High Confidence';
    if (conf >= 60) return 'Moderate Confidence';
    return 'Low Confidence';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-400" />
          Final Consensus
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      <Card glass className="p-8 border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-violet-500/5">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="transform -rotate-90" width="96" height="96">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-800"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className={getConfidenceColor(confidence)}
                    initial={{ strokeDasharray: '251.2', strokeDashoffset: '251.2' }}
                    animate={{
                      strokeDashoffset: 251.2 - (251.2 * confidence) / 100,
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getConfidenceColor(confidence)}`}>
                    {confidence}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className={`w-4 h-4 ${getConfidenceColor(confidence)}`} />
                <span className={getConfidenceColor(confidence)}>{getConfidenceLabel(confidence)}</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Answer</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Consensus Answer</h3>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <p className="text-white text-lg leading-relaxed">{finalAnswer}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-violet-400 mb-2">How We Reached This Consensus</h3>
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <p className="text-gray-300 leading-relaxed">{explanation}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
