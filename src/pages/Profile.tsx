import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../store';
import { Shield, Crosshair, Trophy, Cpu, LogOut, Clock, User, Activity, Settings, Grid, Zap, Lock, Unlock, Edit2, Check, X, AlertTriangle, Award, Star, Hexagon, Flag, Briefcase, Users } from 'lucide-react';
import { ORBS } from '../data/orbs';
import { AVATARS, getLevelFromXP, getXPForLevel } from '../data/avatars';
import { MARKET_ITEMS } from '../data/items';
import ProceduralAvatar from '../components/ProceduralAvatar';

const Profile: React.FC = () => {
  const { user, signOut, updateUsername } = useAuth();
  const { killCount, selectedOrbId, xp, playTime, selectedAvatarId, setSelectedAvatarId, addXp, setKillCount, faction, addCredits, inventory, equipItem, unequipItem, isEquipped } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'collection' | 'inventory' | 'settings' | 'network'>('overview');
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  if (!user) return null;

  const currentLevel = getLevelFromXP(xp);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const currentLevelXP = getXPForLevel(currentLevel);
  const xpProgress = Math.min(100, Math.max(0, ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100));

  const currentOrb = ORBS.find(o => o.id === selectedOrbId) || ORBS[0];
  const unlockedOrbsCount = user.is_dev ? ORBS.length : ORBS.filter(o => killCount >= o.unlockThreshold).length;
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const getRankTitle = (level: number) => {
    if (level >= 50) return 'LEGEND';
    if (level >= 40) return 'WARLORD';
    if (level >= 30) return 'COMMANDER';
    if (level >= 20) return 'ELITE';
    if (level >= 10) return 'OPERATIVE';
    return 'INITIATE';
  };

  const handleStartEdit = () => {
    setNewName(user.username || '');
    setIsEditingName(true);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditError(null);
  };

  const handleSubmitName = () => {
    if (newName.trim().length < 3) {
      setEditError('NAME TOO SHORT');
      return;
    }
    if (killCount < 50) {
      setEditError('INSUFFICIENT FUNDS (50 REQ)');
      return;
    }
    
    setKillCount(killCount - 50);
    updateUsername(newName.trim());
    setIsEditingName(false);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`relative px-6 py-3 flex items-center gap-2 transition-all duration-300 ${
        activeTab === id ? 'text-[#00ffd5]' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      <Icon size={16} />
      <span className="font-orbitron text-sm tracking-wider">{label}</span>
      {activeTab === id && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ffd5] shadow-[0_0_10px_#00ffd5]"
        />
      )}
    </button>
  );

  return (
    <div className="min-h-screen px-4 md:px-8 max-w-7xl mx-auto pb-20">
      
      {/* Hero Section with Cover Image */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mb-8 rounded-2xl overflow-hidden border border-[#00ffd5]/20 bg-black/40 backdrop-blur-xl group"
      >
        {/* Cover Image */}
        <div 
          className="absolute inset-0 h-48 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-700"
          style={{
            backgroundImage: `url('${
              faction === 'security' 
                ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
                : faction === 'syndicate'
                  ? 'https://images.unsplash.com/photo-1625806786037-2af69df42ea2?q=80&w=1974&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=2076&auto=format&fit=crop'
            }')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />

        <div className="relative z-10 pt-32 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-8">
          {/* Avatar */}
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-2xl border-2 border-[#00ffd5] p-1 relative overflow-hidden bg-black shadow-[0_0_30px_rgba(0,255,213,0.2)] group-hover/avatar:shadow-[0_0_50px_rgba(0,255,213,0.4)] transition-shadow duration-500 flex items-center justify-center">
              {(() => {
                const selectedAvatar = AVATARS.find(a => a.id === selectedAvatarId);
                // Use selected avatar level, or current user level if no avatar selected (or fallback to 1)
                const level = selectedAvatar ? selectedAvatar.minLevel : Math.max(1, currentLevel);
                return <ProceduralAvatar level={level} size={120} />;
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-[#00ffd5]/20 to-transparent opacity-50 pointer-events-none" />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-black border border-[#00ffd5] text-[#00ffd5] text-xs font-bold px-3 py-1 rounded-lg font-orbitron shadow-[0_0_10px_rgba(0,255,213,0.3)] flex items-center gap-1">
              <Shield size={10} />
              LVL {currentLevel}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              {isEditingName ? (
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-black/50 border border-[#00ffd5] text-white font-orbitron text-2xl px-3 py-1 rounded focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,213,0.3)] w-64"
                      autoFocus
                    />
                    <button 
                      onClick={handleSubmitName}
                      className="p-2 bg-[#00ffd5]/20 text-[#00ffd5] rounded hover:bg-[#00ffd5]/40 transition-colors"
                    >
                      <Check size={20} />
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#ff66cc]">COST: 50 KILLS</span>
                    {editError && (
                      <span className="text-red-400 flex items-center gap-1">
                        <AlertTriangle size={10} /> {editError}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 group/edit">
                  <h1 className="text-4xl font-bold text-white font-orbitron tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{user.username}</h1>
                  <button 
                    onClick={handleStartEdit}
                    className="opacity-0 group-hover/edit:opacity-100 transition-opacity text-gray-500 hover:text-[#00ffd5]"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              )}

              {user.is_dev && (
                <span className="bg-[#ff66cc]/20 border border-[#ff66cc] text-[#ff66cc] text-[10px] px-2 py-0.5 rounded font-mono self-center shadow-[0_0_10px_rgba(255,102,204,0.3)]">DEV</span>
              )}
              {user.is_tester && (
                <span className="bg-orange-500/20 border border-orange-500 text-orange-500 text-[10px] px-2 py-0.5 rounded font-mono self-center shadow-[0_0_10px_rgba(249,115,22,0.3)]">TESTER</span>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-mono text-gray-400">
              <span className="text-[#00ffd5] flex items-center gap-1">
                <Hexagon size={12} className="fill-[#00ffd5]/20" />
                {getRankTitle(currentLevel)}
              </span>
              <span className="text-gray-600">|</span>
              <span>ID: {user.id.slice(0, 8).toUpperCase()}</span>
              {faction && (
                <>
                  <span className="text-gray-600">|</span>
                  <span className={`flex items-center gap-1 font-bold ${faction === 'syndicate' ? 'text-[#ff0055]' : 'text-[#0088ff]'}`}>
                    <Flag size={12} />
                    {faction.toUpperCase()}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-8 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 font-mono mb-1 tracking-wider">PLAYTIME</div>
              <div className="text-xl font-bold text-white font-orbitron flex items-center gap-2 justify-center">
                <Clock size={16} className="text-[#00ffd5]" />
                {formatTime(playTime)}
              </div>
            </div>
            <div className="w-[1px] bg-white/10" />
            <div className="text-center">
              <div className="text-[10px] text-gray-500 font-mono mb-1 tracking-wider">TOTAL XP</div>
              <div className="text-xl font-bold text-white font-orbitron flex items-center gap-2 justify-center">
                <Star size={16} className="text-[#ff66cc]" />
                {Math.floor(xp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-t border-white/5 bg-black/20 px-8 overflow-x-auto">
          <TabButton id="overview" label="OVERVIEW" icon={Activity} />
          <TabButton id="collection" label="COLLECTION" icon={Grid} />
          <TabButton id="inventory" label="INVENTORY" icon={Briefcase} />
          <TabButton id="settings" label="SYSTEM" icon={Settings} />
          {user.is_dev && <TabButton id="network" label="NETWORK" icon={Users} />}
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Main Stats Card */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/40 border border-gray-800 p-6 rounded-xl backdrop-blur-sm hover:border-[#ff66cc]/50 transition-colors group relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Crosshair size={100} />
                  </div>
                  <div className="flex items-center gap-3 mb-2 text-[#ff66cc]">
                    <Crosshair size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="font-mono text-xs tracking-wider">KILLS</span>
                  </div>
                  <div className="text-3xl font-bold text-white font-orbitron">{killCount.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 mt-2 font-mono">TOTAL THREATS NEUTRALIZED</div>
                </div>

                <div className="bg-black/40 border border-gray-800 p-6 rounded-xl backdrop-blur-sm hover:border-[#00ffd5]/50 transition-colors group relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Trophy size={100} />
                  </div>
                  <div className="flex items-center gap-3 mb-2 text-[#00ffd5]">
                    <Trophy size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-xs tracking-wider">UNLOCKS</span>
                  </div>
                  <div className="text-3xl font-bold text-white font-orbitron">
                    {unlockedOrbsCount} <span className="text-lg text-gray-600">/ {ORBS.length}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 font-mono">ARMORY PROGRESS</div>
                </div>

                <div className="bg-black/40 border border-gray-800 p-6 rounded-xl backdrop-blur-sm hover:border-yellow-400/50 transition-colors group relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap size={100} />
                  </div>
                  <div className="flex items-center gap-3 mb-2 text-yellow-400">
                    <Zap size={20} className="group-hover:animate-pulse" />
                    <span className="font-mono text-xs tracking-wider">SYSTEM</span>
                  </div>
                  <div className="text-lg font-bold text-white truncate font-orbitron pt-1">{currentOrb.name}</div>
                  <div className="text-[10px] text-gray-500 mt-3 font-mono">ACTIVE TARGETING MODULE</div>
                </div>
              </div>

              {/* Level Progress Detail */}
              <div className="bg-black/40 border border-gray-800 p-8 rounded-xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <Shield size={120} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-white font-bold text-lg font-orbitron flex items-center gap-2">
                        LEVEL PROGRESSION
                      </h3>
                      <p className="text-gray-500 text-xs font-mono mt-1">NEXT RANK: {getRankTitle(currentLevel + 1)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[#00ffd5] font-bold text-2xl font-orbitron">{Math.round(xpProgress)}%</span>
                    </div>
                  </div>

                  <div className="h-6 bg-gray-900/50 rounded-full overflow-hidden border border-gray-700 relative backdrop-blur-sm shadow-inner">
                    {/* Grid lines on bar */}
                    <div className="absolute inset-0 flex justify-between px-2 z-20">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-[1px] h-full bg-black/20" />
                      ))}
                    </div>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#00ffd5] via-[#00ffd5] to-[#ff66cc] relative z-10"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:10px_10px] animate-[move_1s_linear_infinite]" />
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]" />
                    </motion.div>
                  </div>

                  <div className="mt-4 flex justify-between text-xs font-mono text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#00ffd5] rounded-full shadow-[0_0_5px_#00ffd5]" />
                      CURRENT: {Math.floor(xp).toLocaleString()} XP
                    </div>
                    <div className="flex items-center gap-2">
                      TARGET: {Math.floor(nextLevelXP).toLocaleString()} XP
                      <span className="w-2 h-2 bg-gray-700 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements / Badges Section */}
              <div className="bg-black/40 border border-gray-800 p-6 rounded-xl backdrop-blur-sm">
                <h3 className="text-white font-bold font-orbitron mb-4 flex items-center gap-2 text-sm">
                  <Award size={16} className="text-[#ff66cc]" />
                  ACHIEVEMENTS
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: 'First Blood', desc: 'Get your first kill', unlocked: killCount > 0, icon: Crosshair },
                    { name: 'Veteran', desc: 'Reach Level 10', unlocked: currentLevel >= 10, icon: Shield },
                    { name: 'Collector', desc: 'Unlock 5 items', unlocked: unlockedOrbsCount >= 5, icon: Grid },
                    { name: 'Legend', desc: 'Reach Level 50', unlocked: currentLevel >= 50, icon: Star },
                  ].map((badge, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${badge.unlocked ? 'border-[#00ffd5]/30 bg-[#00ffd5]/5' : 'border-gray-800 bg-black/20 opacity-50'} flex flex-col items-center text-center gap-2`}>
                      <div className={`p-2 rounded-full ${badge.unlocked ? 'bg-[#00ffd5]/20 text-[#00ffd5]' : 'bg-gray-800 text-gray-600'}`}>
                        <badge.icon size={16} />
                      </div>
                      <div>
                        <div className={`text-xs font-bold font-orbitron ${badge.unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.name}</div>
                        <div className="text-[9px] text-gray-500 font-mono mt-1">{badge.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Recent Activity Mockup */}
              <div className="bg-black/40 border border-gray-800 rounded-xl p-6 backdrop-blur-sm h-full">
                <h3 className="text-white font-bold font-orbitron mb-4 flex items-center gap-2 text-sm">
                  <Activity size={16} className="text-[#00ffd5]" />
                  SYSTEM LOGS
                </h3>
                <div className="space-y-4 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gray-800" />
                  
                  {[
                    { text: 'System initialization complete', time: 'Just now', color: 'text-gray-400' },
                    { text: `User ${user.username} authenticated`, time: '2m ago', color: 'text-[#00ffd5]' },
                    { text: 'Combat protocols engaged', time: '5m ago', color: 'text-[#ff66cc]' },
                    { text: 'Profile data synchronized', time: '1h ago', color: 'text-gray-400' },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 relative z-10">
                      <div className={`w-4 h-4 rounded-full border-2 border-black ${i === 0 ? 'bg-[#00ffd5]' : 'bg-gray-800'} mt-0.5 flex-shrink-0`} />
                      <div>
                        <p className={`text-xs font-mono ${log.color}`}>{log.text}</p>
                        <p className="text-[10px] text-gray-600 font-mono mt-0.5">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'collection' && (
          <motion.div
            key="collection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* AVATARS SECTION */}
            <div className="bg-black/40 border border-gray-800 p-6 rounded-xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold font-orbitron flex items-center gap-2">
                  <User size={20} className="text-[#00ffd5]" />
                  NEURAL INTERFACE (AVATARS)
                </h3>
                <div className="text-xs font-mono text-gray-500">
                  {AVATARS.filter(a => user.is_dev || currentLevel >= a.minLevel).length} / {AVATARS.length} UNLOCKED
                </div>
              </div>
              
              <div 
                className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 overscroll-contain"
                onWheel={(e) => e.stopPropagation()}
              >
                {AVATARS.map((avatar) => {
                  const isUnlocked = user.is_dev || currentLevel >= avatar.minLevel;
                  const isSelected = selectedAvatarId === avatar.id;
                  
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => isUnlocked && setSelectedAvatarId(avatar.id)}
                      disabled={!isUnlocked}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                        isSelected 
                          ? 'border-[#00ffd5] shadow-[0_0_15px_rgba(0,255,213,0.4)] scale-105 z-10' 
                          : isUnlocked 
                            ? 'border-gray-800 hover:border-gray-500 hover:scale-105 hover:z-10' 
                            : 'border-gray-900 opacity-40 grayscale cursor-not-allowed'
                      }`}
                    >
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center p-2">
                        <ProceduralAvatar level={avatar.minLevel} size={64} />
                      </div>
                      
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-1 z-20">
                          <Lock size={12} className="text-gray-600" />
                          <span className="text-[8px] font-bold text-gray-600 font-mono">LVL {avatar.minLevel}</span>
                        </div>
                      )}
                      
                      {isUnlocked && !isSelected && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-20" />
                      )}

                      {/* Rarity Indicator */}
                      <div className={`absolute top-0 right-0 w-2 h-2 rounded-bl-lg z-20 ${
                        avatar.rarity === 'legendary' ? 'bg-yellow-400' :
                        avatar.rarity === 'epic' ? 'bg-[#ff66cc]' :
                        avatar.rarity === 'rare' ? 'bg-[#00ffd5]' :
                        avatar.rarity === 'uncommon' ? 'bg-blue-400' : 'bg-gray-600'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ORBS SECTION */}
            <div className="bg-black/40 border border-gray-800 p-6 rounded-xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold font-orbitron flex items-center gap-2">
                  <Crosshair size={20} className="text-[#ff66cc]" />
                  TARGETING SYSTEMS (CURSORS)
                </h3>
                <div className="text-xs font-mono text-gray-500">
                  {unlockedOrbsCount} / {ORBS.length} UNLOCKED
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ORBS.map((orb) => {
                  const isUnlocked = user.is_dev || killCount >= orb.unlockThreshold;
                  const isSelected = selectedOrbId === orb.id;
                  const OrbComponent = orb.component;

                  return (
                    <button
                      key={orb.id}
                      onClick={() => isUnlocked && useStore.getState().setSelectedOrbId(orb.id)}
                      disabled={!isUnlocked}
                      className={`relative p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 text-left group ${
                        isSelected 
                          ? 'border-[#ff66cc] bg-[#ff66cc]/5 shadow-[0_0_15px_rgba(255,102,204,0.2)]' 
                          : isUnlocked 
                            ? 'border-gray-800 bg-black/20 hover:border-gray-600 hover:bg-black/40' 
                            : 'border-gray-900 bg-black/10 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Orb Preview */}
                      <div className="w-12 h-12 rounded-lg bg-black border border-gray-800 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                        {isUnlocked ? (
                          <div className="relative w-full h-full flex items-center justify-center scale-75">
                            <OrbComponent />
                          </div>
                        ) : (
                          <Lock size={16} className="text-gray-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-bold font-orbitron text-sm truncate ${isSelected ? 'text-[#ff66cc]' : 'text-white'}`}>
                            {orb.name}
                          </h4>
                          {!isUnlocked && (
                            <span className="text-[9px] font-mono text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 whitespace-nowrap ml-2">
                              {orb.unlockThreshold.toLocaleString()} KILLS
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono truncate mt-1">{orb.description}</p>
                        
                        {/* Stats Mini-Bars */}
                        {isUnlocked && (
                          <div className="flex gap-2 mt-2">
                            <div className="flex flex-col gap-0.5 flex-1">
                              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#00ffd5]" style={{ width: `${orb.stats.precision}%` }} />
                              </div>
                            </div>
                            <div className="flex flex-col gap-0.5 flex-1">
                              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#ff66cc]" style={{ width: `${orb.stats.speed}%` }} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-[#ff66cc] rounded-full shadow-[0_0_5px_#ff66cc] animate-pulse" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {inventory && inventory.length > 0 ? (
              MARKET_ITEMS.filter(item => inventory.includes(item.id)).map(item => {
                const equipped = isEquipped(item.id);
                return (
                  <div key={item.id} className={`bg-black/40 border p-6 rounded-xl backdrop-blur-sm transition-all ${equipped ? 'border-[#00ffd5] shadow-[0_0_15px_rgba(0,255,213,0.2)]' : 'border-gray-800 hover:border-gray-600'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${
                        item.rarity === 'legendary' ? 'bg-yellow-500/10 text-yellow-500' :
                        item.rarity === 'illegal' ? 'bg-red-500/10 text-red-500' :
                        'bg-[#00ffd5]/10 text-[#00ffd5]'
                      }`}>
                        {/* We don't have the getIcon helper here easily, so just use a generic icon or import icons */}
                        <Briefcase size={24} />
                      </div>
                      {equipped && (
                        <span className="text-[10px] font-bold bg-[#00ffd5]/20 text-[#00ffd5] px-2 py-1 rounded border border-[#00ffd5]/30 animate-pulse">ACTIVE</span>
                      )}
                    </div>

                    <h3 className="font-bold text-white font-orbitron mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mb-4 h-8">{item.description}</p>

                    <button
                      onClick={() => equipped ? unequipItem(item.id) : equipItem(item.id)}
                      className={`w-full py-2 rounded font-bold text-xs tracking-wider transition-all ${
                        equipped 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20' 
                          : 'bg-[#00ffd5]/10 text-[#00ffd5] border border-[#00ffd5]/30 hover:bg-[#00ffd5]/20'
                      }`}
                    >
                      {equipped ? 'UNEQUIP' : 'EQUIP MODULE'}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <Briefcase size={48} className="mb-4 opacity-20" />
                <p className="font-orbitron text-lg">INVENTORY EMPTY</p>
                <p className="font-mono text-xs mt-2">VISIT THE BLACK MARKET TO ACQUIRE ASSETS</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-black/40 border border-gray-800 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-white font-bold font-orbitron mb-6 flex items-center gap-2">
                <Settings size={20} className="text-[#00ffd5]" />
                ACCOUNT SETTINGS
              </h3
              >
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-black/30 rounded-lg border border-gray-800">
                  <div>
                    <div className="text-sm font-bold text-white">Email Address</div>
                    <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                  </div>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">VERIFIED</span>
                </div>

                <button 
                  onClick={signOut}
                  className="w-full py-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-bold tracking-wider"
                >
                  <LogOut size={16} />
                  DISCONNECT FROM NEURAL LINK
                </button>
              </div>
            </div>

            {/* DEV / TESTER CONSOLE */}
            {(user.is_dev || user.is_tester) && (
              <div className={`bg-black/40 border rounded-xl p-6 backdrop-blur-sm relative overflow-hidden ${user.is_dev ? 'border-[#ff66cc]/30' : 'border-orange-500/30'}`}>
                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl ${user.is_dev ? 'bg-[#ff66cc]/10' : 'bg-orange-500/10'}`} />
                
                <h3 className={`font-bold font-orbitron mb-6 flex items-center gap-2 relative z-10 ${user.is_dev ? 'text-[#ff66cc]' : 'text-orange-500'}`}>
                  <Cpu size={20} /> {user.is_dev ? 'DEVELOPER OVERRIDE' : 'TESTER OVERRIDE'}
                </h3>
                
                <div className="space-y-3 relative z-10">
                  <button 
                    onClick={() => addXp(1000000)}
                    className={`w-full py-3 border rounded text-xs font-mono flex items-center justify-between px-4 group ${user.is_dev ? 'bg-[#ff66cc]/10 border-[#ff66cc]/30 text-[#ff66cc] hover:bg-[#ff66cc]/20' : 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20'}`}
                  >
                    <span>GRANT 1,000,000 XP</span>
                    <Unlock size={14} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setKillCount(killCount + 1000)}
                    className={`w-full py-3 border rounded text-xs font-mono flex items-center justify-between px-4 group ${user.is_dev ? 'bg-[#ff66cc]/10 border-[#ff66cc]/30 text-[#ff66cc] hover:bg-[#ff66cc]/20' : 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20'}`}
                  >
                    <span>GRANT 1,000 KILLS</span>
                    <Crosshair size={14} className="group-hover:rotate-90 transition-transform" />
                  </button>
                  <button 
                    onClick={() => addCredits(999999999)}
                    className={`w-full py-3 border rounded text-xs font-mono flex items-center justify-between px-4 group ${user.is_dev ? 'bg-[#ff66cc]/10 border-[#ff66cc]/30 text-[#ff66cc] hover:bg-[#ff66cc]/20' : 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20'}`}
                  >
                    <span>GRANT INFINITE CREDITS</span>
                    <Zap size={14} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <div className={`text-[10px] font-mono mt-4 text-center border-t pt-4 ${user.is_dev ? 'text-[#ff66cc]/60 border-[#ff66cc]/20' : 'text-orange-500/60 border-orange-500/20'}`}>
                    {user.is_dev ? 'WARNING: DIRECT MEMORY MANIPULATION DETECTED' : 'TEST MODE: STATS WILL PERSIST'}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'network' && user.is_dev && (
          <motion.div
            key="network"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-black/40 border border-[#ff66cc]/30 p-6 rounded-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl bg-[#ff66cc]/10" />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-white font-bold font-orbitron flex items-center gap-2">
                  <Users size={20} className="text-[#ff66cc]" />
                  ACTIVE NEURAL LINKS
                </h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-green-500">LIVE MONITORING</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {(() => {
                  // Fetch all users from local storage
                  const registeredUsers = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
                  const devSession = localStorage.getItem('nexus_dev_session');
                  
                  let allUsers = [...registeredUsers];
                  if (devSession) {
                    const devUser = JSON.parse(devSession);
                    // Avoid duplicates if dev is also in registered list (unlikely but possible)
                    if (!allUsers.find((u: any) => u.id === devUser.id)) {
                      allUsers.push(devUser);
                    }
                  }

                  // Filter for "online" users (active in last 5 minutes)
                  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                  const onlineUsers = allUsers.filter((u: any) => {
                    if (!u.last_seen) return false; // No timestamp = offline
                    return new Date(u.last_seen) > fiveMinutesAgo;
                  });

                  if (onlineUsers.length === 0) {
                    return (
                      <div className="col-span-full text-center py-12 text-gray-500 font-mono">
                        NO ACTIVE SIGNALS DETECTED
                      </div>
                    );
                  }

                  return onlineUsers.map((u: any) => (
                    <div key={u.id} className="bg-black/60 border border-gray-800 p-4 rounded-lg flex items-center gap-4 hover:border-[#ff66cc]/50 transition-colors group">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden border border-gray-700 group-hover:border-[#ff66cc] transition-colors">
                          <img 
                            src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} 
                            alt={u.username}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-white font-orbitron truncate">{u.username}</h4>
                          {u.is_dev && <span className="text-[9px] bg-[#ff66cc]/20 text-[#ff66cc] px-1 rounded border border-[#ff66cc]/30">DEV</span>}
                        </div>
                        <div className="text-xs text-gray-500 font-mono truncate">{u.email}</div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-gray-400">
                          <span>ID: {u.id.toString().slice(0, 6)}</span>
                          <span className="text-gray-600">|</span>
                          <span className="text-green-400">ONLINE</span>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
