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
        {/* Background glow removed */}
      </div>

      {/* Main Logo Container */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-[80vw]">
        
        {/* Nexus Orb Symbol - Sharper, Tech Look */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Liquid Electric Effect (Music Visualizer Replacement) */}
          {isMusicPlaying && (
            <div className="absolute inset-[-20px] flex items-center justify-center pointer-events-none z-0">
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <defs>
                  <filter id="liquidGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ffd5" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#ff66cc" />
                  </linearGradient>
                </defs>
                
                {/* Outer Liquid Ring */}
                <motion.path
                  fill="none"
                  stroke="url(#electricGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter="url(#liquidGlow)"
                  animate={{
                    d: [
                      "M50 10 C75 10 90 25 90 50 C90 75 75 90 50 90 C25 90 10 75 10 50 C10 25 25 10 50 10 Z",
                      "M50 5 C80 15 95 20 95 50 C95 80 80 85 50 95 C20 85 5 80 5 50 C5 20 20 15 50 5 Z",
                      "M50 15 C70 5 85 30 85 50 C85 70 70 95 50 85 C30 95 15 70 15 50 C15 30 30 5 50 15 Z",
                      "M50 10 C75 10 90 25 90 50 C90 75 75 90 50 90 C25 90 10 75 10 50 C10 25 25 10 50 10 Z"
                    ],
                    rotate: [0, 360],
                    strokeWidth: [2, 4, 2]
                  }}
                  transition={{
                    d: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    strokeWidth: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                
                {/* Inner Rapid Electric Arcs */}
                <motion.path
                  fill="none"
                  stroke="#00ffd5"
                  strokeWidth="1"
                  filter="url(#liquidGlow)"
                  animate={{
                    d: [
                      "M50 20 C65 20 80 35 80 50 C80 65 65 80 50 80 C35 80 20 65 20 50 C20 35 35 20 50 20 Z",
                      "M50 18 C68 22 82 32 82 50 C82 68 68 78 50 82 C32 78 18 68 18 50 C18 32 32 22 50 18 Z",
                      "M50 22 C62 18 78 38 78 50 C78 62 62 82 50 78 C38 82 22 62 22 50 C22 38 38 18 50 22 Z"
                    ],
                    rotate: [360, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    d: { duration: 0.5, repeat: Infinity, ease: "linear" },
                    rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 0.2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </svg>
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

          {/* Central Core (The "N" / Nexus Node) - AAA Redesign */}
          <svg viewBox="0 0 32 32" className="w-16 h-16 relative z-10 overflow-visible">
            <defs>
              <filter id="plasmaGlowDF">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="coreFluxDF" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffd5" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ff66cc" />
              </linearGradient>
            </defs>
            
            {/* Background Energy Field (Volumetric) */}
            <motion.path 
              d="M6 6 Q16 26 26 6"
              fill="none"
              stroke="url(#coreFluxDF)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#plasmaGlowDF)"
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
              stroke="url(#coreFluxDF)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                d: [
                  "M6 6 C10 18 12 24 16 26 C20 24 22 18 26 6",
                  "M6 6 C8 14 14 24 16 26 C18 24 24 14 26 6",
                  "M6 6 C10 18 12 24 16 26 C20 24 22 18 26 6"
                ],
                filter: ["url(#plasmaGlowDF)", "none", "url(#plasmaGlowDF)"]
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
