import { motion } from 'framer-motion';
import Card from '../common/Card';
import { Brain, Sparkles, Box, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ModelResponse } from '../../types';

const modelIcons = {
  GPT: Brain,
  Gemini: Sparkles,
  Claude: Box,
  DeepSeek: Zap,
};

const modelColors = {
  GPT: 'text-green-400',
  Gemini: 'text-blue-400',
  Claude: 'text-orange-400',
  DeepSeek: 'text-purple-400',
};

const statusConfig = {
  thinking: { icon: Loader2, color: 'text-gray-400', label: 'Thinking...', animate: true },
  reviewing: { icon: Loader2, color: 'text-blue-400', label: 'Reviewing...', animate: true },
  completed: { icon: CheckCircle, color: 'text-green-400', label: 'Completed', animate: false },
  failed: { icon: XCircle, color: 'text-red-400', label: 'Failed', animate: false },
};

interface ModelCardProps {
  modelResponse: ModelResponse;
}

export default function ModelCard({ modelResponse }: ModelCardProps) {
  const Icon = modelIcons[modelResponse.model];
  const statusInfo = statusConfig[modelResponse.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Card glass className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${modelColors[modelResponse.model]} p-2 rounded-lg bg-gray-900/50`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{modelResponse.model}</h3>
            <div className="flex items-center gap-2 mt-1">
              <StatusIcon
                className={`w-4 h-4 ${statusInfo.color} ${statusInfo.animate ? 'animate-spin' : ''}`}
              />
              <span className={`text-sm ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
          </div>
        </div>
        {modelResponse.confidence !== undefined && (
          <div className="text-right">
            <div className="text-sm text-gray-400">Confidence</div>
            <div className="text-lg font-bold text-white">{modelResponse.confidence}%</div>
          </div>
        )}
      </div>

      {modelResponse.response && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-300 leading-relaxed">{modelResponse.response}</p>
          </div>
        </motion.div>
      )}

      {!modelResponse.response && modelResponse.status !== 'failed' && (
        <div className="mt-4 space-y-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 bg-gray-800 rounded"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
              style={{ width: `${100 - i * 20}%` }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
