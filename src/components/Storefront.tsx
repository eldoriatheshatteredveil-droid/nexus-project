import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Tag, Star, Zap, Code, Cpu, Gamepad2, LayoutGrid, User, Users, Skull, Shield } from 'lucide-react';
import { useStore } from '../store';
import GameCardHolographic from './GameCardHolographic';
import GameDetailModal from './GameDetailModal';
import FactionDivider from './FactionDivider';

const Storefront: React.FC = () => {
  const games = useStore((state) => state.games);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'nvious' | 'ai' | 'dev' | 'singleplayer' | 'multiplayer'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const filteredGames = games.filter(game => {
    let matchesCategory = true;
    
    if (selectedCategory === 'singleplayer') {
      matchesCategory = game.mode === 'singleplayer';
    } else if (selectedCategory === 'multiplayer') {
      matchesCategory = game.mode === 'multiplayer';
    } else if (selectedCategory === 'nvious') {
      matchesCategory = game.tags.includes('Nexus Original');
    } else if (selectedCategory !== 'all') {
      matchesCategory = game.category === selectedCategory;
    }

    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen text-white p-6 pb-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Hero Section - Faction Wars Announcement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden border border-white/10 group min-h-[600px] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 md:p-12"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-black z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,30,0.8),_rgba(0,0,0,1))] z-0" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10 opacity-20" />
          
          {/* Content */}
          <div className="relative z-20 w-full max-w-6xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs md:text-sm font-mono tracking-[0.2em] uppercase backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Choose Your Allegiance</span>
              </div>
              
              <div className="relative py-2 group/title">
                {/* Ambient Glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-full h-24 bg-gradient-to-r from-[#ff00ff]/30 via-white/10 to-[#00ffd5]/30 blur-[60px] opacity-50 group-hover/title:opacity-80 transition-opacity duration-500" />
                </div>

                {/* Main Title */}
                <h1 className="text-6xl md:text-9xl font-black font-orbitron tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] via-white to-[#00ffd5] animate-pulse-slow relative z-10"
                    style={{ filter: 'drop-shadow(-4px 0px 0px rgba(255,0,255,0.3)) drop-shadow(4px 0px 0px rgba(0,255,213,0.3)) drop-shadow(0 0 30px rgba(255,255,255,0.15))' }}>
                  FACTION WARS
                </h1>
              </div>
              
              <p className="text-gray-400 font-mono max-w-2xl mx-auto text-lg">
                The Nexus is divided. Will you fight for chaos or order? Your choice will determine your allies, your missions, and your destiny.
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Syndicate Card */}
              <button className="group relative h-[500px] border border-purple-500/30 bg-purple-900/10 rounded-2xl overflow-hidden hover:bg-purple-900/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(168,85,247,0.2)] text-left">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.2),transparent_50%)] z-10" />
                
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-32 h-32 rounded-full bg-purple-500/10 border border-purple-500/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-500 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <Skull size={64} className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" strokeWidth={1.5} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-purple-400 font-orbitron tracking-wider drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                      THE SYNDICATE
                    </h3>
                    <p className="text-purple-300/80 text-sm font-mono tracking-widest uppercase">Cybernetic Elite</p>
                  </div>

                  <div className="space-y-4 max-w-sm">
                    <p className="text-gray-300 font-mono italic">"Chaos is the only true freedom."</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Hackers, rebels, and outcasts fighting to dismantle the system.
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="px-8 py-3 border border-purple-500 text-purple-400 rounded font-bold tracking-widest group-hover:bg-purple-500 group-hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                      JOIN THE REBELLION
                    </div>
                  </div>
                </div>
              </button>

              {/* Security Card */}
              <button className="group relative h-[500px] border border-blue-500/30 bg-blue-900/10 rounded-2xl overflow-hidden hover:bg-blue-900/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(59,130,246,0.2)] text-left">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_50%)] z-10" />
                
                <div className="relative z-20 h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-32 h-32 rounded-full bg-blue-500/10 border border-blue-500/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    <Shield size={64} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" strokeWidth={1.5} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-blue-400 font-orbitron tracking-wider drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                      SYSTEM SECURITY
                    </h3>
                    <p className="text-blue-300/80 text-sm font-mono tracking-widest uppercase">Corporate Enforcers</p>
                  </div>

                  <div className="space-y-4 max-w-sm">
                    <p className="text-gray-300 font-mono italic">"Order must be maintained."</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Enforcers, guardians, and white-hats protecting the Nexus integrity.
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="px-8 py-3 border border-blue-500 text-blue-400 rounded font-bold tracking-widest group-hover:bg-blue-500 group-hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                      ENLIST NOW
                    </div>
                  </div>
                </div>
              </button>

            </div>
          </div>
        </motion.div>

        <FactionDivider />

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 z-30 bg-black/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Games', icon: LayoutGrid },
              { id: 'nvious', label: 'Nexus Originals', icon: Zap },
              { id: 'singleplayer', label: 'Single Player', icon: User },
              { id: 'multiplayer', label: 'Multiplayer', icon: Users },
              { id: 'ai', label: 'AI Games', icon: Cpu },
              { id: 'dev', label: 'Indie Games', icon: Gamepad2 },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                  ${selectedCategory === cat.id 
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}
                `}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-12 hover:w-full md:hover:w-96 focus-within:w-full md:focus-within:w-96 transition-all duration-300 ease-out group ml-auto shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary group-hover:text-primary transition-colors z-10 pointer-events-none" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-transparent group-hover:placeholder-gray-600 group-focus-within:placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer focus:cursor-text"
            />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedGameId(game.id)}
              >
                <GameCardHolographic game={game} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            <p className="text-2xl font-mono mb-2 text-secondary">NO SIGNALS DETECTED</p>
            <p className="text-sm font-mono">ADJUST SEARCH PARAMETERS TO RE-ESTABLISH UPLINK.</p>
          </div>
        )}
      </div>

      {/* Game Detail Modal */}
      <GameDetailModal 
        game={games.find(g => g.id === selectedGameId) || null} 
        isOpen={!!selectedGameId} 
        onClose={() => setSelectedGameId(null)} 
      />
    </div>
  );
};

export default Storefront;
