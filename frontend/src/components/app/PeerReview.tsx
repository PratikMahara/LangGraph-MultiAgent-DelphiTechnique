import { motion } from 'framer-motion';
import Card from '../common/Card';
import { CheckCircle, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
import { PeerReview as PeerReviewType } from '../../types';

const agreementConfig = {
  agree: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    label: 'Agrees',
  },
  partial: {
    icon: AlertCircle,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    label: 'Partially Agrees',
  },
  disagree: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    label: 'Disagrees',
  },
};

interface PeerReviewProps {
  peerReviews: PeerReviewType[];
}

export default function PeerReview({ peerReviews }: PeerReviewProps) {
  if (peerReviews.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        <h2 className="text-2xl font-bold text-white">Peer Review Timeline</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>

      <div className="relative space-y-4">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-transparent" />

        {peerReviews.map((review, index) => {
          const config = agreementConfig[review.agreement];
          const Icon = config.icon;

          return (
            <motion.div
              key={`${review.reviewer}-${review.reviewed}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative pl-16"
            >
              <div className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-900 border-2 border-blue-500 flex items-center justify-center z-10">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>

              <Card glass className={`p-4 ${config.borderColor} border-l-4`}>
                <div className="flex items-start gap-4">
                  <div className={`${config.bgColor} ${config.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-white">{review.reviewer}</span>
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{review.reviewed}</span>
                      <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
