import React from 'react';

interface GorgaShieldProps {
  className?: string;
  size?: number;
}

/**
 * GorgaShield: Emblem Resmi BATAKGO
 * Menggabungkan siluet atap lengkung Ruma Bolon Batak dengan spiral suci Gorga Simeol-meol.
 * Mengusung filosofi Tiga Bolit: Merah Gorga (#991B1B), Hitam Obsidian (#18181B), dan Emas Adat (#D97706).
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
      <defs>
        {/* Sacred Tri-color Gradient */}
        <linearGradient id="gorgaGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#991B1B" />
          <stop offset="50%" stopColor="#7F1D1D" />
          <stop offset="100%" stopColor="#1C1917" />
        </linearGradient>
        <linearGradient id="goldAccent" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Outer Shield / Traditional Crest Silhouette */}
      <path
        d="M50 4L88 18V50C88 74 50 96 50 96C50 96 12 74 12 50V18L50 4Z"
        fill="url(#gorgaGrad)"
        stroke="#D97706"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Inner Decorative Ridge */}
      <path
        d="M50 11L81 22.5V49C81 69 50 88 50 88C50 88 19 69 19 49V22.5L50 11Z"
        fill="#1C1917"
        stroke="#FFFFFF"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />

      {/* Ruma Bolon Curved Gable Apex Motif */}
      <path
        d="M32 28C42 22 58 22 68 28C64 36 36 36 32 28Z"
        fill="url(#goldAccent)"
      />

      {/* Gorga Simeol-meol (Double Sacred Spiral of Continuity) */}
      <path
        d="M50 40C44 40 40 44 40 50C40 56 45 60 50 60C55 60 60 56 60 50C60 41 50 35 42 42C34 50 36 65 48 70C58 74 72 68 72 54C72 38 56 30 40 36"
        stroke="#F59E0B"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Central Sacred Pivot Dot */}
      <circle cx="50" cy="50" r="3" fill="#FFFFFF" />

      {/* Traditional Tri-color Accent Bars at bottom of crest */}
      <rect x="42" y="76" width="5" height="5" rx="1" fill="#991B1B" />
      <rect x="48" y="76" width="5" height="5" rx="1" fill="#FAFAF9" />
      <rect x="54" y="76" width="5" height="5" rx="1" fill="#D97706" />
    </svg>
  );
};

/**
 * GorgaBorder: Ornamen Pita Geometris Gorga Ipon-ipon
 * Motif gigi gergaji & segitiga saling silang khas ukiran kayu tradisional Batak Toba.
 */
export const GorgaBorder: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-3 overflow-hidden flex items-center bg-[#1C1917] ${className}`} aria-hidden="true">
      <svg
        className="w-full h-3 text-[#991B1B] fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 12"
        preserveAspectRatio="repeat-x"
      >
        <pattern id="gorgaIponIpon" width="24" height="12" patternUnits="userSpaceOnUse">
          {/* Black background triangle */}
          <polygon points="0,0 12,12 24,0" fill="#1C1917" />
          {/* Red diamond */}
          <polygon points="12,0 18,6 12,12 6,6" fill="#991B1B" />
          {/* White inner tooth */}
          <polygon points="12,2 15,6 12,10 9,6" fill="#FAFAF9" />
          {/* Gold accent points */}
          <circle cx="12" cy="6" r="1.5" fill="#D97706" />
        </pattern>
        <rect width="100%" height="12" fill="url(#gorgaIponIpon)" />
      </svg>
    </div>
  );
};

/**
 * GorgaMedal: Badge Peringkat Adat Batak (Juara 1, 2, 3)
 * Menggantikan emoji 🥇, 🥈, 🥉 dengan medali berukir geometris modern.
 */
export const GorgaMedal: React.FC<{ rank: 1 | 2 | 3; size?: number }> = ({ rank, size = 32 }) => {
  const configs = {
    1: {
      border: '#D97706',
      fill: '#B45309',
      ribbon: '#991B1B',
      accent: '#FDE68A',
      label: '1'
    },
    2: {
      border: '#9CA3AF',
      fill: '#4B5563',
      ribbon: '#1F2937',
      accent: '#E5E7EB',
      label: '2'
    },
    3: {
      border: '#B45309',
      fill: '#78350F',
      ribbon: '#374151',
      accent: '#FED7AA',
      label: '3'
    }
  };

  const c = configs[rank];

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ribbon */}
      <path d="M14 2L8 16L16 14L14 2Z" fill={c.ribbon} />
      <path d="M26 2L32 16L24 14L26 2Z" fill={c.ribbon} />
      {/* Medal Body */}
      <circle cx="20" cy="22" r="14" fill={c.fill} stroke={c.border} strokeWidth="2.5" />
      <circle cx="20" cy="22" r="11" fill="none" stroke={c.accent} strokeWidth="1" strokeDasharray="2 2" />
      {/* Rank Number */}
      <text
        x="20"
        y="26.5"
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
        fill="#FFFFFF"
      >
        {c.label}
      </text>
    </svg>
  );
};
