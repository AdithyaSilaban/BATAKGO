import React, { useState, useEffect, useRef } from 'react';
import { playHasapiPluck, speakBatakWord } from '../utils/audioSynthesizer';

export type MascotMood = 'happy' | 'sad' | 'thinking' | 'angry' | 'idle';
export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | 'path';

interface MascotProps {
  mood?: MascotMood;
  size?: MascotSize;
  speech?: string;
  subSpeech?: string;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  showStatusLabel?: boolean;
  followMouse?: boolean;
}

const MOOD_INFO: Record<MascotMood, {
  label: string;
  batakTerm: string;
  greeting: string;
  badge: string;
}> = {
  happy: {
    label: 'Senang',
    batakTerm: 'Las Roha',
    greeting: 'Horas! Las hian rohangku mangajari ho!',
    badge: '✨'
  },
  idle: {
    label: 'Semangat',
    batakTerm: 'Marsiurupan',
    greeting: 'Horas ma di hita saluhutna! Tapungka ma parsiajaranta.',
    badge: '👋'
  },
  angry: {
    label: 'Kesal',
    batakTerm: 'Muruk',
    greeting: 'Eee tahe! Unang mandele, parsiajari muse!',
    badge: '⚡'
  },
  sad: {
    label: 'Sedih',
    batakTerm: 'Marsak',
    greeting: 'Aha do sala? Boasa songon i, marsak rohangku.',
    badge: '💧'
  },
  thinking: {
    label: 'Berpikir',
    batakTerm: 'Marpingkir',
    greeting: 'Rimangi jolo denggan, ingot hatani ompunta!',
    badge: '💡'
  }
};

const MOOD_IMAGES: Record<MascotMood, string> = {
  happy: '/assets/mascot/mascot-happy.png',
  sad: '/assets/mascot/mascot-sad.png',
  thinking: '/assets/mascot/mascot-thinking.png',
  angry: '/assets/mascot/mascot-angry.png',
  idle: '/assets/mascot/mascot-happy.png'
};

const SIZE_STYLES: Record<MascotSize, { bubbleText: string; imgHeight: string; shadowWidth: string }> = {
  xs: { bubbleText: 'text-xs', imgHeight: 'h-11', shadowWidth: 'w-8' },
  sm: { bubbleText: 'text-xs', imgHeight: 'h-18', shadowWidth: 'w-14' },
  md: { bubbleText: 'text-sm', imgHeight: 'h-28', shadowWidth: 'w-20' },
  lg: { bubbleText: 'text-base', imgHeight: 'h-40', shadowWidth: 'w-28' },
  xl: { bubbleText: 'text-base', imgHeight: 'h-56', shadowWidth: 'w-36' },
  hero: { bubbleText: 'text-lg', imgHeight: 'h-72', shadowWidth: 'w-44' },
  path: { bubbleText: 'text-sm', imgHeight: 'h-48 sm:h-56', shadowWidth: 'w-32 sm:w-36' }
};

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 'md',
  speech,
  subSpeech,
  interactive = true,
  className = '',
  onClick,
  showStatusLabel = false,
  followMouse = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounce, setBounce] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(speech || null);
  const [activeSubSpeech, setActiveSubSpeech] = useState<string | null>(subSpeech || null);
  const [speechVisible, setSpeechVisible] = useState(Boolean(speech));

  // Transform states for mouse-tracking
  const [tracking, setTracking] = useState({
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    transX: 0,
    transY: 0,
    shadowX: 0,
    shadowScale: 1
  });

  const config = MOOD_INFO[mood] || MOOD_INFO.happy;
  const sizeConfig = SIZE_STYLES[size];

  // Mouse Tracking Animation Loop
  useEffect(() => {
    if (!followMouse) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Normalize with screen bounds
      const boundX = Math.max(window.innerWidth * 0.55, 380);
      const boundY = Math.max(window.innerHeight * 0.55, 280);

      targetX = Math.max(-1, Math.min(1, dx / boundX));
      targetY = Math.max(-1, Math.min(1, dy / boundY));
    };

    // Smooth Lerp loop
    const animate = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;

      setTracking({
        rotY: curX * 20, // Menoleh ke arah kursor kiri-kanan
        rotX: -curY * 14, // Miringkan badan atas-bawah
        rotZ: curX * 4, // Kemiringan kepala halus
        transX: curX * 12,
        transY: curY * 6,
        shadowX: -curX * 14,
        shadowScale: 1 - Math.abs(curY) * 0.12
      });

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [followMouse]);

  // Sync external speech prop
  useEffect(() => {
    if (speech) {
      setActiveSpeech(speech);
      setActiveSubSpeech(subSpeech || null);
      setSpeechVisible(true);
    }
  }, [speech, subSpeech]);

  const handleClick = () => {
    if (!interactive) return;

    setBounce(true);
    setTimeout(() => setBounce(false), 600);
    playHasapiPluck(520);

    // Speak greeting & show bubble
    const greetingText = activeSpeech || config.greeting;
    speakBatakWord(greetingText);

    if (!activeSpeech) {
      setActiveSpeech(config.greeting);
      setActiveSubSpeech(config.batakTerm);
      setSpeechVisible(true);
      setTimeout(() => setSpeechVisible(false), 4500);
    }

    if (onClick) onClick();
  };

  // Dynamic filter for moods
  const getMoodFilter = () => {
    switch (mood) {
      case 'angry':
        return 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.4))';
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center select-none ${className}`}
      style={{ perspective: '800px' }}
    >
      {/* Mascot 3D Layer with Mouse Tracking - Bebas Tanpa Kotak */}
      <div
        onClick={handleClick}
        className={`relative flex flex-col items-center cursor-pointer transition-transform duration-75 ${
          bounce ? 'animate-bounce' : ''
        }`}
        style={{
          transform: followMouse
            ? `translate3d(${tracking.transX}px, ${tracking.transY}px, 0px) rotateY(${tracking.rotY}deg) rotateX(${tracking.rotX}deg) rotateZ(${tracking.rotZ}deg)`
            : undefined,
          transformStyle: 'preserve-3d',
          transition: followMouse ? 'transform 0.08s ease-out' : 'transform 0.2s ease',
          filter: getMoodFilter()
        }}
        title={`Maskot BatakGO - ${config.label} (${config.batakTerm})`}
      >
        {/* Sprite Maskot Tegak & Transparan dengan Ekspresi Dinamis */}
        <img
          src={MOOD_IMAGES[mood] || '/assets/mascot/mascot-happy.png'}
          alt={`Maskot BatakGO - ${config.label}`}
          className={`${sizeConfig.imgHeight} w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-150`}
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
        />
      </div>

      {/* Bayangan Lantai Elips Melingkar (Floor Pedestal Shadow) */}
      <div
        className={`${sizeConfig.shadowWidth} h-3.5 bg-black/35 rounded-full blur-[2px] -mt-2 pointer-events-none transition-all duration-100`}
        style={{
          transform: followMouse
            ? `translateX(${tracking.shadowX}px) scale(${tracking.shadowScale})`
            : undefined
        }}
      />

      {/* Status Label (Opsional) */}
      {showStatusLabel && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#1E1A17] bg-[#E8DFC8] px-2.5 py-0.5 rounded-full border border-[#433D38] shadow-xs">
          <span>{config.label}</span>
          <span className="text-[#433D38]">•</span>
          <span className="text-[#A62B1F] italic">{config.batakTerm}</span>
        </div>
      )}
    </div>
  );
};
