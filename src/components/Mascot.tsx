import React, { useState } from 'react';
import { playHasapiPluck, speakBatakWord } from '../utils/audioSynthesizer';

export type MascotMood = 'happy' | 'sad' | 'thinking' | 'angry' | 'idle';
export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

interface MascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  speech?: string;
  subSpeech?: string;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  showStatusLabel?: boolean;
}

// Coordinate mapping in the 1408x768 image
// SENANG: x: 70..510, y: 40..660 (width: 440, height: 620)
// KESAL: x: 530..810, y: 320..710 (width: 280, height: 390)
// SEDIH: x: 770..1060, y: 40..650 (width: 290, height: 610)
// BERPIKIR: x: 1040..1350, y: 245..710 (width: 310, height: 465)

const MOOD_CROPS: Record<MascotMood, {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  label: string;
  batakTerm: string;
  greeting: string;
}> = {
  happy: {
    sx: 70,
    sy: 40,
    sWidth: 440,
    sHeight: 570,
    label: 'Senang',
    batakTerm: 'Las Roha',
    greeting: 'Horas! Las hian rohangku!'
  },
  idle: {
    sx: 70,
    sy: 40,
    sWidth: 440,
    sHeight: 570,
    label: 'Semangat',
    batakTerm: 'Marsiurupan',
    greeting: 'Horas ma di hita saluhutna!'
  },
  angry: {
    sx: 535,
    sy: 320,
    sWidth: 275,
    sHeight: 335,
    label: 'Kesal',
    batakTerm: 'Muruk',
    greeting: 'Eee tahe! Unang songon i, parsiajari muse!'
  },
  sad: {
    sx: 775,
    sy: 40,
    sWidth: 285,
    sHeight: 565,
    label: 'Sedih',
    batakTerm: 'Marsak',
    greeting: 'Aha do sala? Boasa songon i, marsak rohangku.'
  },
  thinking: {
    sx: 1040,
    sy: 245,
    sWidth: 310,
    sHeight: 415,
    label: 'Berpikir',
    batakTerm: 'Marpingkir',
    greeting: 'Rimangi jolo denggan, ingot hatani ompunta!'
  }
};

const SIZE_STYLES: Record<MascotSize, { container: string; bubbleText: string }> = {
  xs: { container: 'w-10 h-12', bubbleText: 'text-xs' },
  sm: { container: 'w-16 h-20', bubbleText: 'text-xs' },
  md: { container: 'w-24 h-28', bubbleText: 'text-sm' },
  lg: { container: 'w-36 h-44', bubbleText: 'text-base' },
  xl: { container: 'w-48 h-56', bubbleText: 'text-base' },
  hero: { container: 'w-64 h-72', bubbleText: 'text-lg' }
};

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  size = 'md',
  speech,
  subSpeech,
  interactive = true,
  className = '',
  onClick,
  showStatusLabel = false
}) => {
  const [bounce, setBounce] = useState(false);
  const activeMood = mood;
  const config = MOOD_CROPS[activeMood] || MOOD_CROPS.happy;
  const sizeConfig = SIZE_STYLES[size];

  // Image natural dimensions
  const imgWidth = 1408;
  const imgHeight = 768;

  // Calculate background scale and offsets for CSS background-image
  // scale = imgWidth / cropWidth
  const scaleX = (imgWidth / config.sWidth) * 100;
  const scaleY = (imgHeight / config.sHeight) * 100;
  const posX = (config.sx / (imgWidth - config.sWidth)) * 100;
  const posY = (config.sy / (imgHeight - config.sHeight)) * 100;

  const handleClick = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 500);
    playHasapiPluck(520);
    if (speech) {
      speakBatakWord(speech);
    } else {
      speakBatakWord(config.greeting);
    }
    if (onClick) onClick();
  };

  return (
    <div className={`relative flex items-center gap-3 select-none ${className}`}>
      {/* Speech Bubble */}
      {speech && (
        <div className="relative bg-white border-2 border-stone-800 rounded-2xl p-3 shadow-md text-stone-800 max-w-xs animate-in fade-in zoom-in-95 duration-200">
          <p className={`font-bold font-['Fredoka',sans-serif] leading-tight ${sizeConfig.bubbleText}`}>
            {speech}
          </p>
          {subSpeech && (
            <p className="text-xs text-stone-500 mt-1 font-medium italic">
              {subSpeech}
            </p>
          )}
          {/* Speech bubble tail pointing to mascot */}
          <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[10px] border-l-stone-800" />
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-white" />
        </div>
      )}

      {/* Mascot Avatar Container */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={interactive ? handleClick : undefined}
          title={`Sigale-gale (${config.label} - ${config.batakTerm})`}
          aria-label={`Sigale-gale (${config.label} - ${config.batakTerm})`}
          className={`relative overflow-hidden rounded-2xl border-2 border-stone-800 bg-[#E8DDD0] shadow-[0_4px_0_0_#292524] transition-transform ${sizeConfig.container} ${
            interactive ? 'cursor-pointer hover:scale-105 active:scale-95 active:shadow-[0_1px_0_0_#292524]' : ''
          } ${bounce ? 'animate-bounce' : ''}`}
        >
          {/* Pixel-art sprite rendering of Sigale-gale wearing Ulos */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/assets/aistudio/WhatsApp_Image_2026-10-21_at_15.25.16_81cfe09c.jpeg')`,
              backgroundSize: `${scaleX}% ${scaleY}%`,
              backgroundPosition: `${posX}% ${posY}%`,
              imageRendering: 'pixelated',
              backgroundRepeat: 'no-repeat'
            }}
          />

          {/* Micro indicator badge */}
          {activeMood === 'happy' && (
            <span className="absolute top-1 right-1 text-[11px] animate-pulse" aria-hidden="true">
              ✨
            </span>
          )}
          {activeMood === 'sad' && (
            <span className="absolute top-1 right-1 text-[11px]" aria-hidden="true">
              💧
            </span>
          )}
          {activeMood === 'thinking' && (
            <span className="absolute top-1 right-1 text-[11px]" aria-hidden="true">
              💡
            </span>
          )}
          {activeMood === 'angry' && (
            <span className="absolute top-1 right-1 text-[11px]" aria-hidden="true">
              ⚡
            </span>
          )}
        </button>

        {showStatusLabel && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-stone-700 bg-stone-200/90 px-2 py-0.5 rounded-full border border-stone-300">
            <span>{config.label}</span>
            <span className="text-stone-400">|</span>
            <span className="text-red-700 italic">{config.batakTerm}</span>
          </div>
        )}
      </div>
    </div>
  );
};
