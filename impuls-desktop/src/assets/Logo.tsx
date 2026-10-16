import React from 'react';

export const ImpulsLogo: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="24" fill="#141820" />
      <rect x="1" y="1" width="98" height="98" rx="23" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
      {/* Matte Steel / Slate Kinetic Pulse Mark (NO NEON) */}
      <path
        d="M26 50L40 28L54 72L66 42L74 50"
        stroke="#8FA8C8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="74" cy="50" r="4" fill="#C5D6EA" />
    </svg>
  );
};
