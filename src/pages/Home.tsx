import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import Storefront from '../components/Storefront';
import DigitalFrontierLogo from '../components/DigitalFrontierLogo';
import SystemStatus from '../components/SystemStatus';

const EqualizerBorder: React.FC = () => {
  const isMusicPlaying = useStore((state) => state.isMusicPlaying);
  const bars = Array.from({ length: 30 }); // Number of bars

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {/* Top Equalizer */}
      <div className="absolute -top-6 left-0 right-0 h-6 flex justify-center items-end gap-[2px] opacity-70">
        {bars.map((_, i) => (
          <motion.div
            key={`top-${i}`}
            className="w-1.5 bg-[#00ffd5] rounded-t-sm shadow-[0_0_5px_#00ffd5]"
            animate={isMusicPlaying ? {
              height: [4, Math.random() * 20 + 4, Math.random() * 10 + 4],
              opacity: [0.4, 1, 0.4]
            } : { height: 2, opacity: 0.1 }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.02,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Bottom Equalizer */}
      <div className="absolute -bottom-6 left-0 right-0 h-6 flex justify-center items-start gap-[2px] opacity-70">
        {bars.map((_, i) => (
          <motion.div
            key={`bottom-${i}`}
            className="w-1.5 bg-[#ff66cc] rounded-b-sm shadow-[0_0_5px_#ff66cc]"
            animate={isMusicPlaying ? {
              height: [4, Math.random() * 20 + 4, Math.random() * 10 + 4],
              opacity: [0.4, 1, 0.4]
            } : { height: 2, opacity: 0.1 }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.03, // Different delay for variety
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Left Side Equalizer (Vertical) */}
      <div className="absolute top-0 -left-6 bottom-0 w-6 flex flex-col justify-center items-end gap-[2px] opacity-50 hidden md:flex">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`left-${i}`}
            className="h-1.5 bg-[#00ffd5] rounded-l-sm"
            animate={isMusicPlaying ? {
              width: [4, Math.random() * 16 + 4, 4],
              opacity: [0.3, 0.8, 0.3]
            } : { width: 2, opacity: 0.1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Right Side Equalizer (Vertical) */}
      <div className="absolute top-0 -right-6 bottom-0 w-6 flex flex-col justify-center items-start gap-[2px] opacity-50 hidden md:flex">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`right-${i}`}
            className="h-1.5 bg-[#ff66cc] rounded-r-sm"
            animate={isMusicPlaying ? {
              width: [4, Math.random() * 16 + 4, 4],
              opacity: [0.3, 0.8, 0.3]
            } : { width: 2, opacity: 0.1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="bg-background text-white min-h-screen">
      <div>
        <section id="browse" className="py-8 relative">
          {/* Background Artwork for Header */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] -z-10 overflow-hidden pointer-events-none">
            {/* Gradient Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary opacity-[0.03] blur-[120px] rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary opacity-[0.03] blur-[100px] rounded-full mix-blend-screen translate-x-10" />
            
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            
            {/* Cyber Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] border border-primary/10 rounded-[100%] animate-[spin_20s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] border border-secondary/10 rounded-[100%] animate-[spin_25s_linear_infinite_reverse]" />
            
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-16 flex flex-col items-center text-center relative">
              {/* Decorative brackets */}
              <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden lg:block">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary" />
              </div>
              <div className="absolute -right-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-secondary/30 to-transparent hidden lg:block">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary" />
              </div>

              <div className="mb-8">
                <DigitalFrontierLogo />
              </div>
              
              <div className="relative p-6 border border-primary/30 rounded-lg bg-black/40 backdrop-blur-sm max-w-3xl mx-auto shadow-[0_0_15px_rgba(0,255,213,0.1)] group hover:border-primary/60 transition-colors duration-300">
                <EqualizerBorder />
                {/* Corner accents */}
                <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-primary" />
                <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-primary" />
                <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-primary" />
                <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-primary" />

                <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide leading-relaxed">
                  <span className="text-primary font-bold">JACK IN.</span> POWER UP. <span className="text-secondary font-bold">PLAY FOREVER.</span>
                  <br className="hidden md:block" />
                  A new destination for next-gen indie games and AI-powered tools.
                  <br />
                  <span className="text-sm opacity-70 mt-2 block font-mono">REALITY IS A LIMITATION // THE DIGITAL FRONTIER IS INFINITE.</span>
                </p>
              </div>
              
              {/* Tech decoration below text */}
              <div className="mt-10">
                <SystemStatus />
              </div>
            </div>
            <Storefront />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
