import React from 'react';

interface GorgaShieldProps {
  className?: string;
  size?: number;
}

/**
 * GorgaShield: Emblem BATAKGO
 * Permukaan datar, garis tegas, sudut geometris terinspirasi ornamen kayu Batak Toba.
 * Menggunakan palet token: Secang (#A62B1F), Arang (#1E1A17), Kunyit (#D9A21B), dan Kapur (#F4EDE0).
 */
export const GorgaShield: React.FC<GorgaShieldProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Emblem Gorga Batak"
    >
      {/* Outer Crest Contour */}
      <path
        d="M50 4L88 18V50C88 74 50 96 50 96C50 96 12 74 12 50V18L50 4Z"
        fill="#A62B1F"
        stroke="#1E1A17"
        strokeWidth="3.5"
        strokeLinejoin="miter"
      />

      {/* Inner Planar Field */}
      <path
        d="M50 12L80 23V49C80 68 50 86 50 86C50 86 20 68 20 49V23L50 12Z"
        fill="#1E1A17"
        stroke="#D9A21B"
        strokeWidth="1.5"
      />

      {/* Ruma Bolon Gable Motif */}
      <path
        d="M32 28C42 22 58 22 68 28C64 36 36 36 32 28Z"
        fill="#D9A21B"
      />

      {/* Gorga Geometris Simeol-meol */}
      <path
        d="M50 40C44 40 40 44 40 50C40 56 45 60 50 60C55 60 60 56 60 50C60 41 50 35 42 42C34 50 36 65 48 70C58 74 72 68 72 54C72 38 56 30 40 36"
        stroke="#F4EDE0"
        strokeWidth="3"
        strokeLinecap="square"
        fill="none"
      />

      {/* Central Pivot Dot */}
      <circle cx="50" cy="50" r="3" fill="#D9A21B" />

      {/* Tri-color Geometric Bars (Secang, Kapur, Kunyit) */}
      <rect x="40" y="76" width="6" height="5" fill="#A62B1F" stroke="#1E1A17" strokeWidth="1" />
      <rect x="47" y="76" width="6" height="5" fill="#F4EDE0" stroke="#1E1A17" strokeWidth="1" />
      <rect x="54" y="76" width="6" height="5" fill="#D9A21B" stroke="#1E1A17" strokeWidth="1" />
    </svg>
  );
};

/**
 * PitaTenun: Pembatas section pita 3 garis (arang, secang, kapur) setinggi 6px
 */
export const PitaTenun: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`w-full h-[6px] shrink-0 border-t border-b border-[#1E1A17] ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #1E1A17 0px, #1E1A17 2px, #A62B1F 2px, #A62B1F 4px, #F4EDE0 4px, #F4EDE0 6px)'
      }}
      aria-hidden="true"
    />
  );
};

/**
 * GorgaBorder: Ornamen Pita Geometris Ipon-ipon (Gigi Gergaji & Segitiga)
 */
export const GorgaBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-[6px] overflow-hidden flex items-center bg-[#1E1A17] border-t border-b border-[#1E1A17] ${className}`} aria-hidden="true">
      <svg
        className="w-full h-[6px] fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 6"
        preserveAspectRatio="repeat-x"
      >
        <pattern id="gorgaIponIpon" width="24" height="6" patternUnits="userSpaceOnUse">
          {/* Arang triangle */}
          <polygon points="0,0 12,6 24,0" fill="#1E1A17" />
          {/* Secang diamond */}
          <polygon points="12,0 18,3 12,6 6,3" fill="#A62B1F" />
          {/* Kapur inner point */}
          <polygon points="12,1 15,3 12,5 9,3" fill="#F4EDE0" />
        </pattern>
        <rect width="100%" height="6" fill="url(#gorgaIponIpon)" />
      </svg>
    </div>
  );
};

/**
 * GorgaMedal: Badge Peringkat Geometris Papan Ukir
 */
export const GorgaMedal: React.FC<{ rank: 1 | 2 | 3; size?: number }> = ({ rank, size = 32 }) => {
  const configs = {
    1: {
      border: '#D9A21B',
      fill: '#D9A21B',
      ribbon: '#A62B1F',
      text: '#1E1A17',
      label: '1'
    },
    2: {
      border: '#23365A',
      fill: '#F4EDE0',
      ribbon: '#23365A',
      text: '#1E1A17',
      label: '2'
    },
    3: {
      border: '#A62B1F',
      fill: '#E8DFC8',
      ribbon: '#1E1A17',
      text: '#1E1A17',
      label: '3'
    }
  };

  const c = configs[rank];

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2L8 16L16 14L14 2Z" fill={c.ribbon} />
      <path d="M26 2L32 16L24 14L26 2Z" fill={c.ribbon} />
      <rect x="8" y="10" width="24" height="24" rx="2" fill={c.fill} stroke={c.border} strokeWidth="2" />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fontFamily="'Zilla Slab', Georgia, serif"
        fill={c.text}
      >
        {c.label}
      </text>
    </svg>
  );
};
