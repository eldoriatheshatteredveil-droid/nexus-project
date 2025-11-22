import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Lock, AlertTriangle, X, Shield, Zap, Crown, Magnet, Clock, Code, Key } from 'lucide-react';
import { useStore } from '../store';
import { MARKET_ITEMS, Item } from '../data/items';
import { useCyberSound } from '../hooks/useCyberSound';

interface BlackMarketProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlackMarket: React.FC<BlackMarketProps> = ({ isOpen, onClose }) => {
  const { credits, removeCredits, inventory, addItem } = useStore();
  const { playClick, playSwitch, playGlitch } = useCyberSound();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const handlePurchase = async (item: Item) => {
    if ((credits || 0) < item.price) {
      setPurchaseStatus('failed');
      playGlitch();
      setTimeout(() => setPurchaseStatus('idle'), 2000);
      return;
    }

    setPurchaseStatus('processing');
    playSwitch();

    // Simulate network transaction
    await new Promise(resolve => setTimeout(resolve, 1500));

    removeCredits(item.price);
    addItem(item.id);
    setPurchaseStatus('success');
    playClick();

    setTimeout(() => {
      setPurchaseStatus('idle');
      setSelectedItem(null);
    }, 1500);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock size={24} />;
      case 'Magnet': return <Magnet size={24} />;
      case 'Code': return <Code size={24} />;
      case 'Crown': return <Crown size={24} />;
      case 'Key': return <Key size={24} />;
      default: return <Zap size={24} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0a0a0a] border border-red-900/50 rounded-xl overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.2)] flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-red-900/30 flex justify-between items-center bg-gradient-to-r from-red-950/30 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded border border-red-500/30">
                  <ShoppingCart className="text-red-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-orbitron text-red-500 tracking-widest">BLACK MARKET</h2>
                  <p className="text-xs text-red-400/60 font-mono">UNAUTHORIZED ACCESS DETECTED</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-mono">AVAILABLE FUNDS</div>
                  <div className="text-xl font-bold text-primary font-mono">{(credits || 0).toLocaleString()} CR</div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MARKET_ITEMS.map((item) => {
                  const isOwned = (inventory || []).includes(item.id);
                  const canAfford = (credits || 0) >= item.price;

                  return (
                    <div 
                      key={item.id}
                      onClick={() => !isOwned && setSelectedItem(item)}
                      className={`relative group p-4 rounded-lg border transition-all cursor-pointer ${
                        isOwned 
                          ? 'border-gray-800 bg-gray-900/50 opacity-50' 
                          : 'border-red-900/30 bg-black/40 hover:border-red-500/50 hover:bg-red-950/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${
                          item.rarity === 'legendary' ? 'bg-yellow-500/10 text-yellow-500' :
                          item.rarity === 'illegal' ? 'bg-red-500/10 text-red-500' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {getIcon(item.icon)}
                        </div>
                        {isOwned ? (
                          <span className="text-[10px] font-bold bg-gray-800 text-gray-400 px-2 py-1 rounded">OWNED</span>
                        ) : (
                          <span className={`text-sm font-bold font-mono ${canAfford ? 'text-white' : 'text-red-500'}`}>
                            {item.price} CR
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-white font-orbitron mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 font-mono mb-3 h-8">{item.description}</p>

                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
                        <span className={`px-2 py-0.5 rounded border ${
                          item.type === 'cheat' ? 'border-purple-500/30 text-purple-400' :
                          item.type === 'system' ? 'border-red-500/30 text-red-400' :
                          'border-blue-500/30 text-blue-400'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-gray-600">|</span>
                        <span className={`${
                          item.rarity === 'legendary' ? 'text-yellow-500' :
                          item.rarity === 'illegal' ? 'text-red-500' :
                          'text-gray-400'
                        }`}>
                          {item.rarity}
                        </span>
                      </div>

                      {!isOwned && (
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg border border-red-500/20" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchase Modal Overlay */}
            <AnimatePresence>
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 z-20"
                >
                  <div className="w-full max-w-md text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                      {getIcon(selectedItem.icon)}
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white font-orbitron mb-2">CONFIRM TRANSACTION</h3>
                      <p className="text-gray-400">Are you sure you want to purchase <span className="text-white font-bold">{selectedItem.name}</span>?</p>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xl font-mono">
                      <span className="text-gray-500 line-through">{(credits || 0)} CR</span>
                      <span className="text-red-500">→</span>
                      <span className="text-primary">{(credits || 0) - selectedItem.price} CR</span>
                    </div>

                    {purchaseStatus === 'failed' && (
                      <div className="p-3 bg-red-500/20 border border-red-500 text-red-500 rounded text-sm font-bold flex items-center justify-center gap-2">
                        <AlertTriangle size={16} /> INSUFFICIENT FUNDS
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="flex-1 py-3 border border-gray-700 rounded hover:bg-gray-800 transition-colors text-gray-400"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={() => handlePurchase(selectedItem)}
                        disabled={purchaseStatus === 'processing'}
                        className="flex-1 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                      >
                        {purchaseStatus === 'processing' ? (
                          <span className="animate-pulse">PROCESSING...</span>
                        ) : purchaseStatus === 'success' ? (
                          <span>ACQUIRED</span>
                        ) : (
                          <span>PURCHASE</span>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BlackMarket;
