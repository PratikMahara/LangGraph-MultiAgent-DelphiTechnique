import { motion } from 'framer-motion';
import ModelCard from './ModelCard';
import { ModelResponse } from '../../types';

interface ReasoningPanelProps {
  modelResponses: ModelResponse[];
}

export default function ReasoningPanel({ modelResponses }: ReasoningPanelProps) {
  if (modelResponses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        <h2 className="text-2xl font-bold text-white">Live Model Reasoning</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modelResponses.map((modelResponse) => (
          <ModelCard key={modelResponse.model} modelResponse={modelResponse} />
        ))}
      </div>
    </motion.div>
  );
}
