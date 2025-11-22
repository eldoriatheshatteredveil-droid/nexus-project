import React from 'react';
import { motion } from 'framer-motion';

const NexusLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* Graphic Symbol */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Rotating Outer Ring */}
        <motion.div 
          className="absolute inset-0 border-2 border-dashed border-[#00ffd5]/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Counter-Rotating Inner Ring */}
        <motion.div 
          className="absolute inset-1 border border-[#ff66cc]/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Central Core (The "N" / Nexus Node) */}
        <svg viewBox="0 0 24 24" className="w-8 h-8 relative z-10 drop-shadow-neon">
          <defs>
            <linearGradient id="nexusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffd5" />
              <stop offset="100%" stopColor="#ff66cc" />
            </linearGradient>
          </defs>
          <motion.path
            d="M4 4 L12 20 L20 4"
            fill="none"
            stroke="url(#nexusGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.circle 
            cx="4" cy="4" r="2" 
            fill="#00ffd5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle 
            cx="20" cy="4" r="2" 
            fill="#ff66cc"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.circle 
            cx="12" cy="20" r="2" 
            fill="#ffffff"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </svg>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[#00ffd5] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      </div>

      {/* Text Container */}
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
            NVIOUS SYSTEMS
          </span>
        </div>
      </div>
    </div>
  );
};

export default NexusLogo;
