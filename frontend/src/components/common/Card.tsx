import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className = '', hover = false, glass = false }: CardProps) {
  const glassStyles = glass
    ? 'bg-gray-900/40 backdrop-blur-xl border border-gray-800/50'
    : 'bg-gray-900/80 border border-gray-800';

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.15)' } : {}}
      transition={{ duration: 0.2 }}
      className={`rounded-xl ${glassStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
}
