import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ThemeManager from './components/ThemeManager';
import MusicPlayer from './components/MusicPlayer';

// Lazy Load Pages for Performance
const Home = lazy(() => import('./pages/Home'));
const Upload = lazy(() => import('./pages/Upload'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const PlayGame = lazy(() => import('./pages/PlayGame'));
const Profile = lazy(() => import('./pages/Profile'));
const SimulatedEmail = lazy(() => import('./pages/SimulatedEmail'));
const NexusAI = lazy(() => import('./pages/NexusAI'));

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-[#00ffd5] font-mono">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#00ffd5] border-t-transparent rounded-full animate-spin" />
      <div className="animate-pulse tracking-widest">LOADING_ASSETS...</div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <ThemeManager />
      <MusicPlayer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Game Route - No Layout */}
          <Route path="/play/:gameId" element={<PlayGame />} />
          
          {/* Simulated Email Route - No Layout */}
          <Route path="/verify-email-simulation" element={<SimulatedEmail />} />

          {/* Main Routes - With Layout */}
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nexus" element={<NexusAI />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
