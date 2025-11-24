import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { storage } from '../lib/storage';
import { Shield, Zap, Activity, Cpu, Lock, Users, Globe, Server } from 'lucide-react';
import { useCyberSound } from '../hooks/useCyberSound';
import NexusChatWidget from '../components/NexusChatWidget';

const NexusAI: React.FC = () => {
  const { faction, factionScores } = useStore();
  const { playHover, playClick, playGlitch } = useCyberSound();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [userCounts, setUserCounts] = useState({ syndicate: 0, security: 0, total: 0 });
  
  // Calculate dominance
  const totalScore = factionScores.syndicate + factionScores.security;
  const syndicatePercentage = totalScore === 0 ? 50 : (factionScores.syndicate / totalScore) * 100;
  const securityPercentage = totalScore === 0 ? 50 : (factionScores.security / totalScore) * 100;
  
  const winningFaction = 
    factionScores.syndicate > factionScores.security ? 'syndicate' :
    factionScores.security > factionScores.syndicate ? 'security' : 'neutral';

  // Dynamic Colors based on state
  const primaryColor = winningFaction === 'syndicate' ? '#ff00ff' : winningFaction === 'security' ? '#00ffd5' : '#ffffff';
  const secondaryColor = winningFaction === 'syndicate' ? '#800080' : winningFaction === 'security' ? '#0080ff' : '#888888';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Calculate user counts from storage
    const counts = storage.getFactionCounts();
    setUserCounts({
      syndicate: counts.syndicate,
      security: counts.security,
      total: counts.syndicate + counts.security
    });

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!faction) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
        <div className="text-center space-y-4">
          <Lock size={48} className="mx-auto text-gray-500" />
          <h1 className="text-2xl font-bold">ACCESS DENIED</h1>
          <p className="text-gray-400">Neural Link Required. Select a faction to access the NEXUS.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-mono select-none">
      {/* Background Grid & Atmosphere */}
      <div className="absolute inset-0 z-0">
        {/* Hex Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0' stroke='${encodeURIComponent(primaryColor)}' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${primaryColor}10 1px, transparent 1px),
              linear-gradient(to bottom, ${primaryColor}10 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        
        {/* Ambient Glow based on winner */}
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 blur-[100px]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${primaryColor}15 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        
        {/* Header Status */}
        <header className="flex justify-between items-center border-b border-white/10 pb-4 bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Activity className="animate-pulse" style={{ color: primaryColor }} />
              <div className="absolute inset-0 blur-md opacity-50" style={{ backgroundColor: primaryColor }} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-[0.2em] italic" style={{ color: primaryColor }}>
                NEXUS CORE
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-500 tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                NEURAL NETWORK STATUS: ONLINE
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 flex items-center justify-end gap-2">
              <Globe size={12} /> GLOBAL DOMINANCE
            </div>
            <div className="text-xl font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" style={{ color: primaryColor }}>
              {winningFaction === 'neutral' ? 'STABLE' : winningFaction.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Central Visualization */}
        <div className="flex-1 flex items-center justify-center relative perspective-1000">
          
          {/* The Brain / Core */}
          <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            
            {/* Outer Data Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed opacity-20"
              style={{ borderColor: primaryColor }}
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="absolute w-2 h-2 bg-white rounded-full" 
                      style={{ 
                        top: '50%', left: '50%', 
                        transform: `rotate(${i * 45}deg) translate(250px) rotate(-${i * 45}deg)` 
                      }} 
                 />
               ))}
            </motion.div>

            {/* Middle Tech Ring */}
            <motion.div
              className="absolute inset-16 rounded-full border-2 border-dashed"
              style={{ 
                borderColor: secondaryColor,
                opacity: 0.3 
              }}
              animate={{ 
                rotate: -360,
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />

            {/* Inner Fast Ring */}
            <motion.div
              className="absolute inset-32 rounded-full border border-dotted"
              style={{ borderColor: primaryColor, opacity: 0.5 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Core Sphere */}
            <motion.div 
              className="absolute inset-40 rounded-full blur-md flex items-center justify-center overflow-hidden"
              style={{ 
                background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
                boxShadow: `0 0 50px ${primaryColor}`
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/3o7qE1YN7aQfVJJ08o/giphy.gif')] opacity-20 mix-blend-overlay bg-cover" />
              <Cpu size={80} color="white" className="relative z-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </motion.div>

            {/* Connecting Nodes (Particles) */}
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={`node-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-white"
                style={{
                  left: '50%',
                  top: '50%',
                  boxShadow: `0 0 10px ${primaryColor}`
                }}
                animate={{
                  x: Math.cos(i * 22.5 * (Math.PI / 180)) * 180 + (mousePos.x * 30),
                  y: Math.sin(i * 22.5 * (Math.PI / 180)) * 180 + (mousePos.y * 30),
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
            
            {/* Data Lines connecting nodes to center */}
            <svg className="absolute inset-[-50%] w-[200%] h-[200%] pointer-events-none opacity-20">
               {[...Array(16)].map((_, i) => {
                 const angle = i * 22.5 * (Math.PI / 180);
                 const x2 = 50 + Math.cos(angle) * 18; // Approximate percentage based coords
                 const y2 = 50 + Math.sin(angle) * 18;
                 return (
                   <motion.line
                    key={`line-${i}`}
                    x1="50%" y1="50%"
                    x2={`${x2}%`} y2={`${y2}%`}
                    stroke={primaryColor}
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
                   />
                 );
               })}
            </svg>
          </div>

          {/* Faction Stats Overlay - Left (Syndicate) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80 space-y-6">
            <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 p-6 rounded-r-xl border-l-0 transform -translate-x-4 hover:translate-x-0 transition-transform duration-300 shadow-[0_0_30px_rgba(168,85,247,0.1)] group">
              <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-xl">
                <Zap size={24} className="group-hover:animate-pulse" /> SYNDICATE
              </h3>
              
              {/* Score Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>CONTROL</span>
                  <span>{syndicatePercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
                    initial={{ width: 0 }}
                    animate={{ width: `${syndicatePercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="text-right text-xs text-purple-300 font-mono">{factionScores.syndicate.toLocaleString()} PTS</div>
              </div>

              {/* Operatives Counter */}
              <div className="flex items-center justify-between border-t border-purple-500/20 pt-4">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Users size={14} /> OPERATIVES
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {userCounts.syndicate.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Faction Stats Overlay - Right (Security) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 space-y-6">
            <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 p-6 rounded-l-xl border-r-0 transform translate-x-4 hover:translate-x-0 transition-transform duration-300 shadow-[0_0_30px_rgba(6,182,212,0.1)] group text-right">
              <h3 className="text-cyan-400 font-bold mb-4 flex items-center justify-end gap-2 text-xl">
                SECURITY <Shield size={24} className="group-hover:animate-pulse" />
              </h3>
              
              {/* Score Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{securityPercentage.toFixed(1)}%</span>
                  <span>CONTROL</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] ml-auto"
                    initial={{ width: 0 }}
                    animate={{ width: `${securityPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="text-left text-xs text-cyan-300 font-mono">{factionScores.security.toLocaleString()} PTS</div>
              </div>

              {/* Operatives Counter */}
              <div className="flex items-center justify-between border-t border-cyan-500/20 pt-4">
                <div className="text-xl font-bold text-white font-mono">
                  {userCounts.security.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  OPERATIVES <Users size={14} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Data Stream */}
        <div className="h-32 border-t border-white/10 relative overflow-hidden bg-black/40 backdrop-blur-sm rounded-t-lg mx-4">
          <div className="absolute top-0 left-0 bg-[#00ffd5] text-black text-[10px] font-bold px-2 py-0.5">
            LIVE_FEED
          </div>
          <div className="relative z-10 p-4 pt-6 font-mono text-xs text-gray-500 overflow-hidden h-full">
            <motion.div
              animate={{ y: -100 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="space-y-1"
            >
              {[...Array(20)].map((_, i) => (
                <div key={i} className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  <span className="text-gray-600">{new Date().toLocaleTimeString()}</span>
                  <span style={{ color: Math.random() > 0.5 ? primaryColor : secondaryColor }}>
                    <Server size={10} className="inline mr-2" />
                    {Math.random().toString(36).substring(7).toUpperCase()} // 
                    PACKET_LOSS: {Math.floor(Math.random() * 10)}% // 
                    NODE_{Math.floor(Math.random() * 999)}: {Math.random() > 0.5 ? 'ONLINE' : 'REROUTING'}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Nexus Chat Widget - Specific to this page */}
        <NexusChatWidget />

      </div>
    </div>
  );
};

export default NexusAI;
