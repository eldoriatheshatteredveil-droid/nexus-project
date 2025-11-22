import React, { useState } from 'react';
import { Users, Trophy, Circle, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../store';

interface Player {
  id: string;
  username: string;
  status: 'online' | 'playing' | 'idle';
  score: number;
  avatar: string;
}

const MultiplayerLobby: React.FC<{ gameId: string }> = ({ gameId }) => {
  const { user } = useAuth();
  const { highScores } = useStore();
  const [activeTab, setActiveTab] = useState<'lobby' | 'leaderboard'>('lobby');

  // Construct real player list (currently only local user due to no backend)
  const players: Player[] = user ? [{
    id: user.id,
    username: user.username || 'Operative',
    status: 'online',
    score: highScores[gameId] || 0,
    avatar: user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`
  }] : [];

  return (
    <div className="w-full h-full bg-black/80 border-l border-[#00ffd5]/20 flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[#00ffd5]/20">
        <button
          onClick={() => setActiveTab('lobby')}
          className={`flex-1 py-3 text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'lobby' ? 'bg-[#00ffd5]/10 text-[#00ffd5]' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Users size={14} /> LOBBY ({players.length})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-3 text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'leaderboard' ? 'bg-[#00ffd5]/10 text-[#00ffd5]' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Trophy size={14} /> RANKING
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {players.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 font-mono text-xs">
            PLEASE LOGIN TO VIEW LOBBY
          </div>
        ) : activeTab === 'lobby' ? (
          <>
            {players.map(player => (
              <motion.div 
                key={player.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/5 hover:border-[#00ffd5]/30 transition-colors"
              >
                <div className="relative">
                  <img src={player.avatar} alt={player.username} className="w-8 h-8 rounded bg-black" />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                    player.status === 'playing' ? 'bg-green-500' : 
                    player.status === 'online' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-200 truncate">{player.username}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{player.status}</div>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <>
            {players.map((player, index) => (
              <motion.div 
                key={player.id}
                layout
                className="flex items-center gap-3 p-2 rounded bg-white/5 border border-white/5"
              >
                <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-orange-700 text-black' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <img src={player.avatar} alt={player.username} className="w-8 h-8 rounded bg-black" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-200">{player.username}</div>
                  <div className="text-xs text-[#00ffd5] font-mono">{player.score.toLocaleString()} PTS</div>
                </div>
                {index === 0 && <Crown size={16} className="text-yellow-500" />}
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#00ffd5]/20 bg-black/50">
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <Circle size={8} className="text-green-500 fill-green-500 animate-pulse" />
          <span>CONNECTED TO NEXUS_LOCAL</span>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerLobby;
