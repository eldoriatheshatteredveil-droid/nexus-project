import React from 'react';

export interface OrbDef {
  id: string;
  name: string;
  description: string;
  unlockThreshold: number;
  component: React.FC;
  stats: {
    precision: number;
    speed: number;
    stealth: number;
  };
}

export const ORBS: OrbDef[] = [
  {
    id: 'default',
    name: 'System Default',
    description: 'Standard issue navigation reticle.',
    unlockThreshold: 0,
    stats: { precision: 50, speed: 50, stealth: 20 },
    component: () => (
      <>
        <div className="w-3 h-3 bg-[#00ffd5] rounded-full shadow-[0_0_15px_#00ffd5] z-10" />
        <div className="absolute w-8 h-8 border border-[#00ffd5]/50 rounded-full animate-[spin_3s_linear_infinite]" />
        <div className="absolute w-12 h-12 border border-dashed border-[#ff66cc]/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
      </>
    )
  },
  {
    id: 'lime-bug',
    name: 'Bio-Hazard',
    description: 'Radioactive isotope tracker.',
    unlockThreshold: 10,
    stats: { precision: 40, speed: 60, stealth: 10 },
    component: () => (
      <>
        <div className="w-4 h-4 bg-[#ccff00] rounded-full shadow-[0_0_15px_#ccff00] z-10 animate-pulse" />
        <div className="absolute w-10 h-10 border-2 border-[#ccff00]/30 rounded-full animate-ping opacity-20" />
      </>
    )
  },
  {
    id: 'red-alert',
    name: 'Crimson Eye',
    description: 'Target acquisition mode.',
    unlockThreshold: 25,
    stats: { precision: 80, speed: 70, stealth: 30 },
    component: () => (
      <>
        <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_20px_red] z-10" />
        <div className="absolute w-8 h-8 border border-red-500 rotate-45" />
        <div className="absolute w-12 h-12 border border-red-500/30 rounded-full" />
      </>
    )
  },
  {
    id: 'plasma',
    name: 'Plasma Core',
    description: 'Unstable energy containment.',
    unlockThreshold: 50,
    stats: { precision: 60, speed: 85, stealth: 40 },
    component: () => (
      <>
        <div className="w-4 h-4 bg-blue-400 rounded-full blur-sm z-10" />
        <div className="absolute w-6 h-6 bg-blue-600 rounded-full blur-md animate-pulse" />
        <div className="absolute w-10 h-10 border-2 border-blue-300/50 rounded-full animate-[spin_1s_linear_infinite]" />
      </>
    )
  },
  {
    id: 'gold-standard',
    name: 'Midas Touch',
    description: 'Premium user interface.',
    unlockThreshold: 100,
    stats: { precision: 90, speed: 40, stealth: 10 },
    component: () => (
      <>
        <div className="w-3 h-3 bg-yellow-400 rotate-45 z-10 shadow-[0_0_15px_gold]" />
        <div className="absolute w-8 h-8 border border-yellow-500/50 rotate-45 animate-[spin_4s_linear_infinite]" />
        <div className="absolute w-8 h-8 border border-yellow-200/30 rotate-45 animate-[spin_4s_linear_infinite_reverse]" />
      </>
    )
  },
  {
    id: 'glitch',
    name: 'System Failure',
    description: 'Corrupted data pointer.',
    unlockThreshold: 200,
    stats: { precision: 20, speed: 95, stealth: 80 },
    component: () => (
      <>
        <div className="w-4 h-4 bg-white mix-blend-difference z-10 animate-pulse" />
        <div className="absolute w-6 h-6 bg-red-500/50 translate-x-[2px] mix-blend-screen" />
        <div className="absolute w-6 h-6 bg-cyan-500/50 -translate-x-[2px] mix-blend-screen" />
      </>
    )
  },
  {
    id: 'void',
    name: 'The Void',
    description: 'Absorbs all light.',
    unlockThreshold: 300,
    stats: { precision: 100, speed: 30, stealth: 100 },
    component: () => (
      <>
        <div className="w-4 h-4 bg-black border border-white/50 rounded-full z-10" />
        <div className="absolute w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full scale-0 animate-[ping_2s_ease-out_infinite]" />
      </>
    )
  },
  {
    id: 'star',
    name: 'Neutron Star',
    description: 'Dense stellar remnant.',
    unlockThreshold: 400,
    stats: { precision: 95, speed: 95, stealth: 50 },
    component: () => (
      <>
        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_20px_white] z-10" />
        <div className="absolute w-16 h-1 bg-white/20 rotate-45" />
        <div className="absolute w-16 h-1 bg-white/20 -rotate-45" />
        <div className="absolute w-1 h-16 bg-white/20" />
        <div className="absolute w-16 h-1 bg-white/20" />
      </>
    )
  },
  {
    id: 'matrix',
    name: 'The Code',
    description: 'See the raw data.',
    unlockThreshold: 500,
    stats: { precision: 100, speed: 100, stealth: 90 },
    component: () => (
      <div className="font-mono text-[#00ff00] text-xs font-bold animate-pulse">
        0x1
      </div>
    )
  },
  {
    id: 'fire',
    name: 'Inferno',
    description: 'Burning hot.',
    unlockThreshold: 600,
    stats: { precision: 60, speed: 80, stealth: 0 },
    component: () => (
      <>
        <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_20px_orange] z-10" />
        <div className="absolute w-6 h-6 bg-red-500/50 rounded-full blur-sm animate-ping" />
        <div className="absolute w-8 h-8 border-t-2 border-orange-400 rounded-full animate-spin" />
      </>
    )
  },
  {
    id: 'ice',
    name: 'Zero Kelvin',
    description: 'Absolute zero.',
    unlockThreshold: 700,
    stats: { precision: 90, speed: 20, stealth: 60 },
    component: () => (
      <>
        <div className="w-3 h-3 bg-cyan-100 rotate-45 z-10 shadow-[0_0_15px_cyan]" />
        <div className="absolute w-8 h-8 border border-cyan-400/50 rotate-12" />
        <div className="absolute w-8 h-8 border border-cyan-400/50 -rotate-12" />
      </>
    )
  },
  {
    id: 'toxic',
    name: 'Toxic Waste',
    description: 'Handle with care.',
    unlockThreshold: 800,
    stats: { precision: 50, speed: 50, stealth: 30 },
    component: () => (
      <>
        <div className="w-4 h-4 bg-purple-600 rounded-full z-10 border border-green-400" />
        <div className="absolute w-8 h-8 border-2 border-dashed border-green-500 rounded-full animate-[spin_10s_linear_infinite]" />
        <div className="absolute w-10 h-10 border border-purple-500/30 rounded-full animate-pulse" />
      </>
    )
  },
  {
    id: 'crosshair',
    name: 'Sniper Elite',
    description: 'Precision instrument.',
    unlockThreshold: 900,
    stats: { precision: 100, speed: 60, stealth: 80 },
    component: () => (
      <>
        <div className="w-1 h-1 bg-red-500 z-10" />
        <div className="absolute w-[100px] h-[1px] bg-red-500/20" />
        <div className="absolute h-[100px] w-[1px] bg-red-500/20" />
        <div className="absolute w-6 h-6 border border-red-500/50 rounded-full" />
      </>
    )
  },
  {
    id: 'binary',
    name: 'Binary Stream',
    description: 'Digital consciousness.',
    unlockThreshold: 1000,
    stats: { precision: 85, speed: 90, stealth: 70 },
    component: () => (
      <>
        <div className="w-2 h-2 bg-white rounded-full z-10" />
        <div className="absolute text-[8px] text-[#00ffd5] -top-4 left-0 animate-bounce">1</div>
        <div className="absolute text-[8px] text-[#00ffd5] top-0 -right-4 animate-bounce delay-75">0</div>
        <div className="absolute text-[8px] text-[#00ffd5] bottom-0 -left-4 animate-bounce delay-150">1</div>
      </>
    )
  },
  {
    id: 'quantum',
    name: 'Quantum State',
    description: 'Existing in all places.',
    unlockThreshold: 1500,
    stats: { precision: 99, speed: 99, stealth: 99 },
    component: () => (
      <>
        <div className="w-2 h-2 bg-white rounded-full z-10 blur-[1px]" />
        <div className="absolute w-8 h-8 border border-white/30 rounded-[40%] animate-[spin_2s_linear_infinite]" />
        <div className="absolute w-8 h-8 border border-white/30 rounded-[40%] animate-[spin_3s_linear_infinite_reverse] rotate-90" />
      </>
    )
  },
  {
    id: 'skull',
    name: 'Reaper',
    description: 'Death awaits.',
    unlockThreshold: 2000,
    stats: { precision: 100, speed: 80, stealth: 20 },
    component: () => (
      <div className="text-gray-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
        ☠
      </div>
    )
  },
  {
    id: 'diamond',
    name: 'Cyber Gem',
    description: 'Unbreakable encryption.',
    unlockThreshold: 3000,
    stats: { precision: 90, speed: 40, stealth: 10 },
    component: () => (
      <>
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-cyan-400 z-10" />
        <div className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-cyan-600 top-[5px]" />
        <div className="absolute w-10 h-10 border border-cyan-200/20 rotate-45 animate-pulse" />
      </>
    )
  },
  {
    id: 'rainbow',
    name: 'RGB Gamer',
    description: 'More FPS guaranteed.',
    unlockThreshold: 5000,
    stats: { precision: 50, speed: 100, stealth: 0 },
    component: () => (
      <>
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-spin z-10" />
        <div className="absolute w-8 h-8 rounded-full border-2 border-transparent border-t-red-500 border-r-green-500 border-b-blue-500 animate-[spin_2s_linear_infinite]" />
      </>
    )
  },
  {
    id: 'singularity',
    name: 'Singularity',
    description: 'The end of time.',
    unlockThreshold: 7500,
    stats: { precision: 100, speed: 10, stealth: 100 },
    component: () => (
      <>
        <div className="w-4 h-4 bg-black rounded-full shadow-[0_0_20px_#800080] z-10 border border-purple-500" />
        <div className="absolute w-12 h-12 bg-purple-900/20 rounded-full animate-ping" />
        <div className="absolute w-full h-full bg-black/10 backdrop-blur-[1px] rounded-full scale-150" />
      </>
    )
  },
  {
    id: 'nexus',
    name: 'THE NEXUS',
    description: 'Ultimate power.',
    unlockThreshold: 10000,
    stats: { precision: 100, speed: 100, stealth: 100 },
    component: () => (
      <>
        <div className="w-2 h-2 bg-white rounded-full z-20 shadow-[0_0_30px_white]" />
        <div className="absolute w-6 h-6 bg-gradient-to-tr from-[#00ffd5] to-[#ff66cc] rounded-full animate-spin blur-sm z-10" />
        <div className="absolute w-12 h-12 border border-[#00ffd5] rounded-full animate-[spin_4s_linear_infinite]" />
        <div className="absolute w-16 h-16 border border-[#ff66cc] rounded-full animate-[spin_5s_linear_infinite_reverse]" />
        <div className="absolute w-20 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
        <div className="absolute h-20 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent animate-pulse" />
      </>
    )
  }
];
