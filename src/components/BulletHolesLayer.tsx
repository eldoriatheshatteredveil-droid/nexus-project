import React, { useState, useEffect } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';
import { useStore } from '../store';
import { ORBS } from '../data/orbs';

interface BulletHole {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

const BulletHolesLayer: React.FC = () => {
  const [bulletHoles, setBulletHoles] = useState<BulletHole[]>([]);
  const { playGunshot } = useCyberSound();
  const { selectedOrbId, lastShotTimestamp, setLastShotTimestamp, areCreaturesEnabled } = useStore();
  
  const currentOrb = ORBS.find(o => o.id === selectedOrbId) || ORBS[0];
  const cooldown = Math.max(100, 1000 - (currentOrb.stats.speed * 9));

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Don't shoot if clicking a button or interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, input, textarea, select, [role="button"]');
      
      if (isInteractive) return;
      
      // If creatures are disabled, don't shoot
      if (!areCreaturesEnabled) return;

      // Check Cooldown
      const now = Date.now();
      if (now - lastShotTimestamp < cooldown) {
        return;
      }
      setLastShotTimestamp(now);

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

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [areCreaturesEnabled, cooldown, lastShotTimestamp, playGunshot, setLastShotTimestamp]);

  return (
    <>
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
    </>
  );
};

export default BulletHolesLayer;
