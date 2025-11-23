import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import About from './pages/About';
import PlayGame from './pages/PlayGame';
import Profile from './pages/Profile';
import SimulatedEmail from './pages/SimulatedEmail';
import NexusAI from './pages/NexusAI';
import ThemeManager from './components/ThemeManager';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeManager />
      <MusicPlayer />
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
    </Router>
  );
};

export default App;
