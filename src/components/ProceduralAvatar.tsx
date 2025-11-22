import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ProceduralAvatarProps {
  level: number;
  size?: number;
  className?: string;
}

const ProceduralAvatar: React.FC<ProceduralAvatarProps> = ({ level, size = 128, className = '' }) => {
  // Deterministic random based on level to ensure the same level always looks the same
  // but we want evolution, so level 2 builds on level 1 features.
  
  const stage = useMemo(() => {
    if (level >= 50) return 'apex';
    if (level >= 40) return 'leviathan';
    if (level >= 30) return 'predator';
    if (level >= 20) return 'chrysalis';
    if (level >= 10) return 'larva';
    return 'spore';
  }, [level]);

  const colors = useMemo(() => {
    if (stage === 'apex') return { primary: '#ffffff', secondary: '#ffd700', glow: '#ff00ff' }; // White/Gold/Rainbow
    if (stage === 'leviathan') return { primary: '#9900ff', secondary: '#00ffff', glow: '#9900ff' }; // Purple/Cyan
    if (stage === 'predator') return { primary: '#ff0000', secondary: '#ff6600', glow: '#ff0000' }; // Red/Orange
    if (stage === 'chrysalis') return { primary: '#00ff00', secondary: '#006600', glow: '#00ff00' }; // Green/Dark Green
    if (stage === 'larva') return { primary: '#0088ff', secondary: '#0000ff', glow: '#0088ff' }; // Blue
    return { primary: '#00ffd5', secondary: '#ffffff', glow: '#00ffd5' }; // Cyan (Default)
  }, [stage]);

  // Generate features based on level
  const features = useMemo(() => {
    const items = [];
    
    // Core Body (The "Dot" that grows)
    const coreSize = 10 + (level * 1.5); 
    
    // Spore Phase (1-9)
    if (level >= 1) {
      items.push(
        <motion.circle 
          key="core"
          cx="64" cy="64" r={Math.min(coreSize, 30)}
          fill={colors.primary}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2 - (level * 0.02), repeat: Infinity }}
        />
      );
    }

    // Larva Phase (10-19) - Add segments
    if (level >= 10) {
      const segments = Math.floor((level - 5) / 2);
      for (let i = 0; i < segments; i++) {
        items.push(
          <motion.circle
            key={`seg-${i}`}
            cx={64 + (Math.sin(i) * 20)} cy={64 + (Math.cos(i) * 20)} r={10 + (i * 2)}
            fill={colors.secondary}
            opacity={0.6}
            animate={{ 
              cx: [64 + (Math.sin(i) * 20), 64 - (Math.sin(i) * 20), 64 + (Math.sin(i) * 20)],
              cy: [64 + (Math.cos(i) * 20), 64 - (Math.cos(i) * 20), 64 + (Math.cos(i) * 20)]
            }}
            transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
          />
        );
      }
    }

    // Chrysalis Phase (20-29) - Protective Shell
    if (level >= 20) {
      items.push(
        <motion.path
          key="shell"
          d="M64 20 L90 40 L90 88 L64 108 L38 88 L38 40 Z"
          fill="none"
          stroke={colors.secondary}
          strokeWidth={2 + (level - 20) * 0.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      );
    }

    // Predator Phase (30-39) - Spikes/Mandibles
    if (level >= 30) {
      const spikes = Math.floor(level - 25);
      for (let i = 0; i < spikes; i++) {
        const angle = (i / spikes) * Math.PI * 2;
        const x1 = 64 + Math.cos(angle) * 30;
        const y1 = 64 + Math.sin(angle) * 30;
        const x2 = 64 + Math.cos(angle) * 50;
        const y2 = 64 + Math.sin(angle) * 50;
        
        items.push(
          <motion.path
            key={`spike-${i}`}
            d={`M${x1} ${y1} L${x2} ${y2}`}
            stroke={colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ 
              d: [`M${x1} ${y1} L${x2} ${y2}`, `M${x1} ${y1} L${x2 + Math.cos(angle)*10} ${y2 + Math.sin(angle)*10}`, `M${x1} ${y1} L${x2} ${y2}`]
            }}
            transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
          />
        );
      }
    }

    // Leviathan Phase (40-49) - Tentacles/Aura
    if (level >= 40) {
      items.push(
        <motion.circle
          key="aura"
          cx="64" cy="64" r="50"
          fill="none"
          stroke={colors.glow}
          strokeWidth="1"
          strokeDasharray="5,5"
          animate={{ scale: [1, 1.5], opacity: [1, 0], rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      );
      
      // Tentacles
      for(let i=0; i<4; i++) {
         items.push(
            <motion.path
              key={`tentacle-${i}`}
              d={`M64 64 Q ${30 + i*20} ${30} ${10 + i*30} ${10}`}
              stroke={colors.secondary}
              strokeWidth="2"
              fill="none"
              animate={{ d: [`M64 64 Q ${30 + i*20} ${30} ${10 + i*30} ${10}`, `M64 64 Q ${50 + i*20} ${50} ${30 + i*30} ${30}`, `M64 64 Q ${30 + i*20} ${30} ${10 + i*30} ${10}`] }}
              transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
            />
         )
      }
    }

    // Apex Phase (50) - The Boss
    if (level >= 50) {
      // Clear previous simple items for the boss transformation
      return (
        <g>
          {/* Divine Halo */}
          <motion.circle cx="64" cy="64" r="55" stroke="url(#apexGradient)" strokeWidth="2" fill="none" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
          <motion.circle cx="64" cy="64" r="50" stroke="white" strokeWidth="1" strokeDasharray="2 4" fill="none" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
          
          {/* The Core Entity */}
          <motion.path
            d="M64 20 L80 50 L110 64 L80 78 L64 108 L48 78 L18 64 L48 50 Z"
            fill="url(#apexGradient)"
            animate={{ scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Energy Wings */}
          {[...Array(6)].map((_, i) => (
            <motion.path
              key={`wing-${i}`}
              d={`M64 64 L${64 + Math.cos(i) * 60} ${64 + Math.sin(i) * 60}`}
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
          
          {/* Eyes */}
          <motion.circle cx="55" cy="60" r="3" fill="black" />
          <motion.circle cx="73" cy="60" r="3" fill="black" />
        </g>
      );
    }

    return items;
  }, [level, colors, stage]);

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="apexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#ff00ff" />
          </linearGradient>
        </defs>
        
        {/* Background Glow */}
        <motion.circle 
          cx="64" cy="64" r="40" 
          fill="url(#glow)" 
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {features}
      </svg>
    </div>
  );
};

export default ProceduralAvatar;
