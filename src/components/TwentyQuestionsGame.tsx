import React, { useState, useEffect, useRef } from 'react';
import { useCyberSound } from '../hooks/useCyberSound';
import { Brain, Send, HelpCircle, AlertTriangle, RefreshCw } from 'lucide-react';

type Secret = {
  name: string;
  keywords: string[];
  hint: string;
};

const SECRETS: Secret[] = [
  {
    name: "Dog",
    keywords: ["animal", "living", "alive", "pet", "fur", "bark", "tail", "legs", "mammal", "walk", "run", "friend", "canine"],
    hint: "It is a common household pet."
  },
  {
    name: "Airplane",
    keywords: ["vehicle", "fly", "wings", "sky", "metal", "machine", "travel", "fast", "pilot", "engine", "air", "transport"],
    hint: "It travels through the sky."
  },
  {
    name: "Pizza",
    keywords: ["food", "eat", "cheese", "italian", "round", "slice", "tasty", "hot", "cook", "meal", "dinner", "lunch", "pepperoni"],
    hint: "A popular Italian dish."
  },
  {
    name: "Smartphone",
    keywords: ["electronic", "tech", "technology", "screen", "call", "internet", "battery", "small", "pocket", "camera", "app", "phone", "mobile"],
    hint: "You probably have one in your pocket."
  },
  {
    name: "Sun",
    keywords: ["star", "hot", "sky", "space", "light", "big", "yellow", "fire", "day", "bright", "solar", "heat"],
    hint: "It provides light to the Earth."
  },
  {
    name: "Tree",
    keywords: ["plant", "living", "alive", "green", "wood", "leaves", "leaf", "grow", "nature", "forest", "tall", "roots"],
    hint: "It grows in the ground and has leaves."
  },
  {
    name: "Guitar",
    keywords: ["music", "instrument", "strings", "play", "song", "sound", "band", "wood", "electric", "acoustic"],
    hint: "A musical instrument with strings."
  }
];

const TwentyQuestionsGame: React.FC = () => {
  const { playClick, playSwitch, playHover } = useCyberSound();
  const [secret, setSecret] = useState<Secret | null>(null);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'user' | 'ai', text: string }[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const startNewGame = () => {
    const randomSecret = SECRETS[Math.floor(Math.random() * SECRETS.length)];
    setSecret(randomSecret);
    setHistory([{ type: 'ai', text: "I am thinking of an object. You have 20 questions. Ask me anything (Yes/No questions work best)." }]);
    setQuestionCount(0);
    setGameState('playing');
    setInput('');
  };

  const analyzeQuestion = (question: string, secret: Secret): string => {
    const lowerQ = question.toLowerCase();
    
    // Check for direct guess
    if (lowerQ.includes(secret.name.toLowerCase())) {
      return "CORRECT";
    }

    // Check for keywords
    const hasKeyword = secret.keywords.some(keyword => lowerQ.includes(keyword));
    
    if (hasKeyword) {
      return "Yes.";
    }
    
    // Simple heuristics for common non-keyword questions
    if (lowerQ.includes("object") || lowerQ.includes("thing")) return "Yes, it is a thing.";
    if (lowerQ.includes("person") || lowerQ.includes("human")) return "No, it is not a specific person.";
    
    return "No.";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || gameState !== 'playing' || !secret) return;

    playClick();
    const currentInput = input;
    setInput('');
    
    // Add user question
    setHistory(prev => [...prev, { type: 'user', text: currentInput }]);
    
    // Process answer
    setTimeout(() => {
      const answer = analyzeQuestion(currentInput, secret);
      
      if (answer === "CORRECT") {
        setHistory(prev => [...prev, { type: 'ai', text: `Yes! The answer is ${secret.name}. You won in ${questionCount + 1} questions.` }]);
        setGameState('won');
        playSwitch(); // Success sound
      } else {
        const newCount = questionCount + 1;
        setQuestionCount(newCount);
        
        if (newCount >= 20) {
          setHistory(prev => [...prev, { type: 'ai', text: `No. Game Over. I was thinking of: ${secret.name}.` }]);
          setGameState('lost');
        } else {
          setHistory(prev => [...prev, { type: 'ai', text: answer }]);
          
          // Provide hint at 10 and 15 questions
          if (newCount === 10) {
             setTimeout(() => setHistory(prev => [...prev, { type: 'ai', text: "Hint: " + secret.hint }]), 500);
          }
        }
      }
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/90 border border-[#00ffd5]/30 rounded-xl overflow-hidden flex flex-col h-[600px] shadow-[0_0_30px_rgba(0,255,213,0.1)]">
      {/* Header */}
      <div className="bg-[#00ffd5]/10 p-4 border-b border-[#00ffd5]/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Brain className="text-[#00ffd5]" size={24} />
          <h2 className="text-xl font-bold text-white font-orbitron">NEXUS_ORACLE v1.0</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono text-[#00ffd5]">
            Q: {questionCount}/20
          </div>
          <button 
            onClick={() => { playClick(); startNewGame(); }}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Restart Game"
          >
            <RefreshCw size={18} className="text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {history.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-lg text-sm ${
                msg.type === 'user' 
                  ? 'bg-[#00ffd5]/20 text-white border border-[#00ffd5]/30 rounded-tr-none' 
                  : 'bg-[#ff66cc]/10 text-gray-200 border border-[#ff66cc]/30 rounded-tl-none'
              }`}
            >
              {msg.type === 'ai' && <span className="text-[#ff66cc] text-xs font-bold block mb-1">ORACLE</span>}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={gameState === 'playing' ? "Ask a yes/no question..." : "Game Over. Restart to play again."}
            disabled={gameState !== 'playing'}
            className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00ffd5] focus:ring-1 focus:ring-[#00ffd5] transition-all disabled:opacity-50"
            autoFocus
            onFocus={playHover}
          />
          <button
            type="submit"
            disabled={gameState !== 'playing' || !input.trim()}
            className="bg-[#00ffd5] text-black font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onMouseEnter={playHover}
          >
            <Send size={18} />
            <span className="hidden sm:inline">ASK</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwentyQuestionsGame;
