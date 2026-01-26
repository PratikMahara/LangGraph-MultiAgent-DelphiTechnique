import { motion } from 'framer-motion';
import { useState } from 'react';
import Card from '../common/Card';
import { ChevronDown, ChevronUp, TrendingUp, MessageSquare, Clock } from 'lucide-react';
import { ConsensusResult } from '../../types';

interface HistoryItemProps {
  result: ConsensusResult;
}

export default function HistoryItem({ result }: HistoryItemProps) {
  const [expanded, setExpanded] = useState(false);

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-400';
    if (conf >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card glass className="overflow-hidden">
      <motion.div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white line-clamp-1">{result.prompt}</h3>
            </div>
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{result.finalAnswer}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-400">{formatDate(result.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className={`w-4 h-4 ${getConfidenceColor(result.confidence)}`} />
                <span className={getConfidenceColor(result.confidence)}>{result.confidence}% confidence</span>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>
      </motion.div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-800"
        >
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Model Responses</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.modelResponses.map((modelResponse) => (
                  <div
                    key={modelResponse.model}
                    className="p-3 bg-gray-900/50 rounded-lg border border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{modelResponse.model}</span>
                      {modelResponse.confidence && (
                        <span className="text-sm text-gray-400">{modelResponse.confidence}%</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-3">{modelResponse.response}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-violet-400 mb-2">Peer Reviews</h4>
              <div className="space-y-2">
                {result.peerReviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 text-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white">{review.reviewer}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-gray-400">{review.reviewed}</span>
                      <span
                        className={`ml-auto px-2 py-0.5 rounded text-xs ${
                          review.agreement === 'agree'
                            ? 'bg-green-500/10 text-green-400'
                            : review.agreement === 'partial'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {review.agreement}
                      </span>
                    </div>
                    <p className="text-gray-400">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Consensus Explanation</h4>
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <p className="text-sm text-gray-400">{result.explanation}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
}
