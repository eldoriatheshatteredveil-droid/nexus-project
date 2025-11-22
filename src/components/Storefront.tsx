import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Tag, Star, Zap, Code, Cpu, Gamepad2, LayoutGrid } from 'lucide-react';
import { GENRES } from '../data/games';
import { useStore } from '../store';
import GameCardHolographic from './GameCardHolographic';
import GameDetailModal from './GameDetailModal';

const Storefront: React.FC = () => {
  const games = useStore((state) => state.games);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'nvious' | 'ai' | 'dev'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Rotate featured game daily
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const featuredGame = games[dayOfYear % games.length];

  return (
    <div className="min-h-screen text-white p-6 pb-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Hero Section - Featured Game */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden border border-primary/30 group cursor-pointer"
          onClick={() => setSelectedGameId(featuredGame.id)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <img 
            src={featuredGame.cover} 
            alt={featuredGame.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          
          <div className="relative z-20 p-8 md:p-16 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary text-sm font-mono animate-pulse">
              <Zap size={14} />
              <span>NEXUS SELECT // FEATURED</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              {featuredGame.title.toUpperCase()}
            </h1>
            
            <p className="text-lg text-gray-300 line-clamp-3 max-w-xl leading-relaxed">
              {featuredGame.description}
            </p>

            <div className="flex flex-wrap gap-3">
              {featuredGame.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-400 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgb(var(--color-primary)/0.4)] hover:shadow-[0_0_40px_rgb(var(--color-primary)/0.6)] transition-shadow flex items-center gap-3"
            >
              <Gamepad2 className="w-6 h-6" />
              PLAY NOW
            </motion.button>
          </div>
        </motion.div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-4 z-30 bg-black/50 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Games', icon: LayoutGrid },
              { id: 'nvious', label: 'Nexus Originals', icon: Zap },
              { id: 'ai', label: 'AI Tools', icon: Cpu },
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
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search the Nexus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
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
