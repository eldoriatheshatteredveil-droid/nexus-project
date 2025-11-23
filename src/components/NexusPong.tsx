import React, { useRef, useEffect, useState } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';
import { useStore } from '../store';
import { useMultiplayer } from '../hooks/useMultiplayer';
import { useAuth } from '../hooks/useAuth';

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
  const { user } = useAuth();
  
  // Multiplayer Hooks
  const { activeMatch, gameState: mpGameState, updateGameState } = useMultiplayer('nexus-pong');
  const isMultiplayer = !!activeMatch;
  
  // Determine Player Role
  const playerIndex = isMultiplayer && mpGameState?.players ? 
    (Object.keys(mpGameState.players)[0] === user?.id ? 0 : 1) : 0;
  const isHost = playerIndex === 0; // Host calculates physics

  // Game State
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'PLAYER' | 'AI' | null>(null);
  const { updateHighScore } = useStore();

  // Mutable game state for the loop
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

  // Sync Multiplayer State
  useEffect(() => {
    if (!isMultiplayer || !mpGameState) return;

    // Sync Opponent Paddle
    if (mpGameState.players) {
      const opponentId = Object.keys(mpGameState.players).find(id => id !== user?.id);
      if (opponentId && mpGameState.players[opponentId]) {
        const opponentY = mpGameState.players[opponentId].y;
        if (typeof opponentY === 'number') {
           // If I am P1, opponent is AI (Right) paddle. If I am P2, opponent is Player (Left) paddle.
           if (isHost) {
             gameState.current.aiY = opponentY;
           } else {
             gameState.current.playerY = opponentY;
           }
        }
      }
    }

    // Sync Ball (If not host)
    if (!isHost && mpGameState.ball) {
      gameState.current.ball = mpGameState.ball;
    }

    // Sync Score
    if (mpGameState.score) {
      setScore({ player: mpGameState.score.p1, ai: mpGameState.score.p2 });
    }

    // Start game if multiplayer match is active
    if (!isPlaying && !gameOver) {
      setIsPlaying(true);
    }

  }, [mpGameState, isMultiplayer, isHost, user, isPlaying, gameOver]);

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

    if (isMultiplayer) {
      updateGameState({
        score: { p1: 0, p2: 0 },
        ball: gameState.current.ball
      });
    }
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

  // Save score on Game Over
  useEffect(() => {
    if (gameOver) {
      updateHighScore('nexus-pong', score.player);
    }
  }, [gameOver, score.player, updateHighScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastSync = 0;

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
      ctx.fillRect(20, gameState.current.playerY, PADDLE_WIDTH, PADDLE_HEIGHT); // Player (Left)
      
      ctx.fillStyle = isMultiplayer ? '#ff66cc' : '#ff0055'; // Different color for MP opponent
      ctx.shadowColor = isMultiplayer ? '#ff66cc' : '#ff0055';
      ctx.fillRect(CANVAS_WIDTH - 30, gameState.current.aiY, PADDLE_WIDTH, PADDLE_HEIGHT); // AI/Opponent (Right)

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

      // Local Player Movement Logic
      // If Host (P1), I control Left Paddle (playerY).
      // If Guest (P2), I control Right Paddle (aiY).
      
      if (isMultiplayer) {
        if (isHost) {
          // Host controls Left Paddle
          if (state.keys.up && state.playerY > 0) state.playerY -= PADDLE_SPEED;
          if (state.keys.down && state.playerY < CANVAS_HEIGHT - PADDLE_HEIGHT) state.playerY += PADDLE_SPEED;
        } else {
          // Guest controls Right Paddle (mapped to aiY variable for rendering simplicity)
          if (state.keys.up && state.aiY > 0) state.aiY -= PADDLE_SPEED;
          if (state.keys.down && state.aiY < CANVAS_HEIGHT - PADDLE_HEIGHT) state.aiY += PADDLE_SPEED;
        }
      } else {
        // Single Player Logic
        if (state.keys.up && state.playerY > 0) state.playerY -= PADDLE_SPEED;
        if (state.keys.down && state.playerY < CANVAS_HEIGHT - PADDLE_HEIGHT) state.playerY += PADDLE_SPEED;

        // AI Logic
        const aiCenter = state.aiY + PADDLE_HEIGHT / 2;
        if (aiCenter < state.ball.y - 10) state.aiY += PADDLE_SPEED * 0.85;
        else if (aiCenter > state.ball.y + 10) state.aiY -= PADDLE_SPEED * 0.85;
        
        // Clamp AI
        if (state.aiY < 0) state.aiY = 0;
        if (state.aiY > CANVAS_HEIGHT - PADDLE_HEIGHT) state.aiY = CANVAS_HEIGHT - PADDLE_HEIGHT;
      }

      // Physics (Host Only or Single Player)
      if (!isMultiplayer || isHost) {
        // Ball Movement
        state.ball.x += state.ball.dx;
        state.ball.y += state.ball.dy;

        // Wall Collisions
        if (state.ball.y <= 0 || state.ball.y >= CANVAS_HEIGHT) {
          state.ball.dy *= -1;
          playSwitch();
        }

        // Paddle Collisions
        // Left Paddle
        if (
          state.ball.x <= 30 + PADDLE_WIDTH &&
          state.ball.x >= 20 &&
          state.ball.y >= state.playerY &&
          state.ball.y <= state.playerY + PADDLE_HEIGHT
        ) {
          state.ball.dx *= -1.1;
          state.ball.x = 30 + PADDLE_WIDTH;
          playSwitch();
        }

        // Right Paddle
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
          // Right Side Scored
          setScore(prev => {
            const newScore = { ...prev, ai: prev.ai + 1 };
            if (newScore.ai >= 5) {
              setGameOver(true);
              setWinner(isMultiplayer ? 'AI' : 'AI'); // In MP, 'AI' means P2
              setIsPlaying(false);
            }
            return newScore;
          });
          resetBall('AI');
        } else if (state.ball.x > CANVAS_WIDTH) {
          // Left Side Scored
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
      }

      // Sync to Multiplayer State (Throttled to ~30fps)
      if (isMultiplayer && Date.now() - lastSync > 33) {
        lastSync = Date.now();
        const myY = isHost ? state.playerY : state.aiY;
        
        const update: any = {
          players: {
            [user?.id || '']: { y: myY }
          }
        };

        if (isHost) {
          update.ball = state.ball;
          update.score = { p1: score.player, p2: score.ai };
        }

        updateGameState(update);
      }
    };

    const loop = () => {
      update();
      render();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, gameOver, playSwitch, isMultiplayer, isHost, user, updateGameState, score]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/50 rounded-xl border border-[#00ffd5]/30 backdrop-blur-sm">
      <div className="mb-4 flex justify-between w-full max-w-[800px] text-[#00ffd5] font-mono text-xl">
        <span className="text-[#00ffd5]">{isMultiplayer && !isHost ? 'OPPONENT' : playerName}: {score.player}</span>
        <span className={isMultiplayer ? "text-[#ff66cc]" : "text-[#ff0055]"}>
          {isMultiplayer ? (isHost ? 'OPPONENT' : playerName) : opponentName}: {score.ai}
        </span>
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
              <h2 className="text-4xl font-bold text-[#00ffd5] mb-8 tracking-widest">
                {isMultiplayer ? 'MULTIPLAYER LINK ESTABLISHED' : 'NEXUS PONG'}
              </h2>
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
