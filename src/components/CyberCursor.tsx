import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store';
import { ORBS } from '../data/orbs';

const CyberCursor: React.FC = () => {
  const { selectedOrbId } = useStore();
  const selectedOrb = ORBS.find(orb => orb.id === selectedOrbId) || ORBS[0];
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const cursor = document.getElementById('nexus-cursor');
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.display = 'block';

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
      posX += (mouseX - posX) * 0.15;
      posY += (mouseY - posY) * 0.15;
      cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
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
    <div id="nexus-cursor" className="fixed top-0 left-0 pointer-events-none z-[9999] hidden">
      <div className={`relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-300 ${isHovering ? 'scale-150' : 'scale-100'}`}>
        <selectedOrb.component />
      </div>
    </div>
  );
};

export default CyberCursor;
