import React, { useRef, useEffect, useState } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 8;
const INITIAL_BALL_SPEED = 5;

interface NexusPongProps {
  playerName?: string;
  opponentName?: string;
}

const NexusPong: React.FC<NexusPongProps> = ({ playerName = 'PLAYER', opponentName = 'CPU' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playClick, playSwitch } = useCyberSound();
  
  // Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'PLAYER' | 'AI' | null>(null);

  // Mutable game state for the loop (to avoid closure staleness)
  const gameState = useRef({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: INITIAL_BALL_SPEED,
      dy: INITIAL_BALL_SPEED
    },
    keys: {
      up: false,
      down: false
    }
  });

  const resetGame = () => {
    gameState.current = {
      playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ball: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        dx: Math.random() > 0.5 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED,
        dy: (Math.random() * 2 - 1) * INITIAL_BALL_SPEED
      },
      keys: { up: false, down: false }
    };
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
    setWinner(null);
    setIsPlaying(true);
    playClick();
  };

  const resetBall = (winner: 'PLAYER' | 'AI') => {
    gameState.current.ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: winner === 'PLAYER' ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED,
      dy: (Math.random() * 2 - 1) * INITIAL_BALL_SPEED
    };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') gameState.current.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') gameState.current.keys.down = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') gameState.current.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') gameState.current.keys.down = false;
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

    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid Background
      ctx.strokeStyle = '#003333';
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_WIDTH; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      // Draw Center Line
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = '#00ffd5';
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Paddles
      ctx.fillStyle = '#00ffd5';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffd5';
      ctx.fillRect(20, gameState.current.playerY, PADDLE_WIDTH, PADDLE_HEIGHT); // Player
      
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.fillRect(CANVAS_WIDTH - 30, gameState.current.aiY, PADDLE_WIDTH, PADDLE_HEIGHT); // AI

      // Draw Ball
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.arc(gameState.current.ball.x, gameState.current.ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
    };

    const update = () => {
      if (!isPlaying || gameOver) return;

      const state = gameState.current;

      // Player Movement
      if (state.keys.up && state.playerY > 0) state.playerY -= PADDLE_SPEED;
      if (state.keys.down && state.playerY < CANVAS_HEIGHT - PADDLE_HEIGHT) state.playerY += PADDLE_SPEED;

      // AI Movement (Simple tracking with some delay/imperfection could be added, but let's keep it simple first)
      const aiCenter = state.aiY + PADDLE_HEIGHT / 2;
      if (aiCenter < state.ball.y - 10) state.aiY += PADDLE_SPEED * 0.85; // AI is slightly slower
      else if (aiCenter > state.ball.y + 10) state.aiY -= PADDLE_SPEED * 0.85;

      // Clamp AI position
      if (state.aiY < 0) state.aiY = 0;
      if (state.aiY > CANVAS_HEIGHT - PADDLE_HEIGHT) state.aiY = CANVAS_HEIGHT - PADDLE_HEIGHT;

      // Ball Movement
      state.ball.x += state.ball.dx;
      state.ball.y += state.ball.dy;

      // Wall Collisions (Top/Bottom)
      if (state.ball.y <= 0 || state.ball.y >= CANVAS_HEIGHT) {
        state.ball.dy *= -1;
        playSwitch(); // Sound effect on bounce
      }

      // Paddle Collisions
      // Player Paddle
      if (
        state.ball.x <= 30 + PADDLE_WIDTH &&
        state.ball.x >= 20 &&
        state.ball.y >= state.playerY &&
        state.ball.y <= state.playerY + PADDLE_HEIGHT
      ) {
        state.ball.dx *= -1.1; // Speed up slightly
        state.ball.x = 30 + PADDLE_WIDTH; // Prevent sticking
        playSwitch();
      }

      // AI Paddle
      if (
        state.ball.x >= CANVAS_WIDTH - 30 - PADDLE_WIDTH &&
        state.ball.x <= CANVAS_WIDTH - 20 &&
        state.ball.y >= state.aiY &&
        state.ball.y <= state.aiY + PADDLE_HEIGHT
      ) {
        state.ball.dx *= -1.1;
        state.ball.x = CANVAS_WIDTH - 30 - PADDLE_WIDTH;
        playSwitch();
      }

      // Scoring
      if (state.ball.x < 0) {
        // AI Scored
        setScore(prev => {
          const newScore = { ...prev, ai: prev.ai + 1 };
          if (newScore.ai >= 5) {
            setGameOver(true);
            setWinner('AI');
            setIsPlaying(false);
          }
          return newScore;
        });
        resetBall('AI');
      } else if (state.ball.x > CANVAS_WIDTH) {
        // Player Scored
        setScore(prev => {
          const newScore = { ...prev, player: prev.player + 1 };
          if (newScore.player >= 5) {
            setGameOver(true);
            setWinner('PLAYER');
            setIsPlaying(false);
          }
          return newScore;
        });
        resetBall('PLAYER');
      }
    };

    const loop = () => {
      update();
      render();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, gameOver, playSwitch]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/50 rounded-xl border border-[#00ffd5]/30 backdrop-blur-sm">
      <div className="mb-4 flex justify-between w-full max-w-[800px] text-[#00ffd5] font-mono text-xl">
        <span className="text-[#00ffd5]">{playerName}: {score.player}</span>
        <span className="text-[#ff0055]">{opponentName}: {score.ai}</span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-black border border-[#00ffd5]/50 shadow-[0_0_20px_rgba(0,255,213,0.2)] rounded-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {/* Overlay UI */}
        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg">
            {gameOver ? (
              <>
                <h2 className={`text-4xl font-bold mb-4 ${winner === 'PLAYER' ? 'text-[#00ffd5]' : 'text-[#ff0055]'}`}>
                  {winner === 'PLAYER' ? 'VICTORY' : 'DEFEAT'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {winner === 'PLAYER' ? 'System Defeated' : 'System Prevailed'}
                </p>
              </>
            ) : (
              <h2 className="text-4xl font-bold text-[#00ffd5] mb-8 tracking-widest">NEXUS PONG</h2>
            )}
            
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-[#00ffd5] text-black font-bold rounded hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,213,0.5)]"
            >
              {gameOver ? 'REMATCH' : 'INITIALIZE'}
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-500 font-mono">CONTROLS: W/S or UP/DOWN ARROWS</p>
    </div>
  );
};

export default NexusPong;
