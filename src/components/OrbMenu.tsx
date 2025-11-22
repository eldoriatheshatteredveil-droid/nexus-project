import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { ORBS } from '../data/orbs';
import { Lock, ChevronLeft, ChevronRight, Crosshair, Shield, Zap, MousePointer2, AlertTriangle } from 'lucide-react';

const OrbMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { killCount, selectedOrbId, setSelectedOrbId } = useStore();
  const { user } = useAuth();
  const [previewOrbId, setPreviewOrbId] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setPreviewOrbId(selectedOrbId);
  };

  const activeOrbId = previewOrbId || selectedOrbId;
  const activeOrb = ORBS.find(o => o.id === activeOrbId) || ORBS[0];
  const isLocked = !user?.is_dev && killCount < activeOrb.unlockThreshold;
  const isEquipped = selectedOrbId === activeOrbId;

  // Stats for the active orb (defaulting if missing in data)
  const stats = activeOrb.stats || { precision: 50, speed: 50, stealth: 50 };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className={`fixed left-0 top-64 z-50 bg-black/80 border-r border-t border-b border-[#00ffd5] py-6 pr-1 pl-2 rounded-r-xl text-[#00ffd5] hover:bg-[#00ffd5]/20 transition-colors backdrop-blur-md flex flex-col items-center gap-4 ${isOpen ? 'shadow-[5px_0_15px_rgba(0,255,213,0.5)]' : ''}`}
        onClick={toggleMenu}
        initial={false}
        animate={{ x: isOpen ? 800 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        <span className="text-[10px] font-orbitron font-bold tracking-widest [writing-mode:vertical-rl] rotate-180">
          ARMORY
        </span>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Main Panel */}
      <motion.div
        className="fixed left-0 top-0 bottom-0 w-full md:w-[800px] bg-[#0a0a0a] border-r border-[#00ffd5]/30 z-50 flex shadow-[5px_0_30px_rgba(0,255,213,0.3)]"
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00ffd51a_1px,transparent_1px),linear-gradient(to_bottom,#00ffd51a_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Left Column: Grid */}
        <div className="w-1/2 border-r border-[#00ffd5]/20 flex flex-col bg-black/40 backdrop-blur-xl relative z-10">
          <div className="p-6 border-b border-[#00ffd5]/20 bg-black/60">
            <h2 className="text-2xl font-bold text-[#00ffd5] font-orbitron flex items-center gap-3">
              <Crosshair className="animate-spin-slow" />
              CURSOR ARMORY
            </h2>
            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-gray-400">
              <span>TOTAL UNITS: {ORBS.length}</span>
              <span className="text-[#00ffd5]">UNLOCKED: {user?.is_dev ? ORBS.length : ORBS.filter(o => killCount >= o.unlockThreshold).length}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="grid grid-cols-3 gap-3">
              {ORBS.map((orb) => {
                const locked = !user?.is_dev && killCount < orb.unlockThreshold;
                const selected = activeOrbId === orb.id;
                const equipped = selectedOrbId === orb.id;

                return (
                  <button
                    key={orb.id}
                    onClick={() => setPreviewOrbId(orb.id)}
                    className={`
                      relative aspect-square rounded-lg border flex flex-col items-center justify-center gap-2 transition-all duration-200 group
                      ${selected 
                        ? 'border-[#00ffd5] bg-[#00ffd5]/10 shadow-[0_0_15px_rgba(0,255,213,0.2)]' 
                        : 'border-gray-800 bg-gray-900/40 hover:border-gray-600 hover:bg-gray-800'}
                    `}
                  >
                    <div className="scale-75 pointer-events-none">
                      {locked ? <Lock className="text-gray-600" /> : <orb.component />}
                    </div>
                    
                    {equipped && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-[#00ffd5] rounded-full shadow-[0_0_5px_#00ffd5]" />
                    )}
                    
                    {locked && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                        <Lock size={16} className="text-gray-500" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Stats */}
        <div className="w-1/2 flex flex-col relative z-10 bg-gradient-to-b from-black/80 to-black/95">
          {/* Preview Area */}
          <div className="h-1/2 relative flex items-center justify-center border-b border-[#00ffd5]/20 overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,213,0.1)_0%,transparent_70%)]" />
            
            {/* Crosshair Lines */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-full h-[1px] bg-[#00ffd5]" />
              <div className="h-full w-[1px] bg-[#00ffd5] absolute" />
              <div className="w-64 h-64 border border-[#00ffd5] rounded-full absolute animate-[ping_3s_linear_infinite]" />
            </div>

            <div className="scale-[3] relative z-20 filter drop-shadow-[0_0_20px_rgba(0,255,213,0.3)]">
              {isLocked ? <Lock className="text-gray-600" /> : <activeOrb.component />}
            </div>

            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#00ffd5] opacity-50">
              PREVIEW_MODE_ACTIVE
            </div>
          </div>

          {/* Stats Area */}
          <div className="flex-1 p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-white font-orbitron mb-1">{activeOrb.name}</h3>
              <p className="text-gray-400 text-sm font-mono">{activeOrb.description}</p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Stat Bars */}
              {[
                { label: 'PRECISION', value: stats.precision, icon: Crosshair, color: 'bg-[#00ffd5]', shadow: 'shadow-neon' },
                { label: 'SPEED', value: stats.speed, icon: Zap, color: 'bg-[#ff66cc]', shadow: 'shadow-neon-secondary' },
                { label: 'STEALTH', value: stats.stealth, icon: Shield, color: 'bg-yellow-400', shadow: 'shadow-[0_0_10px_rgba(250,204,21,0.5)]' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs font-bold mb-2 text-gray-400 font-mono">
                    <span className="flex items-center gap-2">
                      <stat.icon size={12} /> {stat.label}
                    </span>
                    <span>{stat.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full ${stat.color} ${stat.shadow}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {isLocked ? (
                <div className="w-full py-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center gap-3 text-red-400 font-mono text-sm">
                  <Lock size={16} />
                  <span>LOCKED - REQUIRES {activeOrb.unlockThreshold} KILLS</span>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedOrbId(activeOrb.id)}
                  disabled={isEquipped}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg tracking-wider transition-all flex items-center justify-center gap-3
                    ${isEquipped 
                      ? 'bg-[#00ffd5]/20 text-[#00ffd5] border border-[#00ffd5]/50 cursor-default shadow-neon-sm' 
                      : 'bg-[#00ffd5] text-black hover:bg-white hover:shadow-neon'}
                  `}
                >
                  {isEquipped ? (
                    <>
                      <div className="w-2 h-2 bg-[#00ffd5] rounded-full animate-pulse" />
                      EQUIPPED
                    </>
                  ) : (
                    <>
                      <MousePointer2 size={20} />
                      EQUIP MODULE
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default OrbMenu;
