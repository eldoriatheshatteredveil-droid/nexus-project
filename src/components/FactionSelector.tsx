import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull, Check } from 'lucide-react';
import { useStore } from '../store';
import { useCyberSound } from '../hooks/useCyberSound';

interface FactionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const FactionSelector: React.FC<FactionSelectorProps> = ({ isOpen, onClose }) => {
  const { setFaction } = useStore();
  const { playClick, playSwitch } = useCyberSound();

  const handleSelect = (faction: 'syndicate' | 'security') => {
    playSwitch();
    setFaction(faction);
    setTimeout(() => {
      playClick();
      onClose();
    }, 500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="max-w-4xl w-full"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-orbitron text-white mb-4 tracking-[0.2em]">CHOOSE YOUR ALLEGIANCE</h2>
              <p className="text-gray-400 font-mono max-w-xl mx-auto">
                The Nexus is divided. Will you fight for chaos or order? Your choice will determine your allies, your missions, and your destiny.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Syndicate Card */}
              <button
                onClick={() => handleSelect('syndicate')}
                className="group relative h-[400px] border border-purple-500/30 bg-purple-900/10 rounded-2xl overflow-hidden hover:bg-purple-900/20 transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(168,85,247,0.3)]"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Skull size={48} className="text-purple-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-purple-400 font-orbitron mb-2">THE SYNDICATE</h3>
                  <p className="text-gray-400 text-sm font-mono mb-8">
                    "Chaos is the only true freedom."<br/>
                    Hackers, rebels, and outcasts fighting to dismantle the system.
                  </p>
                  <div className="px-8 py-3 border border-purple-500 text-purple-400 rounded font-bold tracking-widest group-hover:bg-purple-500 group-hover:text-black transition-all">
                    JOIN THE REBELLION
                  </div>
                </div>
              </button>

              {/* Security Card */}
              <button
                onClick={() => handleSelect('security')}
                className="group relative h-[400px] border border-blue-500/30 bg-blue-900/10 rounded-2xl overflow-hidden hover:bg-blue-900/20 transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Shield size={48} className="text-blue-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-blue-400 font-orbitron mb-2">SYSTEM SECURITY</h3>
                  <p className="text-gray-400 text-sm font-mono mb-8">
                    "Order must be maintained."<br/>
                    Enforcers, guardians, and white-hats protecting the Nexus integrity.
                  </p>
                  <div className="px-8 py-3 border border-blue-500 text-blue-400 rounded font-bold tracking-widest group-hover:bg-blue-500 group-hover:text-black transition-all">
                    ENLIST NOW
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FactionSelector;
