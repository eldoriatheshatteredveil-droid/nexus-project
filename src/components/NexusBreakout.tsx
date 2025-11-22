import React, { useRef, useEffect, useState } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 6;
const BRICK_ROW_COUNT = 6;
const BRICK_COLUMN_COUNT = 9; // Adjusted for fit
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = 35;
const BRICK_WIDTH = (CANVAS_WIDTH - (BRICK_OFFSET_LEFT * 2) - (BRICK_PADDING * (BRICK_COLUMN_COUNT - 1))) / BRICK_COLUMN_COUNT;
const BRICK_HEIGHT = 25;
const INITIAL_LIVES = 3;

const COLORS = ['#ff0055', '#ff66cc', '#bd00ff', '#00ffd5', '#00ff99', '#ffff00'];

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  color: string;
  size: number;
}

interface Brick {
  x: number;
  y: number;
  status: number; // 1 = active, 0 = broken
  color: string;
}

const NexusBreakout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playClick, playSwitch, playGunshot } = useCyberSound();

  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'GAMEOVER' | 'VICTORY'>('MENU');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);

  // Mutable game state
  const state = useRef({
    paddleX: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    ball: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 30, dx: 4, dy: -4 },
    bricks: [] as Brick[],
    particles: [] as Particle[],
    keys: { left: false, right: false }
  });

  // Initialize Bricks
  const initBricks = () => {
    const newBricks: Brick[] = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
        const brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
        newBricks.push({ 
          x: brickX, 
          y: brickY, 
          status: 1, 
          color: COLORS[r % COLORS.length] 
        });
      }
    }
    state.current.bricks = newBricks;
  };

  const resetBall = () => {
    state.current.ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 40,
      dx: 4 * (Math.random() > 0.5 ? 1 : -1),
      dy: -4
    };
    state.current.paddleX = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
  };

  const startGame = () => {
    initBricks();
    resetBall();
    setScore(0);
    setLives(INITIAL_LIVES);
    setGameState('PLAYING');
    playClick();
  };

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 10; i++) {
      state.current.particles.push({
        x,
        y,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        life: 1.0,
        color,
        size: Math.random() * 3 + 1
      });
    }
  };

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') state.current.keys.right = true;
      if (e.key === 'ArrowLeft' || e.key === 'a') state.current.keys.left = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd') state.current.keys.right = false;
      if (e.key === 'ArrowLeft' || e.key === 'a') state.current.keys.left = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      // Scale mouse position to canvas coordinates
      const scaleX = CANVAS_WIDTH / rect.width;
      const canvasX = relativeX * scaleX;
      
      if (canvasX > 0 && canvasX < CANVAS_WIDTH) {
        state.current.paddleX = canvasX - PADDLE_WIDTH / 2;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    // Attach mouse move to window to catch movements outside canvas if dragging (though we don't drag here)
    // Better to attach to canvas for relative, but window is safer for fast movements
    // We'll attach to canvas in the render loop via ref if needed, but event listener is fine.
    // Actually, let's attach to the canvas element specifically in the JSX for mouse move
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const update = () => {
      if (gameState !== 'PLAYING') return;

      const s = state.current;

      // Paddle Movement (Keyboard)
      if (s.keys.right && s.paddleX < CANVAS_WIDTH - PADDLE_WIDTH) {
        s.paddleX += 7;
      }
      else if (s.keys.left && s.paddleX > 0) {
        s.paddleX -= 7;
      }

      // Clamp Paddle
      if (s.paddleX < 0) s.paddleX = 0;
      if (s.paddleX + PADDLE_WIDTH > CANVAS_WIDTH) s.paddleX = CANVAS_WIDTH - PADDLE_WIDTH;

      // Ball Movement
      s.ball.x += s.ball.dx;
      s.ball.y += s.ball.dy;

      // Wall Collisions
      if (s.ball.x + s.ball.dx > CANVAS_WIDTH - BALL_RADIUS || s.ball.x + s.ball.dx < BALL_RADIUS) {
        s.ball.dx = -s.ball.dx;
        playSwitch();
      }
      if (s.ball.y + s.ball.dy < BALL_RADIUS) {
        s.ball.dy = -s.ball.dy;
        playSwitch();
      }
      else if (s.ball.y + s.ball.dy > CANVAS_HEIGHT - BALL_RADIUS) {
        // Ball lost
        if (lives > 1) {
          setLives(prev => prev - 1);
          resetBall();
          playGunshot(); // Negative sound
        } else {
          setLives(0);
          setGameState('GAMEOVER');
          playGunshot();
        }
      }

      // Paddle Collision
      if (
        s.ball.y + BALL_RADIUS >= CANVAS_HEIGHT - PADDLE_HEIGHT - 10 && // Near bottom
        s.ball.y - BALL_RADIUS <= CANVAS_HEIGHT - 10 &&
        s.ball.x >= s.paddleX &&
        s.ball.x <= s.paddleX + PADDLE_WIDTH
      ) {
        // Hit paddle
        s.ball.dy = -Math.abs(s.ball.dy); // Ensure it goes up
        
        // Add "english" (spin/angle) based on where it hit the paddle
        const hitPoint = s.ball.x - (s.paddleX + PADDLE_WIDTH / 2);
        s.ball.dx = hitPoint * 0.15; 
        
        // Speed up slightly
        const speed = Math.sqrt(s.ball.dx*s.ball.dx + s.ball.dy*s.ball.dy);
        if (speed < 12) { // Max speed cap
            s.ball.dx *= 1.05;
            s.ball.dy *= 1.05;
        }

        playSwitch();
      }

      // Brick Collision
      let activeBricksCount = 0;
      for (let i = 0; i < s.bricks.length; i++) {
        const b = s.bricks[i];
        if (b.status === 1) {
          activeBricksCount++;
          if (
            s.ball.x > b.x &&
            s.ball.x < b.x + BRICK_WIDTH &&
            s.ball.y > b.y &&
            s.ball.y < b.y + BRICK_HEIGHT
          ) {
            s.ball.dy = -s.ball.dy;
            b.status = 0;
            setScore(prev => prev + 10);
            createExplosion(b.x + BRICK_WIDTH / 2, b.y + BRICK_HEIGHT / 2, b.color);
            playSwitch(); // Or a different break sound
          }
        }
      }

      if (activeBricksCount === 0) {
        setGameState('VICTORY');
      }

      // Update Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.life -= 0.02;
        if (p.life <= 0) {
          s.particles.splice(i, 1);
        }
      }
    };

    const draw = () => {
      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Bricks
      state.current.bricks.forEach(b => {
        if (b.status === 1) {
          ctx.beginPath();
          ctx.rect(b.x, b.y, BRICK_WIDTH, BRICK_HEIGHT);
          ctx.fillStyle = b.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = b.color;
          ctx.fill();
          ctx.closePath();
          ctx.shadowBlur = 0;
        }
      });

      // Draw Paddle
      ctx.beginPath();
      ctx.rect(state.current.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillStyle = '#00ffd5';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00ffd5';
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;

      // Draw Ball
      ctx.beginPath();
      ctx.arc(state.current.ball.x, state.current.ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;

      // Draw Particles
      state.current.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.closePath();
      });
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, lives, playSwitch, playGunshot]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'PLAYING') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const scaleX = CANVAS_WIDTH / rect.width;
    const canvasX = relativeX * scaleX;
    
    if (canvasX > 0 && canvasX < CANVAS_WIDTH) {
      state.current.paddleX = canvasX - PADDLE_WIDTH / 2;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Game Stats Bar */}
      <div className="flex justify-between w-full max-w-[800px] mb-4 px-4 py-2 bg-black/40 border border-[#00ffd5]/20 rounded text-[#00ffd5] font-mono">
        <div className="flex gap-4">
          <span>SCORE: {score}</span>
          <span>LIVES: {'♥'.repeat(lives)}</span>
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
          onMouseMove={handleCanvasMouseMove}
          className={`
            bg-black border border-[#00ffd5]/30 rounded-lg shadow-[0_0_30px_rgba(0,255,213,0.1)]
            max-w-full h-auto cursor-none
            ${gameState === 'PLAYING' ? 'cursor-none' : 'cursor-default'}
          `}
        />

        {/* Overlay UI */}
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg z-10">
            {gameState === 'MENU' && (
              <>
                <h2 className="text-5xl font-bold text-[#00ffd5] mb-2 font-orbitron tracking-widest">BREAKOUT</h2>
                <p className="text-gray-400 mb-8 tracking-wider">SYSTEM DEFENSE BREAKER</p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-[#00ffd5] text-black font-bold rounded hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,213,0.4)]"
                >
                  INITIALIZE
                </button>
              </>
            )}

            {gameState === 'GAMEOVER' && (
              <>
                <h2 className="text-5xl font-bold text-[#ff0055] mb-4 font-orbitron">SYSTEM FAILURE</h2>
                <p className="text-xl text-white mb-8">FINAL SCORE: {score}</p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-[#00ffd5] text-black font-bold rounded hover:bg-white hover:scale-105 transition-all"
                >
                  RETRY
                </button>
              </>
            )}

            {gameState === 'VICTORY' && (
              <>
                <h2 className="text-5xl font-bold text-[#00ff00] mb-4 font-orbitron">SYSTEM BREACHED</h2>
                <p className="text-xl text-white mb-8">ALL FIREWALLS DESTROYED</p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-[#00ffd5] text-black font-bold rounded hover:bg-white hover:scale-105 transition-all"
                >
                  PLAY AGAIN
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 font-mono flex gap-8">
        <span>CONTROLS: MOUSE or ARROW KEYS</span>
        <span>OBJECTIVE: DESTROY ALL BLOCKS</span>
      </div>
    </div>
  );
};

export default NexusBreakout;
