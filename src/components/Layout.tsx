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
import Terminal from './Terminal';
import BlackMarket from './BlackMarket';
import FactionSelector from './FactionSelector';
import { useCyberSound } from '../hooks/useCyberSound';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import '../index.css';

import { ORBS } from '../data/orbs';

import BulletHolesLayer from './BulletHolesLayer';
import PresenceManager from './PresenceManager';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const { playSwitch } = useCyberSound();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isBlackMarketOpen, setIsBlackMarketOpen] = useState(false);
  const [isFactionSelectorOpen, setIsFactionSelectorOpen] = useState(false);
  
  const incrementPlayTime = useStore((state) => state.incrementPlayTime);
  const faction = useStore((state) => state.faction);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const { user } = useAuth();
  const { areCreaturesEnabled } = useStore();

  // Check for faction selection - Only for authenticated users who haven't chosen yet
  useEffect(() => {
    if (isAuthenticated && !faction) {
      const timer = setTimeout(() => setIsFactionSelectorOpen(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsFactionSelectorOpen(false);
    }
  }, [faction, isAuthenticated]);

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

  return (
    <div 
      className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text))] relative overflow-hidden flex flex-col cursor-none transition-colors duration-500"
    >
      <PresenceManager />
      <HeroWebGLBackground />
      <CyberParticles />
      <CyberDecorations />
      <CyberHUD />
      <CyberCreatures />
      <BulletHolesLayer />
      <Header 
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenBlackMarket={() => setIsBlackMarketOpen(true)}
      />

      <main className="relative z-20 flex-grow pt-28">{children}</main>

      <Footer />

      {/* Custom cursor: Tech Reticle */}
      <CyberCursor />
      <OrbMenu />
      
      {/* Overlays */}
      <Terminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <BlackMarket isOpen={isBlackMarketOpen} onClose={() => setIsBlackMarketOpen(false)} />
      <FactionSelector isOpen={isFactionSelectorOpen} onClose={() => setIsFactionSelectorOpen(false)} />
    </div>
  );
};

export default Layout;
