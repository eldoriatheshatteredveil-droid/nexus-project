import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Maximize, Minimize, Activity, Cpu, Wifi, Battery } from 'lucide-react';
import { useStore } from '../store';
import SnakeGame from '../components/SnakeGame';
import GuessNumberGame from '../components/GuessNumberGame';
import TwentyQuestionsGame from '../components/TwentyQuestionsGame';
import NexusPong from '../components/NexusPong';
import NexusBreakout from '../components/NexusBreakout';
import VoidVanguard from '../components/VoidVanguard';
import CyberCursor from '../components/CyberCursor';
import { useCyberSound } from '../hooks/useCyberSound';

const PlayGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const games = useStore((state) => state.games);
  const game = games.find((g) => g.id === gameId);
  const { playClick, playHover } = useCyberSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    const timer = setInterval(() => {
      setSystemTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearInterval(timer);
    };
  }, []);

  if (!game) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono">
        <h1 className="text-4xl text-red-500 mb-4 font-bold tracking-widest animate-pulse">ERROR: 404</h1>
        <p className="text-[#00ffd5] mb-8">GAME_DATA_CORRUPTED_OR_MISSING</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 border border-[#00ffd5] text-[#00ffd5] hover:bg-[#00ffd5] hover:text-black transition-all duration-300 uppercase tracking-widest"
        >
          Return to Nexus
        </button>
      </div>
    );
  }

  const toggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleExit = () => {
    playClick();
    navigate('/');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden cursor-none font-mono text-[#00ffd5]">
      <CyberCursor />
      
      {/* Animated Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Base Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffd510_1px,transparent_1px),linear-gradient(to_bottom,#00ffd510_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Moving Scanline */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ffd5]/5 to-transparent animate-scan pointer-events-none" />
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ffd5]/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff66cc]/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>
      
      {/* HUD Header */}
      <header className="relative z-20 flex justify-between items-center px-8 py-6 bg-black/40 backdrop-blur-md border-b border-[#00ffd5]/20">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <button 
            onClick={handleExit}
            onMouseEnter={playHover}
            className="group flex items-center gap-3 text-gray-400 hover:text-[#00ffd5] transition-all duration-300"
          >
            <div className="p-2 border border-white/10 rounded group-hover:border-[#00ffd5] group-hover:bg-[#00ffd5]/10 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span className="font-bold tracking-widest text-sm group-hover:translate-x-1 transition-transform">ABORT</span>
          </button>

          <div className="hidden md:flex items-center gap-6 text-[10px] text-[#00ffd5]/60 tracking-widest border-l border-[#00ffd5]/20 pl-6">
            <div className="flex items-center gap-2">
              <Activity size={14} className="animate-pulse" />
              <span>SYS: OPTIMAL</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi size={14} />
              <span>NET: SECURE</span>
            </div>
          </div>
        </div>

        {/* Center Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center hidden sm:block">
          <h1 className="text-2xl md:text-3xl font-orbitron font-bold text-white tracking-[0.2em] drop-shadow-[0_0_10px_rgba(0,255,213,0.5)]">
            {game.title.toUpperCase()}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="w-2 h-2 bg-[#00ffd5] rounded-full animate-ping" />
            <span className="text-[10px] text-[#00ffd5] tracking-[0.3em] uppercase">Simulation Active</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block text-right">
            <div className="text-xs text-white font-bold tracking-widest">{systemTime}</div>
            <div className="text-[10px] text-[#00ffd5]/60 tracking-wider">SESSION_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
          </div>
          
          <button 
            onClick={toggleFullscreen}
            onMouseEnter={playHover}
            className="p-2 text-gray-400 hover:text-[#00ffd5] border border-white/10 hover:border-[#00ffd5] hover:bg-[#00ffd5]/10 rounded transition-all duration-300"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-grow relative z-10 flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-6xl bg-black/60 border border-[#00ffd5]/30 rounded-xl shadow-[0_0_50px_rgba(0,255,213,0.05)] backdrop-blur-sm overflow-hidden"
        >
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#00ffd5] rounded-tl-xl opacity-50" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#00ffd5] rounded-tr-xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#00ffd5] rounded-bl-xl opacity-50" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00ffd5] rounded-br-xl opacity-50" />

          {/* Inner Frame Glow */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,255,213,0.05)] pointer-events-none" />

          {/* Game Content Wrapper */}
          <div className="p-8 md:p-12 flex justify-center min-h-[600px] items-center relative z-10">
            {game.id === 'nvious-snake' && <SnakeGame />}
            {game.id === 'nvious-cyber-guess' && <GuessNumberGame />}
            {game.id === 'nvious-20-questions' && <TwentyQuestionsGame />}
            {game.id === 'nexus-pong' && <NexusPong />}
            {game.id === 'nexus-breakout' && <NexusBreakout />}
            {game.id === 'void-vanguard' && <VoidVanguard />}
          </div>

          {/* CRT Scanline Overlay for the Game Frame */}
          <div className="pointer-events-none absolute inset-0 z-20 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{ backgroundSize: "100% 2px, 3px 100%" }} />
        </motion.div>
      </main>

      {/* Footer Status Bar */}
      <footer className="relative z-20 py-2 px-6 bg-black/80 border-t border-[#00ffd5]/20 flex justify-between items-center text-[10px] text-[#00ffd5]/40 uppercase tracking-widest backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Cpu size={12} />
            <span>CPU: QUANTUM-CORE</span>
          </div>
          <div className="w-[1px] h-3 bg-[#00ffd5]/20" />
          <div className="flex items-center gap-2">
            <Battery size={12} />
            <span>PWR: 98%</span>
          </div>
        </div>
        <div>
          NEXUS OS v1.0.0 // BUILD 2025.11.21
        </div>
      </footer>
    </div>
  );
};

export default PlayGame;

