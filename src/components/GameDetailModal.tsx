import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Play, Star, Download, Trash2, MessageSquare, Send, ShieldAlert } from 'lucide-react';
import { Game } from '../data/games';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';

interface GameDetailModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, isOpen, onClose }) => {
  const addToCart = useStore((state) => state.addToCart);
  const incrementDownloads = useStore((state) => state.incrementDownloads);
  const removeGame = useStore((state) => state.removeGame);
  const addMessage = useStore((state) => state.addMessage);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');

  if (!isOpen || !game) return null;

  const isPlayable = game.id === 'nvious-snake' || game.id === 'nvious-cyber-guess' || game.id === 'nvious-20-questions' || game.id === 'nexus-pong' || game.id === 'nexus-breakout' || game.id === 'void-vanguard';

  const handlePlayClick = () => {
    incrementDownloads(game.id);
    navigate(`/play/${game.id}`);
    onClose();
  };

  const handleDownloadClick = () => {
    incrementDownloads(game.id);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#'; // In a real app, this would be the game file URL
    link.download = `${game.slug}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
      removeGame(game.id);
      onClose();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!game.uploaderId) return;

    addMessage({
      id: `msg-${Date.now()}`,
      sender: 'NEXUS_ADMIN',
      subject: messageSubject,
      content: messageContent,
      date: new Date().toISOString(),
      read: false,
      type: 'admin'
    });

    setShowMessageForm(false);
    setMessageSubject('');
    setMessageContent('');
    alert('Transmission sent to user.');
  };

  const handleClose = () => {
    setShowMessageForm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0a0a0a] border border-primary/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgb(var(--color-primary)/0.1)] z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header / Close Button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-black/50 hover:bg-primary/20 text-white hover:text-primary transition-colors border border-white/10 hover:border-primary/50"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
              {/* Left Column: Media / Game Area */}
              <div className="w-full md:w-2/3 bg-black relative min-h-[300px] md:min-h-full flex items-center justify-center border-b md:border-b-0 md:border-r border-primary/20">
                <div className="relative w-full h-full">
                  <img 
                    src={game.cover} 
                    alt={game.title} 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  
                  {isPlayable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={handlePlayClick}
                        className="group relative px-8 py-4 bg-primary text-black font-bold text-xl rounded-full overflow-hidden hover:scale-105 transition-transform shadow-[0_0_20px_rgb(var(--color-primary)/0.5)]"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Play fill="currentColor" /> PLAY NOW
                        </span>
                        <div className="absolute inset-0 bg-white/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 bg-[#0a0a0a]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-bold bg-primary/10 text-primary rounded border border-primary/20">
                      {game.category.toUpperCase()}
                    </span>
                    {game.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs text-gray-400 border border-white/10 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 font-orbitron">{game.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Download size={16} />
                      <span>{game.downloads.toLocaleString()} downloads</span>
                    </div>
                  </div>
                  {game.uploaderName && (
                    <div className="mt-2 text-xs text-gray-500 font-mono">
                      UPLOADED BY: <span className="text-primary">{game.uploaderName}</span>
                    </div>
                  )}
                </div>

                <div className="prose prose-invert text-gray-300 text-sm flex-grow">
                  <p>{game.description}</p>
                </div>

                {/* Admin Controls */}
                {user?.is_dev && (
                  <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-wider">
                      <ShieldAlert size={14} /> Admin Controls
                    </div>
                    
                    {showMessageForm ? (
                      <form onSubmit={handleSendMessage} className="space-y-2">
                        <input
                          type="text"
                          placeholder="Subject..."
                          value={messageSubject}
                          onChange={(e) => setMessageSubject(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded p-2 text-xs text-white focus:border-primary outline-none"
                          required
                        />
                        <textarea
                          placeholder="Message content..."
                          value={messageContent}
                          onChange={(e) => setMessageContent(e.target.value)}
                          className="w-full bg-black/50 border border-white/10 rounded p-2 text-xs text-white focus:border-primary outline-none resize-none"
                          rows={3}
                          required
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowMessageForm(false)}
                            className="flex-1 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-1 bg-primary text-black text-xs font-bold rounded hover:bg-primary/80"
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowMessageForm(true)}
                          className="flex-1 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <MessageSquare size={14} /> MESSAGE
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex-1 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded hover:bg-red-500/30 text-xs font-bold flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} /> DELETE
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400">Price</span>
                    <span className="text-2xl font-bold text-primary">
                      {game.price === 0 ? 'FREE' : `$${game.price}`}
                    </span>
                  </div>

                  <button
                    onClick={handleDownloadClick}
                    className="w-full py-3 bg-primary text-black font-bold rounded hover:bg-white transition-all flex items-center justify-center gap-2 group"
                  >
                    <Download size={20} className="group-hover:animate-bounce" />
                    DOWNLOAD NOW
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GameDetailModal;
