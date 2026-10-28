import React, { useEffect, useRef, useState, useCallback } from 'react';
import { playHasapiPluck, playOgungGong, playGordangBeat, speakBatakWord } from '../utils/audioSynthesizer';
import { ArrowUp, Hand, Music, Sparkles } from 'lucide-react';

interface Mascot3DProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  interactive?: boolean;
  followMouse?: boolean;
  speech?: string;
  subSpeech?: string;
  onAction?: (actionName: string) => void;
}

const BATAK_PHRASES = [
  { text: 'Horas! Las hian rohangku mangida ho!', trans: 'Senang sekali hatiku bertemu denganmu!' },
  { text: 'Ahu ma Gale, marparange songon Sigale-gale!', trans: 'Aku Gale, menari seperti boneka Sigale-gale!' },
  { text: 'Tapungka ma manortor rap dohot ahu!', trans: 'Ayo menari tor-tor bersamaku!' },
  { text: 'Ulos na hupangke on ima Ulos Batak asli!', trans: 'Ulos ungu yang kupakai adalah tenunan khas Batak!' },
  { text: 'Unang lupa marsiajar hata Batak ari on!', trans: 'Jangan lupa belajar bahasa Batak hari ini ya!' }
];

export const Mascot3D: React.FC<Mascot3DProps> = ({
  className = '',
  width = '100%',
  height = 320,
  interactive = true,
  followMouse = true,
  speech = 'Horas! Ahu Gale, maskot BatakGO!',
  subSpeech = "Klik 'Lompat', 'Sapa', atau 'Manortor' untuk melihat tarianku!",
  onAction
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(speech);
  const [activeSubSpeech, setActiveSubSpeech] = useState<string | null>(subSpeech);
  const [speechVisible, setSpeechVisible] = useState(true);
  const [currentAction, setCurrentAction] = useState<'idle' | 'jump' | 'wave' | 'tor-tor'>('idle');
  const [jumpStage, setJumpStage] = useState<'anticipate' | 'air' | 'land' | 'none'>('none');
  const [spinDeg, setSpinDeg] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPuppetStrings, setShowPuppetStrings] = useState(true);
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);

  // Smooth mouse tracking for head and perspective
  const [mouseLook, setMouseLook] = useState({
    headAngle: 0,
    headTilt: 0,
    headX: 0,
    headY: 0,
    bodyTiltY: 0,
    bodyTiltX: 0,
    shadowOffset: 0
  });

  // Keep external speech prop in sync
  useEffect(() => {
    if (speech) {
      setActiveSpeech(speech);
      setActiveSubSpeech(subSpeech);
      setSpeechVisible(true);
    }
  }, [speech, subSpeech]);

  // 1. Mouse Tracking with Smooth Lerp
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

      const boundX = Math.max(window.innerWidth * 0.45, 300);
      const boundY = Math.max(window.innerHeight * 0.45, 240);

      targetX = Math.max(-1, Math.min(1, dx / boundX));
      targetY = Math.max(-1, Math.min(1, dy / boundY));
    };

    const animate = () => {
      curX += (targetX - curX) * 0.14;
      curY += (targetY - curY) * 0.14;

      setMouseLook({
        headAngle: curX * 12,
        headTilt: -curY * 8,
        headX: curX * 6,
        headY: curY * 4,
        bodyTiltY: curX * 10,
        bodyTiltX: -curY * 6,
        shadowOffset: -curX * 14
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

  // Helper: Floating reaction sparkles
  const spawnSparkles = useCallback((emoji: string = '✨', count = 4) => {
    const newSparks = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 90,
      y: -20 - Math.random() * 45,
      emoji
    }));
    setSparks(prev => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks(prev => prev.filter(s => !newSparks.some(ns => ns.id === s.id)));
    }, 1200);
  }, []);

  // 2. Action: Jump (Squash & Stretch Physics)
  const handleJump = useCallback(() => {
    if (currentAction !== 'idle') return;
    setCurrentAction('jump');
    playHasapiPluck(540);
    spawnSparkles('⭐', 5);
    setActiveSpeech('Horas! Las hian rohangku!');
    setActiveSubSpeech('Lompat gembira!');
    setSpeechVisible(true);
    if (onAction) onAction('jump');

    setJumpStage('anticipate');
    setTimeout(() => {
      setJumpStage('air');
      playHasapiPluck(660);
      setTimeout(() => {
        setJumpStage('land');
        playHasapiPluck(440);
        setTimeout(() => {
          setJumpStage('none');
          setCurrentAction('idle');
        }, 180);
      }, 380);
    }, 120);
  }, [currentAction, onAction, spawnSparkles]);

  // 3. Action: Sapa (Melambaikan Tangan & Suara Batak)
  const handleWave = useCallback(() => {
    if (currentAction !== 'idle') return;
    setCurrentAction('wave');
    playHasapiPluck(500);
    spawnSparkles('👋', 4);
    speakBatakWord('Horas ma di hita saluhutna!');
    setActiveSpeech('Horas ma di hita saluhutna!');
    setActiveSubSpeech('Salam hangat khas Batak!');
    setSpeechVisible(true);
    if (onAction) onAction('wave');

    setTimeout(() => {
      setCurrentAction('idle');
    }, 1500);
  }, [currentAction, onAction, spawnSparkles]);

  // 4. Action: Manortor (Batak Tor-tor Dance & Gong)
  const handleManortor = useCallback(() => {
    if (currentAction !== 'idle') return;
    setCurrentAction('tor-tor');
    playOgungGong();
    setTimeout(() => playGordangBeat(), 350);
    setTimeout(() => playGordangBeat(), 800);
    setTimeout(() => playOgungGong(), 1250);
    spawnSparkles('🎶', 6);

    const randomPhrase = BATAK_PHRASES[Math.floor(Math.random() * BATAK_PHRASES.length)];
    setActiveSpeech('Ole-ole! Tapungka ma manortor!');
    setActiveSubSpeech(randomPhrase.trans);
    setSpeechVisible(true);
    if (onAction) onAction('tor-tor');

    setIsSpinning(true);
    setSpinDeg(prev => prev + 360);

    setTimeout(() => {
      setIsSpinning(false);
      setCurrentAction('idle');
    }, 1800);
  }, [currentAction, onAction, spawnSparkles]);

  // 5. Interactive Mascot Part Click
  const handlePartClick = (part: 'head' | 'torso' | 'arm') => {
    if (currentAction !== 'idle') return;
    playHasapiPluck(part === 'head' ? 620 : (part === 'torso' ? 480 : 540));
    spawnSparkles(part === 'head' ? '✨' : (part === 'torso' ? '💜' : '👍'), 3);
    const phrase = BATAK_PHRASES[Math.floor(Math.random() * BATAK_PHRASES.length)];
    setActiveSpeech(phrase.text);
    setActiveSubSpeech(phrase.trans);
    setSpeechVisible(true);
  };

  // Base dynamic offsets for full-body root
  const getRootTransform = () => {
    let transY = 0;
    let scaleX = 1;
    let scaleY = 1;

    if (currentAction === 'jump') {
      if (jumpStage === 'anticipate') {
        transY = 14;
        scaleX = 1.15;
        scaleY = 0.85;
      } else if (jumpStage === 'air') {
        transY = -58;
        scaleX = 0.92;
        scaleY = 1.14;
      } else if (jumpStage === 'land') {
        transY = 10;
        scaleX = 1.18;
        scaleY = 0.82;
      }
    }

    return {
      transform: `
        translate3d(0px, ${transY}px, 0px)
        rotateY(${mouseLook.bodyTiltY + spinDeg}deg)
        rotateX(${mouseLook.bodyTiltX}deg)
        scale(${scaleX}, ${scaleY})
      `,
      transition: isSpinning
        ? 'transform 1.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        : (currentAction === 'jump'
          ? (jumpStage === 'air' ? 'transform 0.38s cubic-bezier(0.18, 0.89, 0.32, 1.25)' : 'transform 0.12s ease-out')
          : 'transform 0.1s ease-out')
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center select-none ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        perspective: '1000px'
      }}
    >
      {/* Floating Cultural Speech Bubble */}
      {speechVisible && activeSpeech && (
        <div
          onClick={() => setSpeechVisible(false)}
          className="absolute -top-16 z-50 bg-[#1E1A17] text-[#F4EDE0] border-2 border-[#D9A21B] rounded-2xl px-3.5 py-2 max-w-[250px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 cursor-pointer pointer-events-auto"
        >
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🎭</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D9A21B]">
                Gale Si Sigale-gale
              </span>
            </div>
            <span className="text-[9px] text-[#A69B88]">klik tutup</span>
          </div>
          <p className="font-heading font-black text-xs sm:text-sm text-white leading-tight">
            {activeSpeech}
          </p>
          {activeSubSpeech && (
            <p className="text-[10px] text-[#E8DFC8] mt-0.5 italic">
              {activeSubSpeech}
            </p>
          )}

          {/* Speech bubble arrow pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#D9A21B]" />
        </div>
      )}

      {/* Floating Reaction Sparks */}
      {sparks.map(spark => (
        <span
          key={spark.id}
          className="absolute text-xl pointer-events-none animate-bounce z-50 transition-all duration-1000"
          style={{
            top: '35%',
            left: `calc(50% + ${spark.x}px)`,
            transform: `translateY(${spark.y}px)`,
            opacity: 0.95
          }}
        >
          {spark.emoji}
        </span>
      ))}

      {/* Main Interactive Stage Area */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group w-full"
        onClick={handleJump}
        title="Klik maskot untuk melompat atau klik bagian tubuhnya!"
      >
        {/* Puppet String Canvas (Overhead strings connecting to Sigale-gale wooden doll) */}
        {showPuppetStrings && (
          <svg
            className="absolute top-0 w-44 sm:w-52 h-44 pointer-events-none z-30 opacity-40 transition-opacity duration-300"
            viewBox="0 0 520 400"
          >
            {/* Crossbar controller */}
            <line x1="160" y1="10" x2="360" y2="10" stroke="#8A6740" strokeWidth="6" strokeLinecap="round" />
            <line x1="260" y1="0" x2="260" y2="20" stroke="#8A6740" strokeWidth="6" strokeLinecap="round" />
            {/* String to Left Hand */}
            <line
              x1="180"
              y1="10"
              x2="70"
              y2="280"
              stroke="#D9A21B"
              strokeWidth="2"
              strokeDasharray="4 3"
              className={currentAction === 'tor-tor' ? 'animate-pulse' : ''}
            />
            {/* String to Head */}
            <line
              x1="260"
              y1="10"
              x2="260"
              y2="80"
              stroke="#D9A21B"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* String to Right Hand */}
            <line
              x1="340"
              y1="10"
              x2="450"
              y2="280"
              stroke="#D9A21B"
              strokeWidth="2"
              strokeDasharray="4 3"
              className={currentAction === 'tor-tor' ? 'animate-pulse' : ''}
            />
          </svg>
        )}

        {/* 
          ARTICULATED 2D MARIONETTE BODY
          Rendered using the 5 parts sliced from the authentic BatakGO pixel art:
          1. LEGS (120, 530, 266x141) - Hip pivot (50% 5%)
          2. TORSO (120, 315, 280x236) with authentic purple Ulos - Waist pivot (50% 90%)
          3. LEFT ARM (0, 219, 146x205) - Shoulder pivot (88% 90%)
          4. RIGHT ARM (375, 245, 145x195) - Shoulder pivot (12% 90%)
          5. HEAD (75, 0, 370x339) with Batak turban & smiling face - Neck pivot (50% 95%)
        */}
        <div
          className="relative w-44 sm:w-52 aspect-[520/671] flex-shrink-0"
          style={getRootTransform()}
        >
          {/* 1. LEGS LAYER (Z-INDEX 10) */}
          <div
            onClick={(e) => { e.stopPropagation(); handleJump(); }}
            className={`absolute ${
              currentAction === 'tor-tor'
                ? 'animate-legs-tortor'
                : (currentAction === 'jump' && jumpStage === 'anticipate' ? 'scale-y-75' : '')
            }`}
            style={{
              left: '23.077%',
              top: '78.987%',
              width: '51.154%',
              height: '21.013%',
              transformOrigin: '50% 5%',
              zIndex: 10
            }}
          >
            <img
              src="/assets/mascot/parts/legs.png"
              alt="Kaki Gale"
              className="w-full h-full object-contain pointer-events-none"
              style={{ imageRendering: 'pixelated' }}
              draggable={false}
            />
          </div>

          {/* 2. TORSO & ULOS LAYER (Z-INDEX 20) */}
          <div
            onClick={(e) => { e.stopPropagation(); handlePartClick('torso'); }}
            className={`absolute ${
              currentAction === 'tor-tor'
                ? 'animate-torso-tortor'
                : (currentAction === 'wave' ? 'animate-torso-wave' : 'animate-torso-breathe')
            }`}
            style={{
              left: '23.077%',
              top: '46.945%',
              width: '53.846%',
              height: '35.171%',
              transformOrigin: '50% 90%',
              zIndex: 20
            }}
            title="Klik Ulos untuk berinteraksi!"
          >
            <img
              src="/assets/mascot/parts/torso.png"
              alt="Badan Gale & Ulos Ungu"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
              style={{ imageRendering: 'pixelated' }}
              draggable={false}
            />
          </div>

          {/* 3. LEFT ARM LAYER (VIEWER'S LEFT - Z-INDEX 30) */}
          <div
            onClick={(e) => { e.stopPropagation(); handlePartClick('arm'); }}
            className={`absolute ${
              currentAction === 'tor-tor'
                ? 'animate-left-arm-tortor'
                : (currentAction === 'wave' ? 'animate-left-arm-pump' : (currentAction === 'jump' ? 'animate-arm-jump-left' : 'animate-left-arm-idle'))
            }`}
            style={{
              left: '0%',
              top: '32.638%',
              width: '28.077%',
              height: '30.551%',
              transformOrigin: '88% 90%',
              zIndex: 30
            }}
            title="Lengan Kiri Gale"
          >
            <img
              src="/assets/mascot/parts/left_arm.png"
              alt="Lengan Kiri Gale"
              className="w-full h-full object-contain pointer-events-none"
              style={{ imageRendering: 'pixelated' }}
              draggable={false}
            />
          </div>

          {/* 4. RIGHT ARM LAYER (VIEWER'S RIGHT - Z-INDEX 30) */}
          <div
            onClick={(e) => { e.stopPropagation(); handlePartClick('arm'); }}
            className={`absolute ${
              currentAction === 'tor-tor'
                ? 'animate-right-arm-tortor'
                : (currentAction === 'wave' ? 'animate-right-arm-wave' : (currentAction === 'jump' ? 'animate-arm-jump-right' : 'animate-right-arm-idle'))
            }`}
            style={{
              left: '72.115%',
              top: '36.513%',
              width: '27.885%',
              height: '29.061%',
              transformOrigin: '12% 90%',
              zIndex: 30
            }}
            title="Lengan Kanan Gale"
          >
            <img
              src="/assets/mascot/parts/right_arm.png"
              alt="Lengan Kanan Gale"
              className="w-full h-full object-contain pointer-events-none"
              style={{ imageRendering: 'pixelated' }}
              draggable={false}
            />
          </div>

          {/* 5. HEAD & TURBAN LAYER (Z-INDEX 40) */}
          <div
            onClick={(e) => { e.stopPropagation(); handlePartClick('head'); }}
            className={`absolute ${
              currentAction === 'tor-tor'
                ? 'animate-head-tortor'
                : (currentAction === 'wave' ? 'animate-head-wave' : 'animate-head-idle')
            }`}
            style={{
              left: '14.423%',
              top: '0%',
              width: '71.154%',
              height: '50.522%',
              transformOrigin: '50% 95%',
              transform: `
                translate3d(${mouseLook.headX}px, ${mouseLook.headY}px, 0px)
                rotate(${mouseLook.headAngle}deg)
                rotateX(${mouseLook.headTilt}deg)
              `,
              transition: 'transform 0.08s ease-out',
              zIndex: 40
            }}
            title="Klik Kepala Gale untuk menyapa!"
          >
            <img
              src="/assets/mascot/parts/head.png"
              alt="Kepala Gale & Tali Sortali"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_6px_14px_rgba(0,0,0,0.3)]"
              style={{ imageRendering: 'pixelated' }}
              draggable={false}
            />
          </div>
        </div>

        {/* Dynamic Ground Shadow */}
        <div
          className="w-28 sm:w-32 h-4.5 bg-black/35 rounded-full blur-[3px] transition-all duration-200 mt-2 pointer-events-none"
          style={{
            transform: `
              translateX(${mouseLook.shadowOffset}px)
              scale(${currentAction === 'jump' && jumpStage === 'air' ? 0.45 : (jumpStage === 'land' ? 1.3 : 1)})
            `,
            opacity: currentAction === 'jump' && jumpStage === 'air' ? 0.15 : 0.40
          }}
        />
      </div>

      {/* Action Control Buttons (Lompat, Sapa, Manortor 360°, Tali Puppet) */}
      {interactive && (
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 bg-[#FAF6EE] border-2 border-[#1E1A17] px-3 py-1.5 rounded-full shadow-lg z-30 pointer-events-auto">
          {/* 1. Lompat Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleJump();
            }}
            className="px-2.5 py-1 rounded-full bg-[#A62B1F] hover:bg-[#852218] text-[#F4EDE0] font-black text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all active:scale-90 cursor-pointer shadow-xs"
            title="Lompat Gembira (Hasapi Pluck)"
          >
            <ArrowUp size={12} />
            <span>Lompat</span>
          </button>

          {/* 2. Sapa Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleWave();
            }}
            className="px-2.5 py-1 rounded-full bg-[#23365A] hover:bg-[#182640] text-[#F4EDE0] font-black text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all active:scale-90 cursor-pointer shadow-xs"
            title="Melambaikan Tangan & Suara Batak"
          >
            <Hand size={12} />
            <span>Sapa</span>
          </button>

          {/* 3. Manortor 360° Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleManortor();
            }}
            className="px-2.5 py-1 rounded-full bg-[#D9A21B] hover:bg-[#B88610] text-[#1E1A17] font-black text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all active:scale-90 cursor-pointer shadow-xs"
            title="Tarian Tor-tor Batak & Ogung Gong"
          >
            <Music size={12} />
            <span>Manortor 360°</span>
          </button>

          {/* 4. Puppet Strings Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowPuppetStrings(prev => !prev);
              playHasapiPluck(showPuppetStrings ? 380 : 580);
            }}
            className={`px-2 py-1 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all active:scale-90 cursor-pointer ${
              showPuppetStrings
                ? 'bg-[#4A3B32] text-[#F4EDE0]'
                : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
            }`}
            title="Toggle Tali Pengendali Boneka Sigale-gale"
          >
            <Sparkles size={11} />
            <span className="hidden sm:inline">{showPuppetStrings ? 'Tali On' : 'Tali Off'}</span>
          </button>
        </div>
      )}

      {/* Embedded CSS Keyframe Animations for Articulated Movement */}
      <style>{`
        /* --- IDLE ANIMATIONS --- */
        @keyframes headIdle {
          0%, 100% { transform: rotate(0deg) translateY(0px); }
          50% { transform: rotate(2deg) translateY(-2px); }
        }
        .animate-head-idle {
          animation: headIdle 2.8s ease-in-out infinite;
        }

        @keyframes torsoBreathe {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.015, 1.025); }
        }
        .animate-torso-breathe {
          animation: torsoBreathe 2.8s ease-in-out infinite;
        }

        @keyframes leftArmIdle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(4deg); }
        }
        .animate-left-arm-idle {
          animation: leftArmIdle 2.8s ease-in-out infinite;
        }

        @keyframes rightArmIdle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-4deg); }
        }
        .animate-right-arm-idle {
          animation: rightArmIdle 2.8s ease-in-out infinite;
        }

        /* --- MANORTOR (TOR-TOR BATAK DANCE) --- */
        @keyframes leftArmTorTor {
          0%, 100% { transform: rotate(-25deg); }
          50% { transform: rotate(15deg); }
        }
        .animate-left-arm-tortor {
          animation: leftArmTorTor 0.7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        @keyframes rightArmTorTor {
          0%, 100% { transform: rotate(15deg); }
          50% { transform: rotate(-25deg); }
        }
        .animate-right-arm-tortor {
          animation: rightArmTorTor 0.7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        @keyframes torsoTorTor {
          0%, 100% { transform: rotate(-3.5deg) translateY(-2px); }
          50% { transform: rotate(3.5deg) translateY(0px); }
        }
        .animate-torso-tortor {
          animation: torsoTorTor 0.7s ease-in-out infinite;
        }

        @keyframes headTorTor {
          0%, 100% { transform: rotate(4deg) translateY(0px); }
          50% { transform: rotate(-4deg) translateY(-3px); }
        }
        .animate-head-tortor {
          animation: headTorTor 0.7s ease-in-out infinite;
        }

        @keyframes legsTorTor {
          0%, 100% { transform: scaleY(1); }
          25% { transform: scaleY(0.95) translateY(2px); }
          75% { transform: scaleY(0.95) translateY(2px); }
        }
        .animate-legs-tortor {
          animation: legsTorTor 0.7s ease-in-out infinite;
        }

        /* --- SAPA (WAVE) --- */
        @keyframes rightArmWave {
          0%, 100% { transform: rotate(-45deg); }
          50% { transform: rotate(-10deg); }
        }
        .animate-right-arm-wave {
          animation: rightArmWave 0.28s ease-in-out infinite;
        }

        @keyframes leftArmPump {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(14deg); }
        }
        .animate-left-arm-pump {
          animation: leftArmPump 0.56s ease-in-out infinite;
        }

        @keyframes headWave {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-head-wave {
          animation: headWave 0.56s ease-in-out infinite;
        }

        @keyframes torsoWave {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-torso-wave {
          animation: torsoWave 0.56s ease-in-out infinite;
        }

        /* --- JUMP POSES --- */
        .animate-arm-jump-left {
          transform: rotate(-40deg) !important;
          transition: transform 0.2s ease-out;
        }
        .animate-arm-jump-right {
          transform: rotate(40deg) !important;
          transition: transform 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
