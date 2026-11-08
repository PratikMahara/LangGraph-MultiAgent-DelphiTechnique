import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import HistoryItem from '../components/history/HistoryItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ConsensusResult } from '../types';
import { getHistory } from '../utils/api';

export default function History() {
  const [history, setHistory] = useState<ConsensusResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ConsensusResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(
        (item) =>
          item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.finalAnswer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
      setFilteredHistory(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not load saved history.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Query History
          </h1>
          <p className="text-gray-400 text-lg">
            Review your past consensus queries and results
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your queries..."
              className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {errorMessage ? (
          <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">
            {errorMessage}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner size="lg" text="Loading your history..." />
          </div>
        ) : filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-20"
          >
            <p className="text-gray-400 text-lg">
              {searchQuery ? 'No results found for your search.' : 'No queries yet. Start by asking a question!'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <HistoryItem result={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
