import React from 'react';
import { motion } from 'framer-motion';

const NexusLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-4 group cursor-pointer select-none">
      {/* AAA Logo Container */}
      <div className="relative w-14 h-14 flex items-center justify-center perspective-1000">
        
        {/* Ambient Glow (Behind) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#00ffd5] to-[#ff66cc] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

        {/* Outer Containment Ring (Rotating) */}
        <motion.div 
          className="absolute inset-0 rounded-full border border-[#00ffd5]/20"
          style={{ borderTopColor: '#00ffd5', borderBottomColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-[2px] rounded-full border border-[#ff66cc]/20"
          style={{ borderBottomColor: '#ff66cc', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        {/* Holographic Hexagon Field */}
        <svg className="absolute inset-0 w-full h-full p-1" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffd5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff66cc" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <motion.path
            d="M50 5 L90 27 L90 73 L50 95 L10 73 L10 27 Z"
            fill="none"
            stroke="url(#hexGradient)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            animate={{ 
              strokeDashoffset: [0, 100],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              strokeDashoffset: { duration: 20, repeat: Infinity, ease: "linear" },
              opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </svg>

        {/* The Core: Fluid Energy Nexus */}
        <div className="relative z-10 w-8 h-8">
          <svg viewBox="0 0 32 32" className="w-full h-full overflow-visible">
            <defs>
              <filter id="plasmaGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="coreFlux" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffd5" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ff66cc" />
              </linearGradient>
            </defs>
            
            {/* Background Energy Field (Volumetric) */}
            <motion.path 
              d="M6 6 Q16 26 26 6"
              fill="none"
              stroke="url(#coreFlux)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#plasmaGlow)"
              opacity="0.4"
              animate={{
                d: [
                  "M6 6 Q16 28 26 6",
                  "M6 8 Q16 24 26 8",
                  "M6 6 Q16 28 26 6"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Main Energy Arc (The "V") */}
            <motion.path 
              d="M6 6 Q16 26 26 6"
              fill="none"
              stroke="url(#coreFlux)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                d: [
                  "M6 6 C10 18 12 24 16 26 C20 24 22 18 26 6",
                  "M6 6 C8 14 14 24 16 26 C18 24 24 14 26 6",
                  "M6 6 C10 18 12 24 16 26 C20 24 22 18 26 6"
                ],
                filter: ["url(#plasmaGlow)", "none", "url(#plasmaGlow)"]
              }}
              transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* High-Energy Core (White Hot) */}
            <motion.path 
              d="M6 6 Q16 26 26 6"
              fill="none"
              stroke="#fff"
              strokeWidth="1"
              strokeLinecap="round"
              animate={{
                d: [
                  "M6 6 C10 18 12 24 16 26 C20 24 22 18 26 6",
                  "M6 6 C8 14 14 24 16 26 C18 24 24 14 26 6",
                  "M6 6 C10 18 12 24 16 26 C20 24 22 18 26 6"
                ],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating Particles */}
            <motion.circle cx="16" cy="26" r="1.5" fill="#fff" 
              animate={{ y: [-2, 2, -2], opacity: [0.5, 1, 0.5] }} 
              transition={{ duration: 1, repeat: Infinity }} 
            />
          </svg>
        </div>
      </div>

      {/* Text Container - Refined Typography */}
      <div className="flex flex-col">
        <div className="relative">
          <h1 className="text-3xl font-black tracking-[0.2em] italic leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00ffd5] to-white group-hover:to-[#ff66cc] transition-all duration-500 drop-shadow-neon">
            NEXUS
          </h1>
          {/* Glitch Text Overlay */}
          <span className="absolute top-0 left-0 text-3xl font-black tracking-[0.2em] italic leading-none text-[#ff66cc] opacity-0 group-hover:opacity-50 mix-blend-screen animate-pulse translate-x-[2px] text-glow-secondary">
            NEXUS
          </span>
        </div>
        
        <div className="flex items-center gap-2 mt-1 opacity-80">
          <div className="h-[1px] w-3 bg-gradient-to-r from-[#00ffd5] to-transparent shadow-neon-sm" />
          <span className="text-[0.5rem] font-mono text-gray-400 tracking-[0.3em] uppercase group-hover:text-[#00ffd5] transition-colors duration-300 text-glow-sm">
            DIGITAL FRONTIER
          </span>
        </div>
      </div>
    </div>
  );
};

export default NexusLogo;
