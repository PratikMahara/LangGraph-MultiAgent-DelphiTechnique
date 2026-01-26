import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Box } from 'lucide-react';

const models = [
  { name: 'GPT', icon: Brain, color: 'text-green-400' },
  { name: 'Gemini', icon: Sparkles, color: 'text-blue-400' },
  { name: 'Claude', icon: Box, color: 'text-orange-400' },
  { name: 'DeepSeek', icon: Zap, color: 'text-purple-400' },
];

export default function ModelLogos() {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
        Powered by Leading AI Models
      </p>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {models.map((model, index) => (
          <motion.div
            key={model.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.1, y: -4 }}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className={`${model.color} p-4 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 group-hover:border-current transition-all duration-300`}>
              <model.icon className="w-8 h-8" />
            </div>
            <span className="text-gray-300 font-medium">{model.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
