import React, { useState, useEffect, useRef } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';
import { Terminal, Send, RefreshCw } from 'lucide-react';

const GuessNumberGame: React.FC = () => {
  const { playClick, playSwitch, playHover } = useCyberSound();
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('System initialized. Awaiting input...');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const num = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(num);
    setGuess('');
    setMessage('Encryption sequence active. Guess the code (1-100).');
    setAttempts(0);
    setGameOver(false);
    setHistory([]);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameOver) return;

    const numGuess = parseInt(guess);
    if (isNaN(numGuess)) {
      setMessage('Error: Invalid data type. Input numeric value.');
      playSwitch(); // Error sound equivalent
      return;
    }

    playClick();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let result = '';
    if (numGuess === targetNumber) {
      result = `ACCESS GRANTED. Code ${numGuess} verified. Attempts: ${newAttempts}`;
      setMessage('SUCCESS: System breach successful.');
      setGameOver(true);
    } else if (numGuess < targetNumber) {
      result = `Input ${numGuess}: Value too low.`;
      setMessage('Encryption stronger. Try a higher value.');
    } else {
      result = `Input ${numGuess}: Value too high.`;
      setMessage('Signal overflow. Try a lower value.');
    }

    setHistory(prev => [`> ${result}`, ...prev]);
    setGuess('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black border border-[#00ffd5]/50 rounded-lg p-6 font-mono shadow-[0_0_20px_rgba(0,255,213,0.15)]">
      <div className="flex items-center gap-2 mb-4 border-b border-[#00ffd5]/30 pb-2">
        <Terminal size={20} className="text-[#00ffd5]" />
        <h3 className="text-[#00ffd5] font-bold tracking-wider">NEXUS_GUESS.EXE</h3>
      </div>

      <div className="bg-[#0a0a0a] border border-[#00ffd5]/20 rounded p-4 h-48 overflow-y-auto mb-4 custom-scrollbar">
        {history.length === 0 && (
          <div className="text-gray-500 italic text-sm">System logs empty...</div>
        )}
        {history.map((log, index) => (
          <div key={index} className={`text-sm mb-1 ${index === 0 ? 'text-white font-bold' : 'text-gray-400'}`}>
            {log}
          </div>
        ))}
      </div>

      <div className="mb-4 text-center">
        <div className={`text-lg font-bold ${gameOver ? 'text-[#00ffd5] animate-pulse' : 'text-[#ff66cc]'}`}>
          {message}
        </div>
        <div className="text-xs text-gray-500 mt-1">ATTEMPTS: {attempts}</div>
      </div>

      {!gameOver ? (
        <form onSubmit={handleGuess} className="flex gap-2">
          <input
            ref={inputRef}
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="flex-1 bg-[#0a0a0a] border border-[#00ffd5]/30 rounded px-4 py-2 text-white focus:outline-none focus:border-[#00ffd5] transition-colors"
            placeholder="Enter code..."
            autoFocus
            onFocus={playHover}
          />
          <button
            type="submit"
            className="bg-[#00ffd5]/10 border border-[#00ffd5] text-[#00ffd5] px-4 py-2 rounded hover:bg-[#00ffd5] hover:text-black transition-all flex items-center gap-2"
            onMouseEnter={playHover}
          >
            <Send size={18} />
            EXEC
          </button>
        </form>
      ) : (
        <button
          onClick={() => { playClick(); startNewGame(); }}
          className="w-full bg-[#00ffd5] text-black font-bold py-3 rounded hover:bg-white transition-colors flex items-center justify-center gap-2"
          onMouseEnter={playHover}
        >
          <RefreshCw size={18} />
          REBOOT SYSTEM
        </button>
      )}
    </div>
  );
};

export default GuessNumberGame;
