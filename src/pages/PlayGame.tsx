import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize, Minimize, Activity, Cpu, Wifi, Battery, Zap, Globe, Shield } from 'lucide-react';
import { useStore } from '../store';
import SnakeGame from '../components/SnakeGame';
import GuessNumberGame from '../components/GuessNumberGame';
import TwentyQuestionsGame from '../components/TwentyQuestionsGame';
import NexusPong from '../components/NexusPong';
import NexusBreakout from '../components/NexusBreakout';
import VoidVanguard from '../components/VoidVanguard';
import GameCursor from '../components/GameCursor';
import MultiplayerLobby from '../components/MultiplayerLobby';
import CyberParticles from '../components/CyberParticles';
import { useCyberSound } from '../hooks/useCyberSound';
import { useAuth } from '../hooks/useAuth';

const PlayGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const games = useStore((state) => state.games);
  const game = games.find((g) => g.id === gameId);
  const { user } = useAuth();
  const { playClick, playHover } = useCyberSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLobby, setShowLobby] = useState(true);
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
      <GameCursor />
      <CyberParticles />
      
      {/* AAA Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Space Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000000_100%)]" />
        
        {/* Animated Grid Floor */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffd505_1px,transparent_1px),linear-gradient(to_bottom,#00ffd505_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] perspective-1000 transform-gpu rotate-x-12 scale-150 opacity-50" />
        
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00ffd5]/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ff66cc]/5 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>
      
      {/* Floating HUD Header */}
      <header className="relative z-30 flex justify-between items-center px-8 py-4 mt-4 mx-4 bg-black/60 backdrop-blur-xl border border-[#00ffd5]/20 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <button 
            onClick={handleExit}
            onMouseEnter={playHover}
            className="group flex items-center gap-3 text-gray-400 hover:text-red-500 transition-all duration-300"
          >
            <div className="p-2 border border-white/10 rounded-lg group-hover:border-red-500 group-hover:bg-red-500/10 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="font-bold tracking-widest text-xs group-hover:translate-x-1 transition-transform">EJECT</span>
          </button>

          <div className="hidden md:flex items-center gap-6 text-[10px] text-[#00ffd5]/60 tracking-widest border-l border-[#00ffd5]/20 pl-6 h-8">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#00ffd5] animate-pulse" />
              <span>SYSTEMS: NOMINAL</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[#00ffd5]" />
              <span>FIREWALL: ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Center Title - Holographic Style */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center hidden sm:block pointer-events-none">
          <div className="relative">
            <h1 className="text-2xl font-orbitron font-bold text-white tracking-[0.2em] drop-shadow-[0_0_15px_rgba(0,255,213,0.5)]">
              {game.title.toUpperCase()}
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ffd5] to-transparent opacity-50" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right mr-4">
            <div className="text-xs text-white font-bold tracking-widest font-orbitron">{systemTime}</div>
            <div className="text-[9px] text-[#00ffd5]/60 tracking-wider font-mono">SECURE_CONN_ESTABLISHED</div>
          </div>
          
          <button 
            onClick={() => setShowLobby(!showLobby)}
            onMouseEnter={playHover}
            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              showLobby 
                ? 'bg-[#00ffd5]/20 border-[#00ffd5] text-[#00ffd5] shadow-[0_0_15px_rgba(0,255,213,0.2)]' 
                : 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
            }`}
          >
            <Globe size={14} />
            <span className="text-xs font-bold">LOBBY</span>
          </button>

          <button 
            onClick={toggleFullscreen}
            onMouseEnter={playHover}
            className="p-2 text-gray-400 hover:text-[#00ffd5] border border-white/10 hover:border-[#00ffd5] hover:bg-[#00ffd5]/10 rounded-lg transition-all duration-300"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-grow relative z-10 flex overflow-hidden p-4 gap-4">
        <div className="flex-1 flex items-center justify-center relative">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full max-w-[1600px] max-h-[900px] bg-black/80 border border-[#00ffd5]/30 rounded-2xl shadow-[0_0_100px_rgba(0,255,213,0.05)] backdrop-blur-sm overflow-hidden flex flex-col"
          >
            {/* Monitor Bezel Details */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#00ffd5] to-transparent opacity-50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#00ffd5] to-transparent opacity-50" />
            
            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00ffd5] rounded-tl-lg opacity-30" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00ffd5] rounded-tr-lg opacity-30" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00ffd5] rounded-bl-lg opacity-30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00ffd5] rounded-br-lg opacity-30" />

            {/* Game Viewport */}
            <div className="flex-1 relative z-10 overflow-hidden rounded-xl m-1 bg-black">
               <div className="absolute inset-0 flex items-center justify-center">
                {game.id === 'nvious-snake' && <SnakeGame />}
                {game.id === 'nvious-cyber-guess' && <GuessNumberGame />}
                {game.id === 'nvious-20-questions' && <TwentyQuestionsGame />}
                {game.id === 'nexus-pong' && <NexusPong playerName={user?.username || 'PLAYER'} />}
                {game.id === 'nexus-breakout' && <NexusBreakout />}
                {game.id === 'void-vanguard' && <VoidVanguard />}
                
                {/* Handle External/Uploaded Games */}
                {game.type === 'browser' && game.embedUrl && (
                  <iframe 
                    src={game.embedUrl} 
                    className="w-full h-full border-0"
                    title={game.title}
                    allowFullScreen
                  />
                )}
                
                {game.type === 'download' && (
                  <div className="text-center space-y-8 relative z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#00ffd5] blur-[50px] opacity-20 rounded-full" />
                      <div className="w-32 h-32 mx-auto bg-black/50 rounded-2xl flex items-center justify-center border border-[#00ffd5] shadow-[0_0_30px_rgba(0,255,213,0.2)] relative z-10">
                        <Cpu size={64} className="text-[#00ffd5] animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white font-orbitron mb-2">NEURAL LINK REQUIRED</h2>
                      <p className="text-gray-400 max-w-md mx-auto font-mono text-sm">
                        This simulation requires a direct executable interface.
                        <br/>Initialize download sequence to proceed.
                      </p>
                    </div>
                    <a 
                      href={game.downloadUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#00ffd5] text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,213,0.4)]"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <Zap size={20} className="fill-black" />
                      <span className="tracking-widest">INITIATE DOWNLOAD</span>
                    </a>
                  </div>
                )}
              </div>
              
              {/* Scanline Overlay */}
              <div className="pointer-events-none absolute inset-0 z-20 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{ backgroundSize: "100% 2px, 3px 100%" }} />
            </div>
          </motion.div>
        </div>

        {/* Floating Multiplayer Lobby Sidebar */}
        <AnimatePresence>
          {showLobby && (
            <motion.div 
              initial={{ width: 0, opacity: 0, x: 20 }}
              animate={{ width: 320, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="hidden lg:block h-full"
            >
              <div className="w-[320px] h-full bg-black/60 backdrop-blur-xl border border-[#00ffd5]/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                <MultiplayerLobby gameId={game.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Status Bar */}
      <footer className="relative z-20 py-3 px-8 bg-black/60 border-t border-[#00ffd5]/10 flex justify-between items-center text-[10px] text-[#00ffd5]/40 uppercase tracking-widest backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu size={12} />
            <span>CPU: QUANTUM-CORE [OPTIMIZED]</span>
          </div>
          <div className="w-[1px] h-3 bg-[#00ffd5]/20" />
          <div className="flex items-center gap-2">
            <Battery size={12} />
            <span>PWR: 98% [STABLE]</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>NEXUS OS v1.1.3 // ONLINE</span>
        </div>
      </footer>
    </div>
  );
};

export default PlayGame;

