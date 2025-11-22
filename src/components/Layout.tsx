import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import Header from './Header';
import Footer from './Footer';
import HeroWebGLBackground from './HeroWebGLBackground';
import CyberDecorations from './CyberDecorations';
import CyberParticles from './CyberParticles';
import CyberCreatures from './CyberCreatures';
import CyberHUD from './CyberHUD';
import CyberCursor from './CyberCursor';
import OrbMenu from './OrbMenu';
import MusicPlayer from './MusicPlayer';
import Terminal from './Terminal';
import BlackMarket from './BlackMarket';
import FactionSelector from './FactionSelector';
import { useCyberSound } from '../hooks/useCyberSound';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import '../index.css';

interface BulletHole {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const { playGunshot, playSwitch } = useCyberSound();
  const [bulletHoles, setBulletHoles] = useState<BulletHole[]>([]);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isBlackMarketOpen, setIsBlackMarketOpen] = useState(false);
  const [isFactionSelectorOpen, setIsFactionSelectorOpen] = useState(false);
  
  const incrementPlayTime = useStore((state) => state.incrementPlayTime);
  const faction = useStore((state) => state.faction);
  const { user } = useAuth();

  // Check for faction selection
  useEffect(() => {
    if (!faction) {
      const timer = setTimeout(() => setIsFactionSelectorOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [faction]);

  // Terminal Toggle Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
        playSwitch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playSwitch]);

  // Track playtime for XP (only for non-devs)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!user?.is_dev) {
        incrementPlayTime(1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [incrementPlayTime, user?.is_dev]);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => t,
    });

    let running = true;
    const raf = (time: number) => {
      if (!running) return;
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      running = false;
      lenisRef.current?.destroy();
    };
  }, []);

  const handleGlobalClick = (e: React.MouseEvent) => {
    // Don't shoot if clicking a button or interactive element
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
    
    if (isInteractive) return;
    
    playGunshot();

    const newHole: BulletHole = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      rotation: Math.random() * 360
    };

    setBulletHoles(prev => [...prev, newHole]);

    // Remove after 2 seconds
    setTimeout(() => {
      setBulletHoles(prev => prev.filter(h => h.id !== newHole.id));
    }, 2000);
  };

  return (
    <div 
      className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] relative overflow-hidden flex flex-col cursor-none transition-colors duration-500"
      onClick={handleGlobalClick}
    >
      <HeroWebGLBackground />
      <CyberParticles />
      <CyberDecorations />
      <CyberHUD />
      <CyberCreatures />
      <Header 
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenBlackMarket={() => setIsBlackMarketOpen(true)}
      />

      <main className="relative z-20 flex-grow pt-28">{children}</main>

      <Footer />

      {/* Bullet Holes Layer */}
      {bulletHoles.map(hole => (
        <div
          key={hole.id}
          className="pointer-events-none fixed z-[9998] w-12 h-12"
          style={{ 
            left: hole.x, 
            top: hole.y, 
            transform: `translate(-50%, -50%) rotate(${hole.rotation}deg)` 
          }}
        >
          {/* Impact Center */}
          <div className="absolute inset-0 m-auto w-3 h-3 bg-black rounded-full border border-[#00ffd5] shadow-[0_0_15px_#00ffd5] animate-ping" />
          <div className="absolute inset-0 m-auto w-2 h-2 bg-white rounded-full opacity-80" />
          
          {/* Cracks (SVG) */}
          <svg className="absolute inset-0 w-full h-full overflow-visible opacity-80">
            <path d="M24 24 L10 10" stroke="#00ffd5" strokeWidth="1" />
            <path d="M24 24 L38 12" stroke="#00ffd5" strokeWidth="1" />
            <path d="M24 24 L30 40" stroke="#ff66cc" strokeWidth="1" />
            <path d="M24 24 L12 36" stroke="#ff66cc" strokeWidth="1" />
            <circle cx="24" cy="24" r="8" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
        </div>
      ))}

      {/* Custom cursor: Tech Reticle */}
      <CyberCursor />
      <OrbMenu />
      <MusicPlayer />
      
      {/* Overlays */}
      <Terminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <BlackMarket isOpen={isBlackMarketOpen} onClose={() => setIsBlackMarketOpen(false)} />
      <FactionSelector isOpen={isFactionSelectorOpen} onClose={() => setIsFactionSelectorOpen(false)} />
    </div>
  );
};

export default Layout;
