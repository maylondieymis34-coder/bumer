
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
            <linearGradient id="bumerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="33%" stopColor="#FF1493" />
              <stop offset="66%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#1E90FF" />
            </linearGradient>
          </defs>
          
          {/* Main "B" Shape */}
          <path
            d="M25 15C25 10 30 10 35 10H65C85 10 85 40 65 45C85 50 85 85 65 90H35C25 90 25 85 25 80V15Z"
            fill="url(#bumerGradient)"
          />
          <path
             d="M30 15V85M30 50H70"
             stroke="white"
             strokeWidth="0.5"
             opacity="0.1"
          />

          {/* Central Cutout for Speech Bubble */}
          <rect x="42" y="38" width="24" height="24" rx="6" fill="white" />
          
          {/* Speech Bubble Icon (Magenta) */}
          <path
            d="M54 43C50.1 43 47 45.7 47 49C47 50.8 48 52.3 49.5 53.3L48.5 56L51.5 54.5C52.3 54.8 53.1 55 54 55C57.9 55 61 52.3 61 49C61 45.7 57.9 43 54 43Z"
            fill="#D112A6"
          />
          
          {/* Three Dots inside Magenta Bubble */}
          <circle cx="51.5" cy="49" r="1" fill="white" opacity="0.8" />
          <circle cx="54" cy="49" r="1" fill="white" opacity="0.8" />
          <circle cx="56.5" cy="49" r="1" fill="white" opacity="0.8" />
          
          {/* Stylized accents from image */}
          <circle cx="38" cy="22" r="3" fill="white" opacity="0.9" />
          <circle cx="38" cy="80" r="3" fill="white" opacity="0.9" />
          <circle cx="75" cy="25" r="2" fill="#FF1493" />
          <path d="M78 35C85 38 82 45 75 42" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
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
