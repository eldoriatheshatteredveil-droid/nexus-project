import React, { useState, useEffect } from 'react';

const SystemStatus: React.FC = () => {
  const [statusText, setStatusText] = useState('SYSTEM.ONLINE');
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(12, Math.min(45, prev + change));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 px-4 py-1.5 bg-[#00ffd5]/5 border border-[#00ffd5]/20 rounded-full backdrop-blur-sm">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffd5] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffd5]"></span>
        </div>
        <span className="text-xs font-mono text-[#00ffd5] tracking-[0.2em] font-bold shadow-[#00ffd5] drop-shadow-[0_0_5px_rgba(0,255,213,0.5)]">
          {statusText}
        </span>
        <div className="h-3 w-[1px] bg-[#00ffd5]/30 mx-1"></div>
        <span className="text-[10px] font-mono text-[#00ffd5]/70 tracking-wider">
          v1.1.3
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-[9px] font-mono text-[#00ffd5]/40 tracking-widest uppercase">
        <span>LATENCY: {latency}MS</span>
        <span>•</span>
        <span>SECURE_CONN</span>
        <span>•</span>
        <span>NODE_ID: 0x{Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}</span>
      </div>
    </div>
  );
};

export default SystemStatus;
