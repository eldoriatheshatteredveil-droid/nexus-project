import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Minus, Square, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { useCyberSound } from '../hooks/useCyberSound';

interface CommandHistory {
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
}

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    { type: 'output', content: 'NEXUS_OS v2.4.0 initialized...' },
    { type: 'output', content: 'Type "help" for available commands.' }
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { playClick, playSwitch, playGlitch } = useCyberSound();
  const { 
    credits, addCredits, 
    faction, setFaction, 
    killCount, 
    xp, addXp,
    inventory, addItem,
    missions
  } = useStore();

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [history, isOpen]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    const params = args.slice(1);

    const newHistory: CommandHistory[] = [
      ...history,
      { type: 'input', content: cmd }
    ];

    switch (command) {
      case 'help':
        newHistory.push({ 
          type: 'output', 
          content: `
AVAILABLE COMMANDS:
  help              - Show this list
  clear             - Clear terminal history
  status            - Show current user status
  missions          - Check daily missions
  war               - Global faction status
  credits           - Check balance
  faction [name]    - Join 'syndicate' or 'security'
  hack [target]     - Attempt to hack a target (simulated)
  whoami            - Display user info
  exit              - Close terminal
          ` 
        });
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'status':
        newHistory.push({ 
          type: 'success', 
          content: `
STATUS REPORT:
  USER: ${user?.username || 'GUEST'}
  FACTION: ${faction ? faction.toUpperCase() : 'NONE'}
  CREDITS: ${credits || 0}
  KILLS: ${killCount}
  XP: ${xp}
  INVENTORY: ${(inventory || []).length} items
          ` 
        });
        break;

      case 'war':
        const syndicateScore = 45000 + Math.floor(Math.random() * 5000);
        const securityScore = 42000 + Math.floor(Math.random() * 5000);
        const total = syndicateScore + securityScore;
        const synPercent = Math.floor((syndicateScore / total) * 100);
        const secPercent = Math.floor((securityScore / total) * 100);
        const winning = syndicateScore > securityScore ? 'SYNDICATE' : 'SECURITY';
        
        newHistory.push({ 
          type: 'output', 
          content: `
GLOBAL CONFLICT STATUS:
  SYNDICATE CONTROL: ${synPercent}% [${syndicateScore.toLocaleString()}]
  SECURITY CONTROL:  ${secPercent}% [${securityScore.toLocaleString()}]
  
  CURRENT LEADER: ${winning}
  YOUR FACTION: ${faction ? faction.toUpperCase() : 'NEUTRAL'}
          ` 
        });
        break;

      case 'credits':
        newHistory.push({ type: 'success', content: `CURRENT BALANCE: ${credits || 0} CR` });
        break;

      case 'missions':
        const missionList = missions.map(m => 
          `[${m.completed ? 'COMPLETE' : 'ACTIVE'}] ${m.title}: ${m.description} (${m.current}/${m.target}) - REWARD: ${m.reward} CR`
        ).join('\n  ');
        
        newHistory.push({ 
          type: 'success', 
          content: `DAILY MISSIONS:\n  ${missionList}` 
        });
        break;

      case 'faction':
        if (!params[0]) {
          newHistory.push({ type: 'output', content: `CURRENT FACTION: ${faction || 'NONE'}. Usage: faction <syndicate|security>` });
        } else {
          const targetFaction = params[0].toLowerCase();
          if (targetFaction === 'syndicate' || targetFaction === 'security') {
            setFaction(targetFaction as any);
            newHistory.push({ type: 'success', content: `ALLEGIANCE UPDATED. WELCOME TO ${targetFaction.toUpperCase()}.` });
            playGlitch();
          } else {
            newHistory.push({ type: 'error', content: 'INVALID FACTION. CHOOSE: syndicate OR security' });
          }
        }
        break;

      case 'hack':
        if (!params[0]) {
          newHistory.push({ type: 'error', content: 'TARGET REQUIRED. Usage: hack <username/ip>' });
        } else {
          const chance = Math.random();
          if (chance > 0.7) {
            const loot = Math.floor(Math.random() * 500);
            addCredits(loot);
            addXp(100);
            newHistory.push({ type: 'success', content: `HACK SUCCESSFUL. BYPASSED FIREWALL. STOLEN: ${loot} CR.` });
          } else {
            newHistory.push({ type: 'error', content: 'HACK FAILED. SECURITY PROTOCOLS ENGAGED. TRACE DETECTED.' });
            playGlitch();
          }
        }
        break;

      case 'whoami':
        newHistory.push({ type: 'output', content: `UID: ${user?.id || 'ANONYMOUS'}\nSESSION: ACTIVE\nPERMISSIONS: ${user?.is_dev ? 'ROOT' : 'USER'}` });
        break;

      case 'exit':
        onClose();
        break;

      // Dev Cheats
      case 'sudo':
        if (params[0] === 'give_credits') {
          addCredits(1000);
          newHistory.push({ type: 'success', content: 'ROOT ACCESS GRANTED. 1000 CR ADDED.' });
        } else {
          newHistory.push({ type: 'error', content: 'PERMISSION DENIED.' });
        }
        break;

      default:
        newHistory.push({ type: 'error', content: `COMMAND NOT FOUND: ${command}` });
    }

    setHistory(newHistory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
    playClick();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
          />
          
          <motion.div
            key="terminal"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 right-0 h-[50vh] bg-black/95 border-b-2 border-[#00ffd5] z-[10000] shadow-[0_0_50px_rgba(0,255,213,0.2)] flex flex-col font-mono text-sm"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#00ffd5]/10 border-b border-[#00ffd5]/20">
              <div className="flex items-center gap-2 text-[#00ffd5]">
                <TerminalIcon size={16} />
                <span className="font-bold tracking-wider">NEXUS_TERMINAL_CLI</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-white"><Minus size={16} /></button>
                <button className="text-gray-500 hover:text-white"><Square size={14} /></button>
                <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X size={16} /></button>
              </div>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar" onClick={() => inputRef.current?.focus()}>
              {history.map((entry, i) => (
                <div key={i} className={`${
                  entry.type === 'input' ? 'text-gray-400 mt-2' :
                  entry.type === 'error' ? 'text-red-500' :
                  entry.type === 'success' ? 'text-[#00ffd5]' :
                  'text-gray-300'
                } whitespace-pre-wrap`}>
                  {entry.type === 'input' && <span className="text-[#00ffd5] mr-2">$</span>}
                  {entry.content}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input Line */}
            <form onSubmit={handleSubmit} className="p-4 bg-black border-t border-[#00ffd5]/20 flex items-center gap-2">
              <ChevronRight size={16} className="text-[#00ffd5] animate-pulse" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#00ffd5] font-mono placeholder-gray-700"
                placeholder="Enter command..."
                autoFocus
              />
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Terminal;
