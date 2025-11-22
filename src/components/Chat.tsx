import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Send, X, MessageSquare, Shield, User as UserIcon, Activity, Ban, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberSound } from '../hooks/useCyberSound';

const BAD_WORDS = ['spam', 'bad', 'rude', 'hack', 'virus', 'malware', 'idiot', 'stupid', 'hate', 'kill'];

interface Message {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  text: string;
  timestamp: number;
  isDev: boolean;
}

interface TypingUser {
  username: string;
  timestamp: number;
}

const Chat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { playClick, playHover, playSwitch, playGlitch } = useCyberSound();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [lastSentTime, setLastSentTime] = useState(0);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load initial messages
  useEffect(() => {
    // Removed persistent storage loading to keep memory minimum
    // const savedMessages = localStorage.getItem('nexus_chat_messages');
    // if (savedMessages) {
    //   setMessages(JSON.parse(savedMessages));
    // }

    // Listen for storage events (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nexus_latest_message' && e.newValue) {
        const newMsg = JSON.parse(e.newValue);
        setMessages(prev => [...prev, newMsg]);
        playSwitch(); // Sound when new message arrives
      }
      if (e.key === 'nexus_chat_typing' && e.newValue) {
        const allTyping = JSON.parse(e.newValue) as TypingUser[];
        // Filter out self and old typing statuses (> 3s)
        const validTyping = allTyping.filter(t => 
          t.username !== user?.username && 
          Date.now() - t.timestamp < 3000
        );
        setTypingUsers(validTyping);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, playSwitch]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Typing indicator logic
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    if (!user) return;

    const currentTyping = JSON.parse(localStorage.getItem('nexus_chat_typing') || '[]') as TypingUser[];
    const newTyping = [
      ...currentTyping.filter(t => t.username !== user.username), // Remove self
      { username: user.username || 'Anonymous', timestamp: Date.now() } // Add self updated
    ];
    
    localStorage.setItem('nexus_chat_typing', JSON.stringify(newTyping));
  };

  // Cleanup typing status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTyping = JSON.parse(localStorage.getItem('nexus_chat_typing') || '[]') as TypingUser[];
      const validTyping = currentTyping.filter(t => Date.now() - t.timestamp < 3000);
      
      if (JSON.stringify(validTyping) !== JSON.stringify(currentTyping)) {
        localStorage.setItem('nexus_chat_typing', JSON.stringify(validTyping));
      }
      
      // Update local state for display (excluding self)
      setTypingUsers(validTyping.filter(t => t.username !== user?.username));
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    const now = Date.now();
    const timeSinceLast = now - lastSentTime;
    const cooldown = 5000;

    // Hall-Monitor: Spam Protection
    if (!user.is_dev && timeSinceLast < cooldown) {
      const hallMonitorMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'hall-monitor-bot',
        username: 'Hall-Monitor',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=HallMonitor&backgroundColor=ffcc00',
        text: '⚠️ SPAM DETECTED: Please wait before transmitting again. Rate limit exceeded.',
        timestamp: now,
        isDev: false
      };
      setMessages(prev => [...prev, hallMonitorMsg]);
      playGlitch();
      return;
    }

    // Hall-Monitor: Profanity Filter
    const lowerText = inputValue.toLowerCase();
    const containsBadWord = BAD_WORDS.some(word => lowerText.includes(word));

    if (containsBadWord) {
      const hallMonitorMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        userId: 'hall-monitor-bot',
        username: 'Hall-Monitor',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=HallMonitor&backgroundColor=ff0000',
        text: '🚫 MESSAGE BLOCKED: Rudeness will not be tolerated in the Nexus. Watch your language.',
        timestamp: now,
        isDev: false
      };
      setMessages(prev => [...prev, hallMonitorMsg]);
      setInputValue('');
      playGlitch();
      return;
    }

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username || 'Anonymous',
      avatarUrl: user.avatar_url,
      text: inputValue.trim(),
      timestamp: now,
      isDev: !!user.is_dev
    };

    const updatedMessages = [...messages, newMessage].slice(-50); // Keep last 50
    setMessages(updatedMessages);
    // Send only the new message to other tabs via storage event
    localStorage.setItem('nexus_latest_message', JSON.stringify(newMessage));
    
    setInputValue('');
    setLastSentTime(now);
    playClick();
  };

  const cooldownRemaining = Math.max(0, 5000 - (Date.now() - lastSentTime));
  const isCooldownActive = !user?.is_dev && cooldownRemaining > 0;

  // Force re-render for cooldown timer visual
  const [, setTick] = useState(0);
  useEffect(() => {
    if (isCooldownActive) {
      const timer = setInterval(() => setTick(t => t + 1), 100);
      return () => clearInterval(timer);
    }
  }, [isCooldownActive]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-24 right-0 bottom-0 w-full md:w-96 bg-black/90 backdrop-blur-xl border-l border-[#00ffd5]/20 z-40 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.8)]"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#00ffd5]/20 flex justify-between items-center bg-[#00ffd5]/5">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#00ffd5]" />
          <h3 className="font-orbitron font-bold text-white tracking-wider">GLOBAL_UPLINK</h3>
        </div>
        <button 
          onClick={onClose}
          onMouseEnter={playHover}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-10 font-mono text-xs">
            NO SIGNAL DETECTED. BE THE FIRST TO TRANSMIT.
          </div>
        )}
        
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-[90%] ${msg.userId === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full border flex-shrink-0 overflow-hidden ${
                msg.isDev ? 'border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'border-[#00ffd5]/30'
              }`}>
                {msg.avatarUrl ? (
                  <img src={msg.avatarUrl} alt={msg.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <UserIcon size={14} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold font-orbitron ${
                    msg.userId === 'hall-monitor-bot' ? 'text-yellow-500' : msg.isDev ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {msg.userId === 'hall-monitor-bot' && <AlertTriangle size={10} className="inline mr-1" />}
                    {msg.isDev && <Shield size={10} className="inline mr-1" />}
                    {msg.username}
                  </span>
                  <span className="text-[9px] text-gray-600 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className={`px-3 py-2 rounded-lg text-sm font-mono break-words relative ${
                  msg.userId === 'hall-monitor-bot'
                    ? 'bg-yellow-900/20 border border-yellow-500/50 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                    : msg.isDev 
                      ? 'bg-red-900/20 border border-red-500/50 text-red-100 shadow-[0_0_15px_rgba(220,38,38,0.2)]' 
                      : msg.userId === user?.id
                        ? 'bg-[#00ffd5]/20 border border-[#00ffd5]/30 text-white'
                        : 'bg-white/5 border border-white/10 text-gray-300'
                }`}>
                  {msg.text}
                  
                  {/* Dev Banner Effect */}
                  {msg.isDev && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <div className="h-6 px-4 flex items-center text-[10px] text-[#00ffd5] font-mono">
        {typingUsers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Activity size={10} className="animate-pulse" />
            <span>
              {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} transmitting...
            </span>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black border-t border-[#00ffd5]/20">
        {!user ? (
          <div className="text-center p-2 border border-dashed border-gray-700 rounded text-gray-500 text-xs font-mono">
            LOGIN REQUIRED TO TRANSMIT
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={inputValue}
                onChange={handleTyping}
                placeholder={isCooldownActive ? `COOLDOWN: ${(cooldownRemaining / 1000).toFixed(1)}s` : "Enter transmission..."}
                disabled={isCooldownActive}
                className={`w-full bg-white/5 border rounded px-3 py-2 text-sm text-white focus:outline-none transition-all font-mono ${
                  isCooldownActive 
                    ? 'border-red-500/50 cursor-not-allowed opacity-50' 
                    : 'border-[#00ffd5]/30 focus:border-[#00ffd5] focus:shadow-[0_0_10px_rgba(0,255,213,0.2)]'
                }`}
              />
              {isCooldownActive && (
                <div 
                  className="absolute bottom-0 left-0 h-[2px] bg-red-500 transition-all duration-100"
                  style={{ width: `${(cooldownRemaining / 5000) * 100}%` }}
                />
              )}
            </div>
            <button
              type="submit"
              disabled={isCooldownActive || !inputValue.trim()}
              className={`p-2 rounded border transition-all ${
                isCooldownActive || !inputValue.trim()
                  ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#00ffd5]/20 border-[#00ffd5] text-[#00ffd5] hover:bg-[#00ffd5] hover:text-black'
              }`}
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default Chat;
