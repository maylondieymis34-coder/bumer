
import React from 'react';

interface BoomerangLogoProps {
  size?: number;
  showText?: boolean;
}

const BoomerangLogo: React.FC<BoomerangLogoProps> = ({ size = 100, showText = false }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bumerGradientNeon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FBFF" />
              <stop offset="50%" stopColor="#FF00E5" />
              <stop offset="100%" stopColor="#B026FF" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Main "B" Shape with Neon Gradient */}
          <path
            d="M25 15C25 10 30 10 35 10H65C85 10 85 40 65 45C85 50 85 85 65 90H35C25 90 25 85 25 80V15Z"
            fill="url(#bumerGradientNeon)"
            filter="url(#neonGlow)"
          />

          {/* Central Cutout for Speech Bubble */}
          <rect x="42" y="38" width="24" height="24" rx="6" fill="white" />
          
          {/* Neon Magenta Speech Bubble Icon */}
          <path
            d="M54 43C50.1 43 47 45.7 47 49C47 50.8 48 52.3 49.5 53.3L48.5 56L51.5 54.5C52.3 54.8 53.1 55 54 55C57.9 55 61 52.3 61 49C61 45.7 57.9 43 54 43Z"
            fill="#FF00E5"
          />
          
          {/* Dots inside Bubble */}
          <circle cx="51.5" cy="49" r="1" fill="white" />
          <circle cx="54" cy="49" r="1" fill="white" />
          <circle cx="56.5" cy="49" r="1" fill="white" />
          
          {/* Neon accents */}
          <circle cx="38" cy="22" r="3" fill="white" opacity="0.6" />
          <circle cx="75" cy="25" r="2" fill="#00FBFF" />
        </svg>
      </div>
      {showText && (
        <span className="mt-4 text-4xl font-black tracking-tight text-black">
          BUMER
        </span>
      )}
    </div>
  );
};

export default BoomerangLogo;
