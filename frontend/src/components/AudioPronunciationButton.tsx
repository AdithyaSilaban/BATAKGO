import React, { useState } from 'react';
import { Volume2, Volume1, Mic, CheckCircle2, AlertCircle } from 'lucide-react';
import { speakBatakWord, playHasapiPluck, calculatePronunciationAccuracy } from '../utils/audioSynthesizer';

interface AudioPronunciationButtonProps {
  text: string;
  phonetic?: string;
  syllables?: string[];
  size?: 'sm' | 'md' | 'lg';
  showSlowOption?: boolean;
  allowPractice?: boolean;
  className?: string;
}

export const AudioPronunciationButton: React.FC<AudioPronunciationButtonProps> = ({
  text,
  phonetic,
  syllables,
  size = 'md',
  showSlowOption = true,
  allowPractice = false,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechResult, setSpeechResult] = useState<{
    transcript: string;
    accuracy: number;
  } | null>(null);

  const handlePlay = (playbackSpeed: number) => {
    setIsPlaying(true);
    setSpeed(playbackSpeed);
    playHasapiPluck(playbackSpeed === 1.0 ? 580 : 440);
    speakBatakWord(text, {
      speed: playbackSpeed,
      onEnd: () => setIsPlaying(false)
    });
  };

  const handleVoicePractice = () => {
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      alert('Browser Anda belum mendukung input suara Web Speech API. Silakan coba di Chrome atau Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'id-ID';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);
      setSpeechResult(null);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const accuracy = calculatePronunciationAccuracy(transcript, text);
        setSpeechResult({ transcript, accuracy });
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const btnSizes = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-sm',
    lg: 'p-3.5 text-base'
  };

  const iconSizes = {
    sm: 15,
    md: 18,
    lg: 22
  };

  return (
    <div className={`inline-flex flex-col gap-1.5 ${className}`}>
      <div className="inline-flex items-center gap-1.5">
        {/* Normal Speed Audio */}
        <button
          type="button"
          onClick={() => handlePlay(1.0)}
          disabled={isPlaying}
          aria-label={`Dengarkan pelafalan ${text}`}
          title="Dengarkan pelafalan asli (Kecepatan Normal)"
          className={`inline-flex items-center gap-1.5 font-bold rounded-xl border-2 border-amber-600 bg-amber-500 text-white shadow-[0_3px_0_0_#b45309] hover:bg-amber-400 active:translate-y-0.5 active:shadow-[0_1px_0_0_#b45309] transition-all cursor-pointer ${btnSizes[size]} ${
            isPlaying && speed === 1.0 ? 'ring-2 ring-amber-300 animate-pulse' : ''
          }`}
        >
          <Volume2 size={iconSizes[size]} className={isPlaying && speed === 1.0 ? 'animate-bounce' : ''} />
          <span className="hidden sm:inline">Dengar</span>
        </button>

        {/* Slow Speed Audio (Duolingo Turtle style) */}
        {showSlowOption && (
          <button
            type="button"
            onClick={() => handlePlay(0.6)}
            disabled={isPlaying}
            aria-label={`Dengarkan pelafalan pelan ${text}`}
            title="Dengarkan pelafalan lambat suku kata"
            className={`inline-flex items-center gap-1 font-bold rounded-xl border-2 border-stone-300 bg-white text-stone-700 shadow-[0_3px_0_0_#d6d3d1] hover:bg-stone-50 active:translate-y-0.5 active:shadow-[0_1px_0_0_#d6d3d1] transition-all cursor-pointer ${btnSizes[size]} ${
              isPlaying && speed === 0.6 ? 'ring-2 ring-stone-400 animate-pulse' : ''
            }`}
          >
            <Volume1 size={iconSizes[size]} className="text-amber-600" />
            <span className="text-xs">Pelan (0.6x)</span>
          </button>
        )}

        {/* Voice Practice */}
        {allowPractice && (
          <button
            type="button"
            onClick={handleVoicePractice}
            disabled={isRecording}
            aria-label={`Latihan pelafalan suara ${text}`}
            title="Uji pelafalan suara Anda lewat mikrofon"
            className={`inline-flex items-center gap-1 font-bold rounded-xl border-2 transition-all cursor-pointer ${btnSizes[size]} ${
              isRecording
                ? 'border-red-600 bg-red-500 text-white animate-pulse'
                : 'border-emerald-600 bg-emerald-500 text-white shadow-[0_3px_0_0_#047857] hover:bg-emerald-400 active:translate-y-0.5 active:shadow-[0_1px_0_0_#047857]'
            }`}
          >
            <Mic size={iconSizes[size]} className={isRecording ? 'animate-spin' : ''} />
            <span className="text-xs">{isRecording ? 'Mendengarkan...' : 'Ucapkan'}</span>
          </button>
        )}
      </div>

      {/* Syllable Breakdown Guide */}
      {syllables && syllables.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-stone-600 font-medium">
          <span className="text-stone-400">Pengejaan:</span>
          <div className="flex items-center gap-1">
            {syllables.map((syl, idx) => (
              <span
                key={idx}
                className="bg-stone-100 hover:bg-amber-100 text-stone-800 px-1.5 py-0.5 rounded border border-stone-200 transition-colors"
              >
                {syl}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Spoken result accuracy feedback */}
      {speechResult && (
        <div className={`mt-1 p-2 rounded-xl border text-xs flex items-center justify-between gap-2 ${
          speechResult.accuracy >= 75
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
            : 'bg-amber-50 border-amber-300 text-amber-800'
        }`}>
          <div className="flex items-center gap-1.5">
            {speechResult.accuracy >= 75 ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
            )}
            <div>
              <p className="font-bold">
                {speechResult.accuracy >= 75 ? 'Pelafalan Tepat (Sintong)' : 'Bisa Diulang Lagi'}
              </p>
              <p className="text-[11px] text-stone-500">
                Terdeteksi: &ldquo;{speechResult.transcript}&rdquo;
              </p>
            </div>
          </div>
          <span className="font-extrabold text-sm px-2 py-0.5 rounded-lg bg-white/80 border">
            {speechResult.accuracy}%
          </span>
        </div>
      )}
    </div>
  );
};
