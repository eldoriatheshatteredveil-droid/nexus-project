import React from 'react';
import Storefront from '../components/Storefront';
import DigitalFrontierLogo from '../components/DigitalFrontierLogo';
import SystemStatus from '../components/SystemStatus';

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
                {/* Corner accents */}
                <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-primary" />
                <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t border-r border-primary" />
                <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b border-l border-primary" />
                <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-primary" />

                <p className="text-gray-300 text-lg md:text-xl font-light tracking-wide leading-relaxed">
                  <span className="text-primary font-bold">JACK IN.</span> POWER UP. <span className="text-secondary font-bold">PLAY FOREVER.</span>
                  <br className="hidden md:block" />
                  The premier destination for next-gen indie games and AI-powered tools.
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
