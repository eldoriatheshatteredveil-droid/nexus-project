import React, { useEffect, useState, useRef } from 'react';

const GameCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Check for hover
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer');
      
      if (isInteractive !== isHoveringRef.current) {
        isHoveringRef.current = isInteractive;
        setIsHovering(isInteractive);
      }
    };

    let animationFrameId: number;

    const animate = () => {
      // Smooth follow with high precision for gaming feel
      posX += (mouseX - posX) * 0.3; 
      posY += (mouseY - posY) * 0.3;
      
      if (cursor) {
        cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
      style={{ willChange: 'transform' }}
    >
      {/* Main Pointer Container */}
      <div className={`relative transition-all duration-200 ease-out ${isHovering ? 'scale-110' : 'scale-100'}`}>
        
        {/* Primary Arrow */}
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          fill="none" 
          className={`transform -translate-x-[2px] -translate-y-[2px] transition-colors duration-300 ${isHovering ? 'text-[#ff66cc]' : 'text-[#00ffd5]'}`}
        >
          {/* Main Arrow Body */}
          <path 
            d="M4 4L28 12L18 18L12 28L4 4Z" 
            fill="currentColor" 
            fillOpacity="0.1" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinejoin="round"
          />
          {/* Inner Detail */}
          <path 
            d="M18 18L28 12M18 18L12 28" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeOpacity="0.5"
          />
        </svg>

        {/* Hover Reticle - Expands when hovering */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-dashed border-[#00ffd5]/30 rounded-full transition-all duration-500 ${isHovering ? 'opacity-100 scale-100 rotate-180' : 'opacity-0 scale-50 rotate-0'}`} />
        
        {/* Center Dot */}
        <div className={`absolute top-[4px] left-[4px] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-50'}`} />
      </div>
    </div>
  );
};

export default GameCursor;
