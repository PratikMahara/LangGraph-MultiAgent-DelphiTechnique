import { motion } from 'framer-motion';
import { MessageSquare, Users, GitCompare, Award, ArrowDown } from 'lucide-react';
import Card from '../common/Card';

const steps = [
  {
    number: 1,
    title: 'Prompt Ingestion',
    icon: MessageSquare,
    color: 'from-blue-500 to-blue-600',
    description:
      'You submit a complex question or problem that requires deep analysis. The system processes your input and prepares it for distribution to multiple AI models.',
    details: [
      'Question parsing and optimization',
      'Context extraction',
      'Model selection based on query type',
    ],
  },
  {
    number: 2,
    title: 'Parallel Expert Answers',
    icon: Users,
    color: 'from-violet-500 to-violet-600',
    description:
      'Multiple AI models (GPT, Gemini, Claude, DeepSeek) independently analyze your question. Each brings unique training, perspectives, and reasoning approaches.',
    details: [
      'Independent analysis by each model',
      'Diverse reasoning approaches',
      'Initial confidence scoring',
    ],
  },
  {
    number: 3,
    title: 'Peer Review Process',
    icon: GitCompare,
    color: 'from-green-500 to-green-600',
    description:
      'Each AI model reviews the responses from other models. They identify areas of agreement, challenge assumptions, and highlight gaps in reasoning.',
    details: [
      'Cross-model evaluation',
      'Bias identification',
      'Agreement level assessment',
      'Constructive critique',
    ],
  },
  {
    number: 4,
    title: 'Consensus Arbitration',
    icon: Award,
    color: 'from-orange-500 to-orange-600',
    description:
      'The system synthesizes all responses and peer reviews to generate a final consensus answer. This balances different perspectives while highlighting the strongest supported conclusions.',
    details: [
      'Response synthesis',
      'Confidence calculation',
      'Evidence-based recommendation',
      'Transparency report generation',
    ],
  },
];

export default function StepDiagram() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.number} className="relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card glass className="p-8 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start gap-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </motion.div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-gray-500">STEP {step.number}</span>
                    <div className="h-px flex-1 bg-gray-800" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{step.description}</p>
                  <div className="space-y-2">
                    {step.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.2 + i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color}`} />
                        <span className="text-sm text-gray-500">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {index < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
              viewport={{ once: true }}
              className="flex justify-center mb-12"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-blue-500"
              >
                <ArrowDown className="w-8 h-8" />
              </motion.div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
