import React from 'react';
import { motion } from 'framer-motion';

const DigitalFrontierLogo: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center py-10 select-none">
      {/* Background Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[120%] h-[100px] bg-gradient-to-r from-transparent via-[#00ffd5]/10 to-transparent blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Nexus Orb Symbol */}
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          {/* Rotating Outer Ring */}
          <motion.div 
            className="absolute inset-0 border-2 border-dashed border-[#00ffd5]/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Counter-Rotating Inner Ring */}
          <motion.div 
            className="absolute inset-2 border border-[#ff66cc]/30 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Central Core (The "N" / Nexus Node) */}
          <svg viewBox="0 0 24 24" className="w-12 h-12 relative z-10 drop-shadow-neon-lg">
            <defs>
              <linearGradient id="nexusGradientDF" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ffd5" />
                <stop offset="100%" stopColor="#ff66cc" />
              </linearGradient>
            </defs>
            <motion.path
              d="M4 4 L12 20 L20 4"
              fill="none"
              stroke="url(#nexusGradientDF)"
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
          <div className="absolute inset-0 bg-[#00ffd5] blur-2xl opacity-20 animate-pulse" />
        </div>

        {/* Top Line: DIGITAL */}
        <div className="relative">
          <motion.h1 
            className="text-6xl md:text-8xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-neon"
          >
            DIGITAL
          </motion.h1>
          
          {/* Glitch Overlay for DIGITAL */}
          <motion.h1 
            className="absolute top-0 left-0 text-6xl md:text-8xl font-black tracking-tighter italic text-[#00ffd5] mix-blend-overlay opacity-50 text-glow"
            animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          >
            DIGITAL
          </motion.h1>
        </div>

        {/* Middle Line: Horizon / Separator */}
        <div className="w-full max-w-[600px] h-[2px] bg-gradient-to-r from-transparent via-[#ff66cc] to-transparent my-2 relative overflow-hidden shadow-neon-secondary">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-white"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Bottom Line: FRONTIER */}
        <div className="relative">
          <motion.h2 
            className="text-5xl md:text-7xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#00ffd5] via-white to-[#00ffd5] drop-shadow-neon"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            FRONTIER
          </motion.h2>

          {/* Reflection / Glow */}
          <div className="absolute top-full left-0 w-full h-full bg-gradient-to-b from-[#00ffd5]/20 to-transparent transform scale-y-[-0.5] blur-sm opacity-30 mask-image-gradient" />
        </div>
      </div>

      {/* Decorative Tech Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 hidden md:flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            className="w-2 h-2 bg-[#00ffd5] rounded-full shadow-neon-sm"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 hidden md:flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={i}
            className="w-2 h-2 bg-[#ff66cc] rounded-full shadow-neon-secondary"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
};

export default DigitalFrontierLogo;
