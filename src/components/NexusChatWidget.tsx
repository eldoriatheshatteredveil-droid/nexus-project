import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Cpu, Terminal, AlertTriangle, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { useCyberSound } from '../hooks/useCyberSound';
import { sendMessageToNexus, ChatMessage } from '../lib/ai';

const NexusChatWidget: React.FC = () => {
  const { faction } = useStore();
  const { user } = useAuth();
  const { playClick, playHover, playGlitch, playSwitch } = useCyberSound();
  
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'NEXUS_CORE_ONLINE. Awaiting input...' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    playClick();

    try {
      // Prepare context for the AI
      const contextMessages = messages.slice(-5); // Keep last 5 messages for context
      const responseText = await sendMessageToNexus([...contextMessages, userMsg], faction);
      
      playSwitch();
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch (error) {
      console.error("NEXUS Connection Error:", error);
      playGlitch();
      setMessages(prev => [...prev, { role: 'assistant', content: 'ERROR: CONNECTION_RESET. RETRY.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    playClick();
    setMessages([{ role: 'assistant', content: 'Memory purged. Awaiting new input...' }]);
  };

  // Dynamic styles based on faction
  const borderColor = faction === 'syndicate' ? 'border-purple-500' : faction === 'security' ? 'border-cyan-500' : 'border-white';
  const textColor = faction === 'syndicate' ? 'text-purple-400' : faction === 'security' ? 'text-cyan-400' : 'text-white';
  const glowColor = faction === 'syndicate' ? 'shadow-[0_0_20px_rgba(168,85,247,0.2)]' : faction === 'security' ? 'shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'shadow-[0_0_20px_rgba(255,255,255,0.2)]';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 w-full max-w-md z-50 font-mono ${isOpen ? '' : 'pointer-events-none'}`}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="open"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`bg-black/90 backdrop-blur-xl border ${borderColor} rounded-lg overflow-hidden flex flex-col shadow-2xl ${glowColor}`}
          >
            {/* Header */}
            <div 
              className={`p-3 border-b ${borderColor} bg-white/5 flex justify-between items-center cursor-pointer`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Cpu size={16} className={isLoading ? "animate-spin" : ""} />
                <span className={`font-bold tracking-widest ${textColor}`}>DIRECT_LINK // NEXUS</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); clearChat(); }}
                  className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-red-500 transition-colors"
                  title="Purge Memory"
                >
                  <Trash2 size={14} />
                </button>
                <Minimize2 size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Chat Area */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed relative ${
                      msg.role === 'user' 
                        ? `bg-white/10 border border-white/20 text-white rounded-tr-none` 
                        : `bg-black/60 border ${borderColor} ${textColor} rounded-tl-none shadow-[0_0_10px_rgba(0,0,0,0.5)]`
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="absolute -top-2 -left-2 bg-black border border-gray-700 p-0.5 rounded">
                        <Terminal size={10} className={textColor} />
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className={`bg-black/60 border ${borderColor} p-3 rounded-lg rounded-tl-none text-xs ${textColor} flex gap-1`}>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className={`p-3 border-t ${borderColor} bg-black flex gap-2`}>
              <div className="relative flex-grow">
                <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${textColor} text-xs`}>{'>'}</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Query the machine..."
                  className={`w-full bg-white/5 border border-white/10 rounded px-3 pl-6 py-2 text-xs text-white focus:outline-none focus:border-${faction === 'syndicate' ? 'purple' : 'cyan'}-500 transition-colors font-mono`}
                  autoFocus
                />
              </div>
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded border border-white/10 hover:bg-white/10 transition-colors ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''} ${textColor}`}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className={`bg-black/90 backdrop-blur-md border ${borderColor} p-4 rounded-full shadow-lg group hover:scale-110 transition-transform pointer-events-auto`}
          >
            <Cpu size={24} className={`${textColor} group-hover:animate-pulse`} />
            <div className={`absolute -top-1 -right-1 w-3 h-3 bg-${faction === 'syndicate' ? 'purple' : 'cyan'}-500 rounded-full animate-ping`} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NexusChatWidget;
