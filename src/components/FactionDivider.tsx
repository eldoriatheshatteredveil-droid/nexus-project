import React from 'react';
import { motion } from 'framer-motion';

const FactionDivider: React.FC = () => {
  return (
    <div className="relative w-full h-24 my-12 overflow-hidden flex items-center justify-center">
      {/* Central Line */}
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Syndicate Energy (Left) */}
      <motion.div 
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent to-[#ff00ff]"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          width: ["40%", "50%", "40%"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Security Energy (Right) */}
      <motion.div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-gradient-to-l from-transparent to-[#00ffd5]"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          width: ["40%", "50%", "40%"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Clash Point */}
      <div className="relative z-10 flex items-center justify-center gap-4">
        <div className="w-2 h-2 rounded-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
        <div className="px-4 py-1 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-[10px] font-mono tracking-[0.3em] text-gray-400 uppercase">
          Conflict Zone
        </div>
        <div className="w-2 h-2 rounded-full bg-[#00ffd5] shadow-[0_0_10px_#00ffd5]" />
      </div>
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff]/5 via-transparent to-[#00ffd5]/5 blur-xl" />
    </div>
  );
};

export default FactionDivider;
