"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Game } from '../data/games';
import { useCyberSound } from '../hooks/useCyberSound';

interface Props {
  game: Game;
  onClick?: () => void;
}

/**
 * GameCardHolographic
 * - Glassmorphic card with tilt, parallax, and micro-interactions
 */
const GameCardHolographic: React.FC<Props> = ({ game, onClick }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { playHover, playClick } = useCyberSound();

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * 10;
    const ry = (x - 0.5) * -10;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    el.style.boxShadow = `0 15px 30px rgba(0,0,0,0.5), 0 0 20px rgb(var(--color-primary) / 0.2), 0 0 40px rgb(var(--color-primary) / 0.1)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
  };

  const handleClick = () => {
    playClick();
    if (onClick) onClick();
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={playHover}
      onClick={handleClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="game-card glassmorphic overflow-hidden relative w-full max-w-[380px] group cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,51,153,0.01))',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px) saturate(140%)',
      }}
    >
      <div className="relative w-full h-[220px] overflow-hidden">
        <img 
          src={game.cover} 
          alt={game.title} 
          className="w-full h-full object-cover rounded-md transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1" 
        />

        {/* Glitch overlay on hover */}
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
        
        {/* cover distortion / parallax overlay (mocked) */}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ background: 'linear-gradient(120deg, rgb(var(--color-primary) / 0.06), rgb(var(--color-secondary) / 0.04))' }} />
      
        {/* Game Mode Badge */}
        {game.mode && (
          <div className="absolute top-3 right-3 z-20">
            <span className={`
              text-[10px] font-bold px-2 py-1 rounded-sm border backdrop-blur-md uppercase tracking-wider shadow-lg
              ${game.mode === 'multiplayer' 
                ? 'bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-100 shadow-[0_0_15px_rgba(217,70,239,0.2)]' 
                : 'bg-cyan-500/20 border-cyan-400/50 text-cyan-100 shadow-[0_0_15px_rgba(34,211,238,0.2)]'}
            `}>
              {game.mode === 'multiplayer' ? 'Multiplayer' : 'Single Player'}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 relative">
        <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary group-hover:text-glow transition-all duration-300">{game.title}</h3>
        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{game.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Tags removed as per request */}
          </div>
          
          <button className="text-xs uppercase tracking-widest text-primary hover:text-white transition-colors">
            View Details &rarr;
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default GameCardHolographic;
