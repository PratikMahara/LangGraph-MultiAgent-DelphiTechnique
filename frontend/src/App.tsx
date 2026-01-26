import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/common/Navigation';
import Landing from './pages/Landing';
import ConsensusApp from './pages/ConsensusApp';
import History from './pages/History';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<ConsensusApp />} />
          <Route path="/history" element={<History />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
