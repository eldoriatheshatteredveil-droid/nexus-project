import React, { useEffect, useState } from 'react';
import { Activity, Wifi, Cpu, Database, Radio } from 'lucide-react';

const HexColumn: React.FC<{ x: string; speed: number; delay: number }> = ({ x, speed, delay }) => {
  const [chars, setChars] = useState<string[]>([]);

  useEffect(() => {
    const hex = '0123456789ABCDEF';
    const generate = () => {
      const newChars = Array.from({ length: 15 }, () => hex[Math.floor(Math.random() * hex.length)]);
      setChars(newChars);
    };

    const interval = setInterval(generate, speed);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div 
      className="absolute top-0 text-[10px] font-mono text-[#00ffd5]/20 flex flex-col leading-none select-none"
      style={{ left: x, animation: `fadeIn 1s ${delay}s forwards` }}
    >
      {chars.map((char, i) => (
        <span key={i} style={{ opacity: 1 - i / 15 }}>{char}</span>
      ))}
    </div>
  );
};

const SystemWidget: React.FC = () => {
  const [cpu, setCpu] = useState(30);
  const [mem, setMem] = useState(40);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 20)));
      setMem(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 10)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 p-4 border border-[#00ffd5]/20 bg-black/40 backdrop-blur-sm rounded-lg w-48 font-mono text-xs z-0 hidden md:block">
      <div className="flex items-center justify-between mb-2 text-[#00ffd5]">
        <span className="flex items-center gap-2"><Activity size={14} /> SYS.MONITOR</span>
        <span className="animate-pulse">ONLINE</span>
      </div>
      
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>CPU_CORE_01</span>
            <span>{cpu.toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#00ffd5] transition-all duration-500"
              style={{ width: `${cpu}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-gray-400 mb-1">
            <span>MEM_ALLOC</span>
            <span>{mem.toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#ff66cc] transition-all duration-500"
              style={{ width: `${mem}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkWidget: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 p-4 border border-[#ff66cc]/20 bg-black/40 backdrop-blur-sm rounded-lg w-48 font-mono text-xs z-0 hidden md:block text-right">
      <div className="flex items-center justify-end gap-2 mb-2 text-[#ff66cc]">
        <span className="animate-pulse">NET.UPLINK</span>
        <Wifi size={14} />
      </div>
      
      <div className="flex flex-col gap-1 text-gray-500">
        <div className="flex justify-end gap-2">
          <span>PKT_LOSS:</span>
          <span className="text-white">0.0%</span>
        </div>
        <div className="flex justify-end gap-2">
          <span>LATENCY:</span>
          <span className="text-[#00ffd5]">{Math.floor(Math.random() * 20 + 10)}ms</span>
        </div>
        <div className="flex justify-end gap-2">
          <span>ENCRYPTION:</span>
          <span className="text-[#ff66cc]">AES-4096</span>
        </div>
      </div>
    </div>
  );
};

const CyberHUD: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating Hex Columns */}
      <HexColumn x="5%" speed={100} delay={0} />
      <HexColumn x="15%" speed={150} delay={2} />
      <HexColumn x="85%" speed={120} delay={1} />
      <HexColumn x="95%" speed={200} delay={3} />

      {/* Widgets */}
      <SystemWidget />
      <NetworkWidget />

      {/* Scanner Line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ffd5]/5 to-transparent h-[20vh] w-full animate-scan" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

export default CyberHUD;
