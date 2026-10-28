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
        <div className="relative bg-[#F4EDE0] border-[1.5px] border-[#1E1A17] rounded-[4px] p-3 text-[#1E1A17] max-w-xs animate-in fade-in zoom-in-95 duration-150">
          <p className={`font-heading font-bold text-[#1E1A17] tracking-tight leading-tight ${sizeConfig.bubbleText}`}>
            {speech}
          </p>
          {subSpeech && (
            <p className="text-xs text-[#1E1A17]/75 mt-1 font-body italic">
              {subSpeech}
            </p>
          )}
          {/* Speech bubble tail pointing to mascot */}
          <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[10px] border-l-[#1E1A17]" />
          <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-[#F4EDE0]" />
        </div>
      )}

      {/* Mascot Avatar Container */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={interactive ? handleClick : undefined}
          title={`Sigale-gale (${config.label} - ${config.batakTerm})`}
          aria-label={`Sigale-gale (${config.label} - ${config.batakTerm})`}
          className={`relative overflow-hidden rounded-[4px] border-[1.5px] border-[#1E1A17] bg-[#EADBCE] border-b-[3px] border-b-[#1E1A17] transition-transform ${sizeConfig.container} ${
            interactive ? 'cursor-pointer hover:scale-105 active:translate-y-[2px]' : ''
          } ${bounce ? 'animate-bounce' : ''}`}
        >
          {/* Pixel-art sprite rendering of Sigale-gale */}
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url('/assets/mascot/sigale-gale.jpeg')`,
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
          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-[#1E1A17] bg-[#EADBCE] px-2 py-0.5 rounded-[4px] border border-[#1E1A17]">
            <span>{config.label}</span>
            <span className="text-[#1E1A17]/40">|</span>
            <span className="text-[#A62B1F] italic">{config.batakTerm}</span>
          </div>
        )}
      </div>
    </div>
  );
};
