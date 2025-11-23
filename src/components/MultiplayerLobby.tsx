import React, { useState, useEffect, useRef } from 'react';
import { Users, Trophy, Circle, Crown, MessageSquare, Play, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../store';
import { useMultiplayer } from '../hooks/useMultiplayer';

const MultiplayerLobby: React.FC<{ gameId: string }> = ({ gameId }) => {
  const { user } = useAuth();
  const { highScores } = useStore();
  const { players, messages, queue, activeMatch, sendMessage, joinQueue, leaveQueue } = useMultiplayer(gameId);
  const [activeTab, setActiveTab] = useState<'lobby' | 'chat' | 'leaderboard'>('lobby');
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isInQueue = user && queue.includes(user.id);
  const isPlaying = !!activeMatch;

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      sendMessage(chatInput.trim());
      setChatInput('');
    }
  };

  return (
    <div className="w-full h-full bg-black/80 border-l border-[#00ffd5]/20 flex flex-col font-mono">
      {/* Tabs */}
      <div className="flex border-b border-[#00ffd5]/20">
        <button
          onClick={() => setActiveTab('lobby')}
          className={`flex-1 py-3 text-[10px] font-bold tracking-wider flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'lobby' ? 'bg-[#00ffd5]/10 text-[#00ffd5]' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Users size={12} /> LOBBY ({players.length})
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-[10px] font-bold tracking-wider flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'chat' ? 'bg-[#00ffd5]/10 text-[#00ffd5]' : 'text-gray-500 hover:text-white'
          }`}
        >
          <MessageSquare size={12} /> CHAT
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-3 text-[10px] font-bold tracking-wider flex items-center justify-center gap-1 transition-colors ${
            activeTab === 'leaderboard' ? 'bg-[#00ffd5]/10 text-[#00ffd5]' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Trophy size={12} /> RANK
        </button>
      </div>

      {/* Queue Action Area */}
      <div className="p-4 border-b border-[#00ffd5]/20 bg-black/40">
        {isPlaying ? (
          <div className="w-full py-3 bg-green-500/20 border border-green-500 text-green-500 rounded flex items-center justify-center gap-2 font-bold animate-pulse">
            <Circle size={12} fill="currentColor" /> MATCH IN PROGRESS
          </div>
        ) : isInQueue ? (
          <button
            onClick={leaveQueue}
            className="w-full py-3 bg-red-500/20 border border-red-500 text-red-500 rounded hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 font-bold"
          >
            <X size={16} /> LEAVE QUEUE ({queue.indexOf(user?.id || '') + 1}/{queue.length})
          </button>
        ) : (
          <button
            onClick={joinQueue}
            disabled={!user}
            className="w-full py-3 bg-[#00ffd5]/20 border border-[#00ffd5] text-[#00ffd5] rounded hover:bg-[#00ffd5] hover:text-black transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={16} /> JOIN MATCHMAKING
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative">
        <AnimatePresence mode="wait">
          {activeTab === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-2"
            >
              {players.length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-xs">NO OPERATIVES ONLINE</div>
              ) : (
                players.map(player => (
                  <div 
                    key={player.id}
                    className={`flex items-center gap-3 p-2 rounded border transition-colors ${
                      player.id === user?.id ? 'bg-[#00ffd5]/5 border-[#00ffd5]/30' : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="relative">
                      <img src={player.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${player.username}`} alt={player.username} className="w-8 h-8 rounded bg-black" />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                        player.status === 'in-game' ? 'bg-green-500' : 
                        player.status === 'in-queue' ? 'bg-yellow-500' : 
                        'bg-blue-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-200 truncate flex items-center gap-2">
                        {player.username}
                        {player.is_dev && <span className="text-[8px] bg-[#00ffd5] text-black px-1 rounded">DEV</span>}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase">{player.status}</div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 space-y-3 mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`text-xs ${msg.system ? 'text-yellow-500 text-center italic' : ''}`}>
                    {!msg.system && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`font-bold ${msg.userId === user?.id ? 'text-[#00ffd5]' : 'text-gray-400'}`}>
                          {msg.username}
                        </span>
                        <span className="text-[8px] text-gray-600">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    <div className={msg.system ? '' : 'text-gray-300 pl-2 border-l-2 border-white/10'}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              <form onSubmit={handleSendChat} className="mt-auto flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="TRANSMIT..."
                  className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-[#00ffd5] outline-none"
                />
                <button 
                  type="submit"
                  className="p-2 bg-[#00ffd5]/10 text-[#00ffd5] border border-[#00ffd5]/30 rounded hover:bg-[#00ffd5] hover:text-black transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-2"
            >
               {/* Mock Leaderboard for now */}
               {[1, 2, 3, 4, 5].map((rank) => (
                 <div key={rank} className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/5">
                   <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${
                     rank === 1 ? 'bg-yellow-500 text-black' :
                     rank === 2 ? 'bg-gray-400 text-black' :
                     rank === 3 ? 'bg-orange-700 text-black' :
                     'bg-gray-800 text-gray-500'
                   }`}>
                     {rank}
                   </div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-gray-200">OPERATIVE_{999-rank}</div>
                     <div className="text-xs text-[#00ffd5] font-mono">{(10000 - rank * 500).toLocaleString()} PTS</div>
                   </div>
                   {rank === 1 && <Crown size={16} className="text-yellow-500" />}
                 </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#00ffd5]/20 bg-black/50">
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <Circle size={8} className={`text-green-500 fill-green-500 ${players.length > 0 ? 'animate-pulse' : ''}`} />
          <span>CONNECTED TO NEXUS_NET // {players.length} NODES ACTIVE</span>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerLobby;

