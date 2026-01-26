import { motion } from 'framer-motion';
import StepDiagram from '../components/how-it-works/StepDiagram';
import { Lightbulb, Shield, Target } from 'lucide-react';
import Card from '../components/common/Card';

const principles = [
  {
    icon: Lightbulb,
    title: 'The Delphi Technique',
    description:
      'Named after the Oracle of Delphi, this method achieves consensus through structured rounds of expert input and feedback. We apply this proven methodology to AI reasoning.',
    color: 'text-yellow-400',
  },
  {
    icon: Shield,
    title: 'Reduces Hallucinations',
    description:
      'By cross-verifying responses across multiple models, we dramatically reduce the risk of AI hallucinations and false information.',
    color: 'text-green-400',
  },
  {
    icon: Target,
    title: 'Higher Accuracy',
    description:
      'Consensus-based approaches have been shown to outperform individual models, especially for complex reasoning tasks and nuanced questions.',
    color: 'text-blue-400',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            How Consensus AI Works
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Our platform uses the Delphi technique to achieve consensus among multiple AI models,
            delivering more reliable and trustworthy answers.
          </p>
        </motion.div>

        <div className="mb-20">
          <StepDiagram />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Why This Approach Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover glass className="p-8 text-center h-full">
                  <div className={`${principle.color} mb-4 flex justify-center`}>
                    <div className="w-16 h-16 rounded-xl bg-gray-900/50 flex items-center justify-center">
                      <principle.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{principle.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{principle.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card glass className="p-12 bg-gradient-to-br from-blue-500/5 to-violet-500/5 border-blue-500/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Experience AI Consensus?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Try our platform and get reliable, cross-verified answers to your most complex questions.
            </p>
            <motion.a
              href="/app"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/30 transition-all"
            >
              Start Using Consensus AI
            </motion.a>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
