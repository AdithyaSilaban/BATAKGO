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
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <div className={`inline-flex flex-col gap-1.5 font-body ${className}`}>
      <div className="inline-flex items-center gap-1.5">
        {/* Normal Speed Audio (Indigo: Radius 4px, Tepi Bawah 3px Lebih Gelap) */}
        <button
          type="button"
          onClick={() => handlePlay(1.0)}
          disabled={isPlaying}
          aria-label={`Dengarkan pelafalan ${text}`}
          title="Dengarkan pelafalan asli (Kecepatan Normal)"
          className={`btn-indigo ${btnSizes[size]}`}
        >
          <Volume2 size={iconSizes[size]} className="mr-1" />
          <span>Dengar</span>
        </button>

        {/* Slow Speed Audio */}
        {showSlowOption && (
          <button
            type="button"
            onClick={() => handlePlay(0.6)}
            disabled={isPlaying}
            aria-label={`Dengarkan pelafalan pelan ${text}`}
            title="Dengarkan pelafalan lambat suku kata"
            className={`btn-outline-arang ${btnSizes[size]}`}
          >
            <Volume1 size={iconSizes[size]} className="text-[#A62B1F] mr-1" />
            <span className="text-xs">0.6x</span>
          </button>
        )}

        {/* Voice Practice (Secang) */}
        {allowPractice && (
          <button
            type="button"
            onClick={handleVoicePractice}
            disabled={isRecording}
            aria-label={`Latihan pelafalan suara ${text}`}
            title="Uji pelafalan suara Anda lewat mikrofon"
            className={`btn-secang ${btnSizes[size]}`}
          >
            <Mic size={iconSizes[size]} className="mr-1" />
            <span className="text-xs">{isRecording ? 'Mendengarkan...' : 'Ucapkan'}</span>
          </button>
        )}
      </div>

      {/* Syllable Breakdown Guide */}
      {syllables && syllables.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-[#433D38] font-medium">
          <span className="text-[#433D38]">Pengejaan:</span>
          <div className="flex items-center gap-1">
            {syllables.map((syl, idx) => (
              <span
                key={idx}
                className="bg-[#E8DFC8] text-[#1E1A17] px-1.5 py-0.5 rounded-[2px] border border-[#1E1A17] font-semibold text-[11px]"
              >
                {syl}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Spoken result accuracy feedback (Selalu Ikon + Teks) */}
      {speechResult && (
        <div className={`mt-1 p-2 rounded-[4px] border-[1.5px] text-xs flex items-center justify-between gap-2 ${
          speechResult.accuracy >= 75
            ? 'bg-[#FAF6EE] border-[#23365A] text-[#23365A]'
            : 'bg-[#F5EAE8] border-[#A62B1F] text-[#A62B1F]'
        }`}>
          <div className="flex items-center gap-1.5">
            {speechResult.accuracy >= 75 ? (
              <CheckCircle2 size={16} className="text-[#23365A] shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-[#A62B1F] shrink-0" />
            )}
            <div>
              <p className="font-bold">
                {speechResult.accuracy >= 75 ? 'Pelafalan Tepat (Sintong)' : 'Bisa Diulang Lagi'}
              </p>
              <p className="text-[11px] text-[#433D38]">
                Terdeteksi: &ldquo;{speechResult.transcript}&rdquo;
              </p>
            </div>
          </div>
          <span className="font-bold text-xs px-2 py-0.5 rounded-[2px] bg-[#E8DFC8] border border-[#1E1A17]">
            {speechResult.accuracy}%
          </span>
        </div>
      )}
    </div>
  );
};
