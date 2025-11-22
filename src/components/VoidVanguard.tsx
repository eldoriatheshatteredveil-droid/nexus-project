import React, { useRef, useEffect, useState } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 20;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const BARRIER_COUNT = 4;
const BARRIER_WIDTH = 80;
const BARRIER_HEIGHT = 40;
const ALIEN_ROWS = 5;
const ALIEN_COLS = 10;

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  hp?: number;
}

interface Bullet extends GameObject {
  dy: number;
  owner: 'PLAYER' | 'ALIEN';
}

const VoidVanguard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playClick, playSwitch, playGunshot } = useCyberSound();

  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('MENU');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [wave, setWave] = useState(1);

  // Mutable game state
  const state = useRef({
    player: { x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 40, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, color: '#00ffd5' },
    aliens: [] as GameObject[],
    bullets: [] as Bullet[],
    barriers: [] as GameObject[],
    alienDirection: 1, // 1 = right, -1 = left
    alienSpeed: 1,
    alienDropDistance: 20,
    lastAlienShot: 0,
    keys: { left: false, right: false, shoot: false },
    lastShotTime: 0
  });

  const initGame = (resetLives = true) => {
    if (resetLives) {
      setLives(5);
      setScore(0);
      setWave(1);
      state.current.alienSpeed = 1;
    }

    // Init Aliens
    const newAliens: GameObject[] = [];
    for (let r = 0; r < ALIEN_ROWS; r++) {
      for (let c = 0; c < ALIEN_COLS; c++) {
        newAliens.push({
          x: 100 + c * (ALIEN_WIDTH + 20),
          y: 50 + r * (ALIEN_HEIGHT + 20),
          width: ALIEN_WIDTH,
          height: ALIEN_HEIGHT,
          color: r === 0 ? '#ff0055' : r < 3 ? '#ff66cc' : '#bd00ff'
        });
      }
    }
    state.current.aliens = newAliens;

    // Init Barriers
    const newBarriers: GameObject[] = [];
    const spacing = CANVAS_WIDTH / (BARRIER_COUNT + 1);
    for (let i = 1; i <= BARRIER_COUNT; i++) {
      newBarriers.push({
        x: spacing * i - BARRIER_WIDTH / 2,
        y: CANVAS_HEIGHT - 120,
        width: BARRIER_WIDTH,
        height: BARRIER_HEIGHT,
        color: '#00ff99',
        hp: 10
      });
    }
    state.current.barriers = newBarriers;

    state.current.bullets = [];
    state.current.player.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    state.current.alienDirection = 1;
    
    setGameState('PLAYING');
    playClick();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') state.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') state.current.keys.right = true;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') state.current.keys.shoot = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') state.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') state.current.keys.right = false;
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') state.current.keys.shoot = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const checkCollision = (rect1: GameObject, rect2: GameObject) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    };

    const update = () => {
      if (gameState !== 'PLAYING') return;

      const s = state.current;
      const now = Date.now();

      // Player Movement
      if (s.keys.left && s.player.x > 0) s.player.x -= 5;
      if (s.keys.right && s.player.x < CANVAS_WIDTH - PLAYER_WIDTH) s.player.x += 5;

      // Player Shooting
      if (s.keys.shoot && now - s.lastShotTime > 250) {
        s.bullets.push({
          x: s.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
          y: s.player.y,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          dy: -7,
          color: '#00ffd5',
          owner: 'PLAYER'
        });
        s.lastShotTime = now;
        playSwitch();
      }

      // Alien Movement
      let hitEdge = false;
      s.aliens.forEach(alien => {
        alien.x += s.alienSpeed * s.alienDirection;
        if (alien.x <= 0 || alien.x + ALIEN_WIDTH >= CANVAS_WIDTH) {
          hitEdge = true;
        }
      });

      if (hitEdge) {
        s.alienDirection *= -1;
        s.aliens.forEach(alien => {
          alien.y += s.alienDropDistance;
          // Check if aliens reached player level
          if (alien.y + ALIEN_HEIGHT >= s.player.y) {
            setLives(0);
            setGameState('GAMEOVER');
          }
        });
      }

      // Alien Shooting
      if (now - s.lastAlienShot > 2000 && s.aliens.length > 0) {
        // Random alien shoots
        const shooter = s.aliens[Math.floor(Math.random() * s.aliens.length)];
        s.bullets.push({
          x: shooter.x + ALIEN_WIDTH / 2,
          y: shooter.y + ALIEN_HEIGHT,
          width: BULLET_WIDTH,
          height: BULLET_HEIGHT,
          dy: 4,
          color: '#ff0055',
          owner: 'ALIEN'
        });
        s.lastAlienShot = now;
      }

      // Bullets Update & Collision
      for (let i = s.bullets.length - 1; i >= 0; i--) {
        const b = s.bullets[i];
        b.y += b.dy;

        // Remove off-screen bullets
        if (b.y < 0 || b.y > CANVAS_HEIGHT) {
          s.bullets.splice(i, 1);
          continue;
        }

        let bulletHit = false;

        // Barrier Collision
        for (let j = 0; j < s.barriers.length; j++) {
          const barrier = s.barriers[j];
          if (checkCollision(b, barrier)) {
            bulletHit = true;
            barrier.hp = (barrier.hp || 0) - 1;
            // Visual damage
            barrier.color = `rgba(0, 255, 153, ${(barrier.hp || 0) / 10})`;
            if ((barrier.hp || 0) <= 0) {
              s.barriers.splice(j, 1);
              playGunshot();
            }
            break;
          }
        }

        if (bulletHit) {
          s.bullets.splice(i, 1);
          continue;
        }

        // Player Bullet vs Aliens
        if (b.owner === 'PLAYER') {
          for (let j = 0; j < s.aliens.length; j++) {
            if (checkCollision(b, s.aliens[j])) {
              s.aliens.splice(j, 1);
              s.bullets.splice(i, 1);
              setScore(prev => prev + 100);
              playSwitch(); // Hit sound
              bulletHit = true;
              
              // Increase speed slightly as aliens die
              s.alienSpeed += 0.02;
              
              break;
            }
          }
        }
        // Alien Bullet vs Player
        else if (b.owner === 'ALIEN') {
          if (checkCollision(b, s.player)) {
            s.bullets.splice(i, 1);
            bulletHit = true;
            playGunshot(); // Hit sound
            if (lives > 1) {
              setLives(prev => prev - 1);
              // Clear bullets to give breathing room
              s.bullets = [];
            } else {
              setLives(0);
              setGameState('GAMEOVER');
            }
          }
        }

        if (bulletHit) continue;
      }

      // Win Condition
      if (s.aliens.length === 0) {
        setGameState('VICTORY');
      }
    };

    const draw = () => {
      const s = state.current;
      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Player
      ctx.fillStyle = s.player.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = s.player.color;
      ctx.fillRect(s.player.x, s.player.y, s.player.width, s.player.height);
      // Turret
      ctx.fillRect(s.player.x + s.player.width/2 - 2, s.player.y - 5, 4, 5);
      ctx.shadowBlur = 0;

      // Draw Aliens
      s.aliens.forEach(alien => {
        ctx.fillStyle = alien.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = alien.color;
        // Simple Alien Shape (Invader-ish)
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(alien.x + 5, alien.y + 5, 5, 5);
        ctx.fillRect(alien.x + alien.width - 10, alien.y + 5, 5, 5);
        ctx.shadowBlur = 0;
      });

      // Draw Barriers
      s.barriers.forEach(barrier => {
        ctx.fillStyle = barrier.color;
        ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
      });

      // Draw Bullets
      s.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.shadowBlur = 5;
        ctx.shadowColor = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
      });
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, lives, playSwitch, playGunshot]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Game Stats Bar */}
      <div className="flex justify-between w-full max-w-[800px] mb-4 px-4 py-2 bg-black/40 border border-[#00ffd5]/20 rounded text-[#00ffd5] font-mono">
        <div className="flex gap-4">
          <span>SCORE: {score}</span>
          <span>LIVES: {'♥'.repeat(lives)}</span>
          <span>WAVE: {wave}</span>
        </div>
        <div>
          STATUS: {gameState}
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={`
            bg-black border border-[#00ffd5]/30 rounded-lg shadow-[0_0_30px_rgba(0,255,213,0.1)]
            max-w-full h-auto
          `}
        />

        {/* Overlay UI */}
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg z-10">
            {gameState === 'MENU' && (
              <>
                <h2 className="text-5xl font-bold text-[#00ffd5] mb-2 font-orbitron tracking-widest">NEXUS INVADERS</h2>
                <p className="text-gray-400 mb-8 tracking-wider">DEFEND THE NEXUS</p>
                <button
                  onClick={() => initGame(true)}
                  className="px-8 py-3 bg-[#00ffd5] text-black font-bold rounded hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,213,0.4)]"
                >
                  ENGAGE
                </button>
              </>
            )}

            {gameState === 'GAMEOVER' && (
              <>
                <h2 className="text-5xl font-bold text-[#ff0055] mb-4 font-orbitron">BREACH DETECTED</h2>
                <p className="text-xl text-white mb-8">FINAL SCORE: {score}</p>
                <button
                  onClick={() => initGame(true)}
                  className="px-8 py-3 bg-[#00ffd5] text-black font-bold rounded hover:bg-white hover:scale-105 transition-all"
                >
                  REBOOT SYSTEM
                </button>
              </>
            )}

            {gameState === 'VICTORY' && (
              <>
                <h2 className="text-5xl font-bold text-[#00ff00] mb-4 font-orbitron">SECTOR CLEARED</h2>
                <p className="text-xl text-white mb-8">WAVE {wave} COMPLETE</p>
                <button
                  onClick={() => {
                    setWave(w => w + 1);
                    state.current.alienSpeed += 0.5; // Increase difficulty
                    initGame(false); // Don't reset lives/score
                  }}
                  className="px-8 py-3 bg-[#00ffd5] text-black font-bold rounded hover:bg-white hover:scale-105 transition-all"
                >
                  NEXT WAVE
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 font-mono flex gap-8">
        <span>MOVE: ARROW KEYS / A,D</span>
        <span>FIRE: SPACEBAR / W / UP</span>
      </div>
    </div>
  );
};

export default VoidVanguard;
