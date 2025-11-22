import React from 'react';

const CyberDecorations: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {/* Top Left Corner */}
      <div className="absolute top-0 left-0 w-64 h-64">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 0 L40 0 L50 10 L0 10 Z" fill="#00ffd5" opacity="0.2" />
          <path d="M0 0 L10 0 L10 50 L0 40 Z" fill="#00ffd5" opacity="0.2" />
          <circle cx="15" cy="15" r="2" fill="#00ffd5" opacity="0.6" />
        </svg>
      </div>

      {/* Top Right Corner */}
      <div className="absolute top-0 right-0 w-64 h-64">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M100 0 L60 0 L50 10 L100 10 Z" fill="#ff66cc" opacity="0.2" />
          <path d="M100 0 L90 0 L90 50 L100 40 Z" fill="#ff66cc" opacity="0.2" />
          <rect x="85" y="15" width="10" height="2" fill="#ff66cc" opacity="0.6" />
          <rect x="85" y="20" width="10" height="2" fill="#ff66cc" opacity="0.4" />
          <rect x="85" y="25" width="10" height="2" fill="#ff66cc" opacity="0.2" />
        </svg>
      </div>

      {/* Bottom Left Corner */}
      <div className="absolute bottom-0 left-0 w-64 h-64">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L40 100 L50 90 L0 90 Z" fill="#ff66cc" opacity="0.2" />
          <path d="M0 100 L10 100 L10 50 L0 60 Z" fill="#ff66cc" opacity="0.2" />
          <text x="15" y="90" fill="#ff66cc" fontSize="4" fontFamily="monospace" opacity="0.5">SYS.READY</text>
        </svg>
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-0 right-0 w-64 h-64">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M100 100 L60 100 L50 90 L100 90 Z" fill="#00ffd5" opacity="0.2" />
          <path d="M100 100 L90 100 L90 50 L100 60 Z" fill="#00ffd5" opacity="0.2" />
          <circle cx="90" cy="90" r="15" stroke="#00ffd5" strokeWidth="0.5" fill="none" opacity="0.3" />
          <circle cx="90" cy="90" r="10" stroke="#00ffd5" strokeWidth="0.5" fill="none" opacity="0.3" strokeDasharray="2 2" />
        </svg>
      </div>

      {/* Vertical Lines */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-gradient-to-b from-transparent via-[#00ffd5]/10 to-transparent" />
      <div className="absolute top-0 bottom-0 right-12 w-[1px] bg-gradient-to-b from-transparent via-[#ff66cc]/10 to-transparent" />
    </div>
  );
};

export default CyberDecorations;
