import React, { useState, useEffect, useRef } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame: React.FC = () => {
  const { playClick, playSwitch } = useCyberSound();
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    playClick();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPlaying]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check collision with food
        if (head.x === food.x && head.y === food.y) {
          setScore((prev) => prev + 10);
          setFood(generateFood());
          playSwitch();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [direction, isPlaying, gameOver, food, playSwitch]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/50 rounded-xl border border-[#00ffd5]/30 backdrop-blur-sm">
      <div className="mb-4 flex justify-between w-full max-w-[400px] text-[#00ffd5] font-mono">
        <span>SCORE: {score}</span>
        <span>STATUS: {gameOver ? 'TERMINATED' : isPlaying ? 'ACTIVE' : 'READY'}</span>
      </div>

      <div 
        className="relative bg-black/80 border border-[#00ffd5]/50 shadow-[0_0_20px_rgba(0,255,213,0.2)]"
        style={{ 
          width: GRID_SIZE * CELL_SIZE, 
          height: GRID_SIZE * CELL_SIZE,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Render Grid Cells */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          const isHead = snake[0].x === x && snake[0].y === y;

          return (
            <div 
              key={i} 
              className={`
                w-full h-full border-[0.5px] border-white/5
                ${isHead ? 'bg-[#ffffff] shadow-[0_0_10px_#ffffff]' : ''}
                ${isSnake && !isHead ? 'bg-[#00ffd5] shadow-[0_0_5px_#00ffd5]' : ''}
                ${isFood ? 'bg-[#ff66cc] animate-pulse shadow-[0_0_10px_#ff66cc]' : ''}
              `}
            />
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
            <h3 className="text-2xl text-red-500 font-bold mb-4">GAME OVER</h3>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-[#00ffd5] text-black font-bold rounded hover:bg-white transition-colors"
            >
              RETRY
            </button>
          </div>
        )}

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-[#00ffd5] text-black font-bold rounded hover:bg-white transition-colors"
            >
              START GAME
            </button>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-xs text-gray-500">Use WASD or Arrow Keys to Navigate</p>
    </div>
  );
};

export default SnakeGame;
