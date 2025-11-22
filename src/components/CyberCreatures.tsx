import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bug, Bot, Skull, Ghost } from 'lucide-react';
import { useStore } from '../store';
import { useCyberSound } from '../hooks/useCyberSound';

type CreatureType = 'bug' | 'drone' | 'virus' | 'glitch' | 'rare_bug';

interface Creature {
  id: number;
  type: CreatureType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  isDead: boolean;
}

const SPAWN_RATE = 2000; // Spawn every 2 seconds
const MAX_CREATURES = 15;

const CyberCreatures: React.FC = () => {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const incrementKillCount = useStore((state) => state.incrementKillCount);
  const { playGunshot, playGlitch } = useCyberSound();
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const spawnCreature = useCallback(() => {
    setCreatures((prev) => {
      if (prev.length >= MAX_CREATURES) return prev;

      // Spawn logic: mostly bugs, sometimes rare bugs
      const rand = Math.random();
      let type: CreatureType = 'bug';
      
      if (rand < 0.15) { // 15% chance for rare bug
        type = 'rare_bug';
      }
      
      // Spawn at random edge relative to current scroll position
      let x, y;
      const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      const padding = 50;
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      switch(edge) {
        case 0: x = scrollX + Math.random() * vw; y = scrollY - padding; break;
        case 1: x = scrollX + vw + padding; y = scrollY + Math.random() * vh; break;
        case 2: x = scrollX + Math.random() * vw; y = scrollY + vh + padding; break;
        default: x = scrollX - padding; y = scrollY + Math.random() * vh; break;
      }

      // Calculate velocity towards center-ish area of the viewport
      const targetX = scrollX + Math.random() * vw;
      const targetY = scrollY + Math.random() * vh;
      const angle = Math.atan2(targetY - y, targetX - x);
      
      // Bug speed
      const speed = 2 + Math.random();

      return [...prev, {
        id: Date.now() + Math.random(),
        type,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: (angle * 180) / Math.PI + 90,
        scale: 1,
        isDead: false
      }];
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(spawnCreature, SPAWN_RATE);
    return () => clearInterval(interval);
  }, [spawnCreature]);

  const update = (time: number) => {
    if (lastTimeRef.current !== undefined) {
      setCreatures((prev) => 
        prev
          .map((c) => {
            if (c.isDead) return c;

            let newX = c.x + c.vx;
            let newY = c.y + c.vy;
            let newVx = c.vx;
            let newVy = c.vy;
            let newRotation = c.rotation;

            // Collision Avoidance with Interactive Elements & Content
            // We use elementsFromPoint to ignore the creature itself
            // Convert document coordinates to viewport coordinates for elementFromPoint
            const viewportX = newX - window.scrollX;
            const viewportY = newY - window.scrollY;
            
            const elements = document.elementsFromPoint(viewportX, viewportY);
            const hitElement = elements.find(el => !el.hasAttribute('data-creature') && !el.closest('[data-creature]'));

            if (hitElement) {
              // Define what constitutes an "obstacle"
              // We want to avoid text, buttons, cards, headers, etc.
              // But allow walking on container divs (which usually form the background)
              const isObstacle = 
                hitElement.matches?.('button, a, input, select, textarea, .game-card, .modal, h1, h2, h3, h4, h5, h6, p, span, img, li, header, footer, nav, [role="button"], [role="link"], table, tr, td, th, video, audio, canvas, code, pre, blockquote') || 
                hitElement.closest('button, a, .game-card, .modal, header, footer, nav');

              if (isObstacle) {
                // Bounce off
                newVx = -newVx;
                newVy = -newVy;
                newX = c.x + newVx * 2; // Move away immediately
                newY = c.y + newVy * 2;
                newRotation += 180;
              }
            }

            // Glitch behavior: random jumps
            if (c.type === 'glitch' && Math.random() < 0.02) {
              newX += (Math.random() - 0.5) * 100;
              newY += (Math.random() - 0.5) * 100;
            }

            // Bug behavior: jittery
            if ((c.type === 'bug' || c.type === 'rare_bug') && Math.random() < 0.1) {
              newRotation += (Math.random() - 0.5) * 45;
              const rad = ((newRotation - 90) * Math.PI) / 180;
              const speed = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
              newVx = Math.cos(rad) * speed;
              newVy = Math.sin(rad) * speed;
            }

            // Remove if far off screen (relative to current viewport)
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const buffer = 300; // Allow them to be a bit off screen

            if (
              newX < scrollX - buffer || 
              newX > scrollX + vw + buffer || 
              newY < scrollY - buffer || 
              newY > scrollY + vh + buffer
            ) {
              return null;
            }

            return { ...c, x: newX, y: newY, vx: newVx, vy: newVy, rotation: newRotation };
          })
          .filter((c): c is Creature => c !== null)
      );
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleKill = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent triggering global click handlers (like the bullet hole on the background if possible, though layout captures it)
    
    const creature = creatures.find(c => c.id === id);
    if (!creature || creature.isDead) return;

    playGunshot();
    if (creature.type === 'glitch') playGlitch();

    const killValue = creature.type === 'rare_bug' ? 5 : 1;
    incrementKillCount(killValue);

    setCreatures(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, isDead: true };
      }
      return c;
    }));

    // Remove after animation
    setTimeout(() => {
      setCreatures(prev => prev.filter(c => c.id !== id));
    }, 500);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[50] overflow-hidden">
      {creatures.map((c) => (
        <div
          key={c.id}
          data-creature="true"
          className={`absolute transition-transform duration-100 pointer-events-auto cursor-crosshair
            ${c.isDead ? 'animate-ping opacity-0' : ''}
          `}
          style={{
            left: c.x,
            top: c.y,
            transform: `translate(-50%, -50%) rotate(${c.rotation}deg) scale(${c.isDead ? 2 : 1})`,
            transition: c.isDead ? 'all 0.2s ease-out' : 'none'
          }}
          onClick={(e) => handleKill(e, c.id)}
        >
          {c.type === 'bug' && (
            <div className="text-[#00ff00] drop-shadow-[0_0_5px_#00ff00]">
              <Bug size={24} />
            </div>
          )}
          {c.type === 'rare_bug' && (
            <div className="text-[#ffd700] drop-shadow-[0_0_8px_#ffd700] animate-pulse">
              <Bug size={32} />
            </div>
          )}
          {c.type === 'drone' && (
            <div className="text-[#00ffff] drop-shadow-[0_0_5px_#00ffff]">
              <Bot size={32} />
            </div>
          )}
          {c.type === 'virus' && (
            <div className="text-[#ff0000] drop-shadow-[0_0_8px_#ff0000] animate-pulse">
              <Skull size={28} />
            </div>
          )}
          {c.type === 'glitch' && (
            <div className="text-[#ff00ff] drop-shadow-[0_0_5px_#ff00ff] opacity-80">
              <Ghost size={24} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CyberCreatures;
