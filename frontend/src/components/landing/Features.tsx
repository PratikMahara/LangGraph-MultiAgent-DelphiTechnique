import { motion } from 'framer-motion';
import { Users, GitCompare, Shield, Eye } from 'lucide-react';
import Card from '../common/Card';

const features = [
  {
    icon: Users,
    title: 'Multi-Agent Reasoning',
    description: 'Multiple AI models work in parallel to analyze your question from different perspectives and expertise.',
    color: 'text-blue-400',
  },
  {
    icon: GitCompare,
    title: 'Cross-Model Verification',
    description: 'AI models peer-review each other\'s responses, identifying gaps, biases, and areas of agreement.',
    color: 'text-violet-400',
  },
  {
    icon: Shield,
    title: 'Bias Reduction',
    description: 'Consensus mechanism reduces individual model biases and hallucinations through collaborative validation.',
    color: 'text-green-400',
  },
  {
    icon: Eye,
    title: 'Transparent Decision Making',
    description: 'See exactly how the consensus was reached, with full visibility into each model\'s reasoning and reviews.',
    color: 'text-orange-400',
  },
];

export default function Features() {
  return (
    <div className="relative py-32 px-6 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Why Consensus AI?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Traditional single-model AI can be biased or hallucinate. Our platform uses the wisdom of multiple models to deliver more reliable, trustworthy answers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hover glass className="p-8 h-full">
                <div className={`${feature.color} mb-4 w-14 h-14 rounded-lg bg-gray-900/50 flex items-center justify-center`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
