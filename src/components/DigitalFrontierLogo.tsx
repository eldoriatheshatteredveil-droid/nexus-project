import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

const DigitalFrontierLogo: React.FC = () => {
  const { isMusicPlaying } = useStore();
  const [analyzerData, setAnalyzerData] = useState<number[]>(new Array(20).fill(10));

  // Simulate audio spectrum data
  useEffect(() => {
    if (!isMusicPlaying) {
      setAnalyzerData(new Array(20).fill(10));
      return;
    }

    const interval = setInterval(() => {
      setAnalyzerData(prev => prev.map(() => Math.random() * 40 + 10));
    }, 100);

    return () => clearInterval(interval);
  }, [isMusicPlaying]);

  return (
    <div className="relative flex flex-col items-center justify-center py-10 select-none w-full overflow-hidden">
      {/* Background Elements - Cleaned up */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[120%] h-[150px] bg-gradient-to-r from-transparent via-[#00ffd5]/5 to-transparent"
          animate={{ 
            opacity: isMusicPlaying ? [0.1, 0.3, 0.1] : 0.1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-[80vw]">
        
        {/* Nexus Orb Symbol - Sharper, Tech Look */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Spectrum Analyzer around Orb */}
          {isMusicPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {analyzerData.map((height, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 bg-[#00ffd5] origin-bottom shadow-[0_0_5px_#00ffd5]"
                  style={{
                    height: `${height / 2}px`,
                    bottom: '50%',
                    left: '50%',
                    transform: `rotate(${i * (360 / 20)}deg) translateY(50px)`,
                  }}
                  animate={{ 
                    height: [`${height / 3}px`, `${height / 1.5}px`, `${height / 3}px`],
                    opacity: [0.8, 0.2, 0.8]
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />
              ))}
            </div>
          )}
          {/* Tech Ring 1 */}
          <motion.div 
            className="absolute inset-0 border border-[#00ffd5] rounded-full opacity-30"
            style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Tech Ring 2 (Counter) */}
          <motion.div 
            className="absolute inset-1 border border-[#ff66cc] rounded-full opacity-30"
            style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Central Core (The "N" / Nexus Node) */}
          <svg viewBox="0 0 24 24" className="w-12 h-12 relative z-10 drop-shadow-[0_0_5px_rgba(0,255,213,0.8)]">
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
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* Data Points */}
            <motion.circle cx="4" cy="4" r="1.5" fill="#00ffd5" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />
            <motion.circle cx="20" cy="4" r="1.5" fill="#ff66cc" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
            <motion.circle cx="12" cy="20" r="1.5" fill="#ffffff" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
          </svg>
        </div>

        {/* Text Container */}
        <div className="flex flex-col items-center justify-center">
          {/* Top Line: DIGITAL */}
          <div className="relative leading-none">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 drop-shadow-2xl z-10 relative">
              DIGITAL
            </h1>
            
            {/* Modern Chromatic Aberration */}
            {isMusicPlaying && (
              <>
                <motion.h1 
                  className="absolute top-0 left-0 text-7xl md:text-9xl font-black tracking-tighter text-[#00ffd5] mix-blend-screen opacity-60 z-0"
                  animate={{ x: [-2, 2, -1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                >
                  DIGITAL
                </motion.h1>
                <motion.h1 
                  className="absolute top-0 left-0 text-7xl md:text-9xl font-black tracking-tighter text-[#ff0055] mix-blend-screen opacity-60 z-0"
                  animate={{ x: [2, -2, 1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                >
                  DIGITAL
                </motion.h1>
              </>
            )}
          </div>

          {/* Bottom Line: FRONTIER */}
          <div className="relative mt-2">
            <h2 
              className="text-sm md:text-xl font-medium tracking-[1.5em] text-[#00ffd5] uppercase drop-shadow-[0_0_10px_rgba(0,255,213,0.5)] ml-6"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              FRONTIER
            </h2>
          </div>
        </div>
      </div>

      {/* Side Data Streams */}
      {isMusicPlaying && (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute left-4 md:left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#00ffd5]/20 to-transparent hidden md:block">
             <motion.div 
               className="w-[2px] h-40 bg-[#00ffd5] shadow-[0_0_15px_#00ffd5]" 
               animate={{ y: [-150, 600] }} 
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
             />
          </div>
          <div className="absolute right-4 md:right-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#ff66cc]/20 to-transparent hidden md:block">
             <motion.div 
               className="w-[2px] h-40 bg-[#ff66cc] shadow-[0_0_15px_#ff66cc]" 
               animate={{ y: [-150, 600] }} 
               transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 0.5 }} 
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalFrontierLogo;
