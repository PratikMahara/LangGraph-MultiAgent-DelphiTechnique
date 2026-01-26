import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Card from '../common/Card';
import { Send, Zap, GitBranch } from 'lucide-react';
import { ModelName } from '../../types';

interface PromptInputProps {
  onSubmit: (prompt: string, mode: 'fast' | 'delphi', models: ModelName[]) => void;
  loading: boolean;
}

export default function PromptInput({ onSubmit, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'fast' | 'delphi'>('delphi');
  const [selectedModels, setSelectedModels] = useState<ModelName[]>(['GPT', 'Gemini', 'Claude', 'DeepSeek']);

  const handleSubmit = () => {
    if (prompt.trim() && selectedModels.length > 0) {
      onSubmit(prompt, mode, selectedModels);
    }
  };

  const toggleModel = (model: ModelName) => {
    setSelectedModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  return (
    <Card glass className="p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Question</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a complex question that requires deep analysis and multiple perspectives..."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            rows={6}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Mode</label>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('fast')}
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  mode === 'fast'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <Zap className="w-4 h-4" />
                Fast Mode
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode('delphi')}
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  mode === 'delphi'
                    ? 'border-violet-500 bg-violet-500/10 text-violet-400'
                    : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-600'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                Delphi Mode
              </motion.button>
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Models</label>
            <div className="grid grid-cols-2 gap-2">
              {(['GPT', 'Gemini', 'Claude', 'DeepSeek'] as ModelName[]).map(model => (
                <motion.button
                  key={model}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleModel(model)}
                  disabled={loading}
                  className={`py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                    selectedModels.includes(model)
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {model}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!prompt.trim() || selectedModels.length === 0 || loading}
          loading={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Processing...' : 'Analyze with AI Consensus'}
          {!loading && <Send className="w-5 h-5" />}
        </Button>
      </div>
    </Card>
  );
}
