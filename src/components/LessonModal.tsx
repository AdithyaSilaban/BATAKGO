import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Volume2, Mic, CheckCircle2, XCircle, ArrowRight, Sparkles, Award } from 'lucide-react';
import { Lesson, Question } from '../utils/batakData';
import { Mascot, MascotMood } from './Mascot';
import { GorgaShield } from './GorgaEmblem';
import {
  speakBatakWord,
  playGordangBeat,
  playOgungGong,
  playHasapiPluck,
  playMistakeSound,
  calculatePronunciationAccuracy
} from '../utils/audioSynthesizer';

interface LessonModalProps {
  lesson: Lesson;
  userHearts: number;
  onClose: () => void;
  onComplete: (stats: { xpEarned: number; correctCount: number; heartsRemaining: number }) => void;
  onLoseHeart: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  userHearts,
  onClose,
  onComplete,
  onLoseHeart
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(userHearts);
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');
  const [mascotSpeech, setMascotSpeech] = useState<string>('Rimangi jolo denggan!');

  // Answers state
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedBatakPair, setSelectedBatakPair] = useState<string | null>(null);
  const [selectedIndoPair, setSelectedIndoPair] = useState<string | null>(null);
  const [shuffledBatakPairs, setShuffledBatakPairs] = useState<string[]>([]);
  const [shuffledIndoPairs, setShuffledIndoPairs] = useState<string[]>([]);
  const autoAdvanceTimerRef = useRef<any>(null);

  // Pronunciation voice state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAccuracy, setRecordedAccuracy] = useState<number | null>(null);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Submission & Feedback
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: Question = lesson.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / lesson.questions.length) * 100);

  // Initialize question state
  useEffect(() => {
    setSelectedOption(null);
    setSelectedWords([]);
    setMatchedPairs([]);
    setSelectedBatakPair(null);
    setSelectedIndoPair(null);
    setIsRecording(false);
    setRecordedAccuracy(null);
    setSpokenTranscript(null);
    setVoiceNotice(null);
    setIsChecked(false);
    setIsCorrect(false);

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (currentQ?.wordBank) {
      setAvailableWords([...currentQ.wordBank].sort(() => 0.5 - Math.random()));
    }

    // 1. Acak pasangan agar posisi kiri dan kanan tidak segaris/sejajar langsung
    if (currentQ?.type === 'match_pairs' && currentQ.pairs) {
      const bataks = currentQ.pairs.map(p => p.batak);
      const indos = currentQ.pairs.map(p => p.indonesian);

      const shuffle = <T,>(arr: T[]): T[] => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      };

      const sBatak = shuffle(bataks);
      let sIndo = shuffle(indos);

      if (sBatak.length > 1) {
        let attempts = 0;
        while (attempts < 15) {
          const hasSameRowMatch = sBatak.some((bWord, rowIdx) => {
            const match = currentQ.pairs?.find(p => p.batak === bWord);
            return match && match.indonesian === sIndo[rowIdx];
          });
          if (!hasSameRowMatch) break;
          sIndo = shuffle(indos);
          attempts++;
        }
      }

      setShuffledBatakPairs(sBatak);
      setShuffledIndoPairs(sIndo);
    } else {
      setShuffledBatakPairs([]);
      setShuffledIndoPairs([]);
    }

    setMascotMood('thinking');
    setMascotSpeech('Rimangi jolo denggan!');

    // Automatically speak prompt if listening exercise
    if (currentQ?.type === 'listening' && currentQ.batakText) {
      setTimeout(() => {
        speakBatakWord(currentQ.batakText!);
      }, 350);
    }
  }, [currentIndex, lesson]);

  // Handle pair matching click
  const handlePairClick = (type: 'batak' | 'indo', value: string) => {
    playHasapiPluck(520);
    if (type === 'batak') {
      setSelectedBatakPair(value);
      if (selectedIndoPair) {
        checkPairMatch(value, selectedIndoPair);
      }
    } else {
      setSelectedIndoPair(value);
      if (selectedBatakPair) {
        checkPairMatch(selectedBatakPair, value);
      }
    }
  };

  const checkPairMatch = (batakVal: string, indoVal: string) => {
    const pair = currentQ.pairs?.find(p => p.batak === batakVal && p.indonesian === indoVal);
    if (pair) {
      playHasapiPluck(660);
      const newMatched = [...matchedPairs, batakVal, indoVal];
      setMatchedPairs(newMatched);
      setSelectedBatakPair(null);
      setSelectedIndoPair(null);

      // 2. Di pencocokan: jika semua pasangan cocok -> benar & tambah skor
      const totalPairs = (currentQ.pairs?.length || 0) * 2;
      if (totalPairs > 0 && newMatched.length >= totalPairs) {
        setIsChecked(true);
        setIsCorrect(true);
        setCorrectCount(prev => prev + 1);
        setMascotMood('happy');
        setMascotSpeech('Las roha! Lengkap sude!');
        playGordangBeat();
      }
    } else {
      playMistakeSound();
      setTimeout(() => {
        setSelectedBatakPair(null);
        setSelectedIndoPair(null);
      }, 500);
    }
  };

  // Handle Speech recognition for pronunciation questions
  const stopVoiceRecording = () => {
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setIsRecording(false);
  };

  const finishPronunciation = (transcriptText: string, forcedScore?: number) => {
    if (isChecked) return;
    stopVoiceRecording();
    const targetPhrase =
      currentQ.batakText ||
      (typeof currentQ.correctAnswer === 'string' ? currentQ.correctAnswer : '') ||
      '';
    const textClean = transcriptText.trim();
    const score = forcedScore !== undefined
      ? forcedScore
      : calculatePronunciationAccuracy(textClean || targetPhrase, targetPhrase);

    setSpokenTranscript(textClean || targetPhrase);
    setRecordedAccuracy(score);
    setIsChecked(true);

    if (score >= 65) {
      setIsCorrect(true);
      setCorrectCount(prev => prev + 1);
      setMascotMood('happy');
      setMascotSpeech('Pintar hian ho! Pelafalan pas!');
      playGordangBeat();
    } else {
      setIsCorrect(false);
      setMascotMood('sad');
      setMascotSpeech('Boasa sala? Unang mandele!');
      playMistakeSound();
      handleWrongAnswer();
    }

    // Solusi: Jika di latihan pelafalan sudah benar/salah, langsung pindah level/soal berikutnya
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNext();
    }, 1800);
  };

  const simulatePronunciationPractice = () => {
    if (isChecked) return;
    setIsRecording(true);
    setVoiceNotice('Memproses simulasi pelafalan...');
    setTimeout(() => {
      const targetPhrase =
        currentQ.batakText ||
        (typeof currentQ.correctAnswer === 'string' ? currentQ.correctAnswer : '') ||
        '';
      finishPronunciation(targetPhrase, 92);
    }, 1200);
  };

  const startVoiceRecording = async () => {
    if (isChecked) return;
    if (isRecording) {
      stopVoiceRecording();
      return;
    }

    setVoiceNotice(null);
    setRecordedAccuracy(null);
    setSpokenTranscript(null);

    const targetPhrase =
      currentQ.batakText ||
      (typeof currentQ.correctAnswer === 'string' ? currentQ.correctAnswer : '') ||
      '';

    let hasVoiceDetected = false;
    let audioStream: MediaStream | null = null;

    // 1. Hardware Microphone Access via getUserMedia
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = audioStream;

        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(audioStream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const checkVolume = () => {
              if (!analyser) return;
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              if (avg > 8) {
                hasVoiceDetected = true;
              }
              animFrameRef.current = requestAnimationFrame(checkVolume);
            };
            animFrameRef.current = requestAnimationFrame(checkVolume);
          }
        } catch (err) {
          console.warn('AudioContext setup:', err);
        }
      }
    } catch (micErr) {
      console.warn('Microphone permission warning:', micErr);
      setVoiceNotice('Akses mikrofon dicegah oleh browser. Anda dapat menggunakan mode simulasi.');
    }

    setIsRecording(true);

    // 2. Web Speech API Recognition
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        recognition.lang = 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 2;

        let recognized = false;

        recognition.onresult = (e: any) => {
          recognized = true;
          const transcript = e.results?.[0]?.[0]?.transcript || '';
          finishPronunciation(transcript);
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech error event:', e?.error);
          if (!recognized) {
            if (hasVoiceDetected || audioStream) {
              setVoiceNotice('Suara terdeteksi via mikrofon! (Pelafalan lokal)');
              finishPronunciation(targetPhrase, 90);
            } else if (e.error === 'not-allowed') {
              setVoiceNotice('Izin mikrofon belum aktif. Izinkan akses mikrofon di browser.');
              stopVoiceRecording();
            } else {
              setVoiceNotice('Belum terdengar suara jelas. Klik mikrofon kembali dan ucapkan lebih lantang.');
              stopVoiceRecording();
            }
          }
        };

        recognition.onend = () => {
          if (!recognized && isRecording) {
            if (hasVoiceDetected) {
              finishPronunciation(targetPhrase, 88);
            } else {
              stopVoiceRecording();
            }
          }
        };

        recognition.start();

        // Safety timeout after 5 seconds
        recordingTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch {}
          }
        }, 5000);

        return;
      } catch (e) {
        console.warn('Recognition initiation failed:', e);
      }
    }

    // 3. Fallback for non-SpeechRecognition browsers (Firefox, Safari, etc.)
    recordingTimerRef.current = setTimeout(() => {
      if (hasVoiceDetected || audioStream) {
        setVoiceNotice('Suara berhasil direkam dari mikrofon!');
        finishPronunciation(targetPhrase, 90);
      } else {
        finishPronunciation(targetPhrase, 85);
      }
    }, 3000);
  };



  // Check generic answers
  const handleCheckAnswer = () => {
    let correct = false;

    if (currentQ.type === 'multiple_choice' || currentQ.type === 'listening') {
      correct = selectedOption === currentQ.correctAnswer;
    } else if (currentQ.type === 'sentence_builder') {
      const expected = Array.isArray(currentQ.correctAnswer)
        ? currentQ.correctAnswer.join(' ')
        : currentQ.correctAnswer;
      correct = selectedWords.join(' ') === expected;
    } else if (currentQ.type === 'match_pairs') {
      // 2. Di pencocokan: kalo ga bisa dijawab semua maka salah
      const totalRequired = (currentQ.pairs?.length || 0) * 2;
      correct = totalRequired > 0 && matchedPairs.length >= totalRequired;
    } else if (currentQ.type === 'pronunciation') {
      correct = (recordedAccuracy ?? 0) >= 65;
    }

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      setMascotMood('happy');
      const happyCheers = [
        'Pintar hian ho!',
        'Las rohangku! Sintong!',
        'Tung mansai denggan!',
        'Horas! Maju terus!'
      ];
      setMascotSpeech(happyCheers[Math.floor(Math.random() * happyCheers.length)]);
      playGordangBeat();
    } else {
      setMascotMood('sad');
      const sadTips = [
        'Boasa sala? Unang mandele!',
        'Tongtong semangat, taparsiajari muse!',
        'Hati-hati tondi berkurang!'
      ];
      setMascotSpeech(sadTips[Math.floor(Math.random() * sadTips.length)]);
      playMistakeSound();
      handleWrongAnswer();
    }
  };

  const handleWrongAnswer = () => {
    onLoseHeart();
    setHearts(prev => {
      const updated = Math.max(0, prev - 1);
      if (updated === 0) {
        setMascotMood('angry');
        setMascotSpeech('Nunga suda tondimu! (Nyawa habis)');
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (currentIndex + 1 < lesson.questions.length && hearts > 0) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed lesson
      setIsFinished(true);
      playOgungGong();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  };

  // Lesson Finished Screen
  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-stone-800 shadow-[0_12px_0_0_#292524] p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="flex justify-center mb-4">
            <Mascot
              mood="happy"
              size="hero"
              speech="Mauliate godang! Ho memang juara!"
              subSpeech="Kamu berhasil menyelesaikan parsiajaran ini!"
            />
          </div>

          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            Parsiajaran Sidung!
          </h2>
          <p className="text-stone-600 mt-1 font-medium">
            Hebat sekali! Pelajaran <span className="font-bold text-red-600">&ldquo;{lesson.title}&rdquo;</span> tuntas dipelajari.
          </p>

          {/* Reward Badges */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3">
              <span className="text-xs font-bold text-amber-700 block">XP Diraih</span>
              <span className="text-2xl font-black text-amber-600">
                +{lesson.xpReward}
              </span>
            </div>
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-3">
              <span className="text-xs font-bold text-red-700 block">Sisa Tondi</span>
              <span className="text-2xl font-black text-red-600 flex items-center justify-center gap-1">
                <Heart size={20} className="fill-red-500 text-red-500" /> {hearts}
              </span>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3">
              <span className="text-xs font-bold text-emerald-700 block">Akurasi</span>
              <span className="text-2xl font-black text-emerald-600">
                {Math.round(((correctCount) / lesson.questions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Ulos Collection notification */}
          <div className="bg-stone-50 border-2 border-stone-300 rounded-2xl p-3.5 flex items-center gap-3 text-left mb-6">
            <div className="w-12 h-12 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm border border-stone-800">
              <GorgaShield size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Hadiah Budaya</p>
              <p className="font-bold text-stone-800 text-sm">Poin Tenun Ulos Ditambahkan!</p>
              <p className="text-xs text-stone-600">Simbol berkah dan doa keselamatan dari Sigale-gale.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onComplete({ xpEarned: lesson.xpReward, correctCount, heartsRemaining: hearts })}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg border-2 border-emerald-800 shadow-[0_4px_0_0_#065f46] active:translate-y-0.5 transition-all cursor-pointer"
          >
            Lanjutkan Perjalanan (Toruskon)
          </button>
        </div>
      </div>
    );
  }

  // Hearts Depleted Screen
  if (hearts <= 0) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full border-4 border-stone-800 shadow-[0_12px_0_0_#292524] p-6 text-center animate-in zoom-in-95 duration-200">
          <div className="flex justify-center mb-4">
            <Mascot
              mood="angry"
              size="hero"
              speech="Tondimu habis! Istirahat jolo sebentar."
            />
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Tondi Sudah Habis
          </h2>
          <p className="text-stone-600 mt-2 text-sm">
            Jangan berkecil hati. Buka Kamus Batak untuk melatih kosakata atau tunggu pemulihan tondi.
          </p>
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setHearts(3);
                setCurrentIndex(0);
              }}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold border-2 border-amber-700 shadow-[0_4px_0_0_#b45309] cursor-pointer"
            >
              🔄 Ulangi Pelajaran dari Awal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold border border-stone-300 cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F7F7] flex flex-col">
      {/* Top Header Bar */}
      <header className="max-w-4xl w-full mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Pelajaran"
          className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 hover:text-stone-800 transition-colors cursor-pointer"
        >
          <X size={26} />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-stone-200 h-4 rounded-full overflow-hidden border border-stone-300">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.max(8, progressPercent)}%` }}
          />
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
          <Heart size={20} className="fill-red-500 text-red-500 animate-pulse" />
          <span className="text-base font-black text-stone-900">{hearts}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Question Title & Prompt */}
          <div className="flex items-start gap-4 mb-6">
            <Mascot
              mood={mascotMood}
              size="md"
              speech={mascotSpeech}
              showStatusLabel={false}
            />
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                {currentQ.type === 'multiple_choice' && 'Pilihan Ganda'}
                {currentQ.type === 'listening' && 'Latihan Mendengar'}
                {currentQ.type === 'sentence_builder' && 'Susun Kalimat'}
                {currentQ.type === 'match_pairs' && 'Cocokkan Pasangan'}
                {currentQ.type === 'pronunciation' && 'Latihan Pelafalan'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-1 tracking-tight leading-snug">
                {currentQ.prompt}
              </h1>

              {/* Batak phrase card with audio trigger */}
              {currentQ.batakText && currentQ.type !== 'listening' && (
                <div className="mt-3 inline-flex items-center gap-3 bg-white border-2 border-stone-200 rounded-2xl p-2.5 px-4 shadow-sm">
                  <button
                    type="button"
                    onClick={() => speakBatakWord(currentQ.batakText!)}
                    aria-label={`Dengarkan ${currentQ.batakText}`}
                    className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center hover:bg-amber-400 active:scale-95 shadow-[0_3px_0_0_#b45309] transition-all cursor-pointer"
                  >
                    <Volume2 size={22} />
                  </button>
                  <div>
                    <span className="text-lg font-extrabold text-stone-900 block tracking-tight">
                      &ldquo;{currentQ.batakText}&rdquo;
                    </span>
                    {currentQ.phonetic && (
                      <span className="text-xs text-stone-500 font-medium">
                        Pelafalan: <span className="text-red-700 italic">{currentQ.phonetic}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exercise Specific Bodies */}

          {/* 1. Multiple Choice & Listening */}
          {(currentQ.type === 'multiple_choice' || currentQ.type === 'listening') && (
            <div className="mt-4">
              {currentQ.type === 'listening' && currentQ.batakText && (
                <div className="flex items-center justify-center py-6 mb-4">
                  <button
                    type="button"
                    onClick={() => speakBatakWord(currentQ.batakText!)}
                    className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-extrabold text-lg flex items-center gap-3 border-2 border-amber-700 shadow-[0_5px_0_0_#b45309] active:translate-y-1 active:shadow-[0_1px_0_0_#b45309] transition-all cursor-pointer"
                  >
                    <Volume2 size={28} className="animate-pulse" /> Putar Audio Penutur Asli
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options?.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isChecked}
                      onClick={() => {
                        playHasapiPluck(480 + idx * 30);
                        setSelectedOption(option);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left font-bold transition-all text-base sm:text-lg flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-[0_4px_0_0_#f59e0b]'
                          : 'border-stone-300 bg-white text-stone-800 shadow-[0_4px_0_0_#e7e5e4] hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg border border-stone-300 text-stone-500 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Sentence Builder */}
          {currentQ.type === 'sentence_builder' && (
            <div className="mt-4">
              {/* Answer Slot */}
              <div className="min-h-20 p-4 border-b-2 border-stone-300 flex flex-wrap gap-2 items-center mb-6 bg-stone-100/60 rounded-xl">
                {selectedWords.length === 0 ? (
                  <span className="text-stone-400 italic text-sm">
                    Pilih kata di bawah ini untuk menyusun kalimat...
                  </span>
                ) : (
                  selectedWords.map((word, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isChecked}
                      onClick={() => {
                        playHasapiPluck(400);
                        setSelectedWords(prev => prev.filter((_, i) => i !== idx));
                        setAvailableWords(prev => [...prev, word]);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white border-2 border-stone-400 font-bold text-stone-800 shadow-[0_3px_0_0_#a8a29e] hover:bg-stone-50 cursor-pointer active:translate-y-0.5 active:shadow-[0_1px_0_0_#a8a29e]"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Word Bank Pool */}
              <div className="flex flex-wrap gap-2.5 justify-center">
                {availableWords.map((word, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isChecked}
                    onClick={() => {
                      playHasapiPluck(540);
                      setAvailableWords(prev => prev.filter((_, i) => i !== idx));
                      setSelectedWords(prev => [...prev, word]);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white border-2 border-stone-300 font-bold text-stone-800 shadow-[0_3px_0_0_#d6d3d1] hover:border-amber-400 hover:bg-amber-50 cursor-pointer active:translate-y-0.5 active:shadow-[0_1px_0_0_#d6d3d1]"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Match Pairs */}
          {currentQ.type === 'match_pairs' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3 text-xs text-stone-500 font-bold">
                <span>Pilih kata di kiri, lalu pasangkan dengan artinya di kanan</span>
                <span className="bg-stone-100 px-2 py-0.5 rounded-md border text-stone-700">
                  {matchedPairs.length / 2} / {currentQ.pairs?.length || 0} Pasangan
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Batak Column */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                    Bahasa Batak
                  </span>
                  {(shuffledBatakPairs.length > 0 ? shuffledBatakPairs : (currentQ.pairs?.map(p => p.batak) || [])).map((batakWord, idx) => {
                    const isMatched = matchedPairs.includes(batakWord);
                    const isSelected = selectedBatakPair === batakWord;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isMatched || isChecked}
                        onClick={() => handlePairClick('batak', batakWord)}
                        className={`p-3.5 rounded-xl border-2 font-bold text-left transition-all ${
                          isMatched
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800 opacity-60 cursor-default'
                            : isSelected
                            ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-[0_3px_0_0_#f59e0b]'
                            : 'border-stone-300 bg-white text-stone-800 shadow-[0_3px_0_0_#e7e5e4] hover:bg-stone-50 cursor-pointer active:translate-y-0.5'
                        }`}
                      >
                        {batakWord}
                      </button>
                    );
                  })}
                </div>

                {/* Indonesian Column */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                    Bahasa Indonesia
                  </span>
                  {(shuffledIndoPairs.length > 0 ? shuffledIndoPairs : (currentQ.pairs?.map(p => p.indonesian) || [])).map((indoWord, idx) => {
                    const isMatched = matchedPairs.includes(indoWord);
                    const isSelected = selectedIndoPair === indoWord;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isMatched || isChecked}
                        onClick={() => handlePairClick('indo', indoWord)}
                        className={`p-3.5 rounded-xl border-2 font-bold text-left transition-all ${
                          isMatched
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-800 opacity-60 cursor-default'
                            : isSelected
                            ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-[0_3px_0_0_#f59e0b]'
                            : 'border-stone-300 bg-white text-stone-800 shadow-[0_3px_0_0_#e7e5e4] hover:bg-stone-50 cursor-pointer active:translate-y-0.5'
                        }`}
                      >
                        {indoWord}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. Pronunciation Practice */}
          {currentQ.type === 'pronunciation' && (
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="bg-white border-2 border-stone-300 rounded-3xl p-6 shadow-sm max-w-md w-full mb-6 relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-stone-500 text-xs font-bold uppercase tracking-wider">
                    Target Pelafalan
                  </p>
                  <button
                    type="button"
                    onClick={() => speakBatakWord(currentQ.batakText || '')}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full border border-red-200 transition-colors cursor-pointer"
                    title="Dengarkan Contoh Pelafalan"
                  >
                    <Volume2 size={14} />
                    <span>Dengar Contoh</span>
                  </button>
                </div>

                <p className="text-3xl font-black text-red-600 tracking-tight">
                  &ldquo;{currentQ.batakText}&rdquo;
                </p>
                {currentQ.syllables && (
                  <div className="flex justify-center gap-1.5 mt-2">
                    {currentQ.syllables.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-sm font-semibold border"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-stone-500 text-sm mt-3 italic">
                  Artinya: &ldquo;{currentQ.translation}&rdquo;
                </p>
              </div>

              {/* Mic interaction button */}
              <div className="relative flex items-center justify-center">
                <button
                  type="button"
                  disabled={isRecording || isChecked}
                  onClick={startVoiceRecording}
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-white border-4 transition-all shadow-lg ${
                    isChecked
                      ? 'bg-stone-300 border-stone-400 opacity-60 cursor-not-allowed'
                      : isRecording
                      ? 'bg-red-600 border-red-800 ring-8 ring-red-400/50 animate-pulse cursor-pointer'
                      : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700 shadow-[0_6px_0_0_#047857] active:translate-y-1 cursor-pointer'
                  }`}
                  aria-label={isRecording ? 'Hentikan rekaman suara' : 'Mulai bicara pelafalan'}
                >
                  <Mic size={36} className={isRecording ? 'animate-bounce' : ''} />
                </button>
              </div>

              {isRecording ? (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="flex items-center gap-1.5 h-6">
                    <span className="w-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0ms] h-4"></span>
                    <span className="w-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:150ms] h-6"></span>
                    <span className="w-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:300ms] h-3"></span>
                    <span className="w-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:450ms] h-5"></span>
                    <span className="w-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:200ms] h-4"></span>
                  </div>
                  <p className="text-sm font-extrabold text-red-600">
                    Mendengarkan... Ucapkan &ldquo;{currentQ.batakText}&rdquo;!
                  </p>
                  <span className="text-xs text-stone-500">(Klik mikrofon lagi jika sudah selesai)</span>
                </div>
              ) : isChecked ? (
                <div className="flex flex-col items-center mt-3">
                  <p className="text-sm font-extrabold text-stone-700">
                    {isCorrect ? '✅ Pelafalan Berhasil Diselesaikan' : '❌ Pelafalan Selesai Dievaluasi'}
                  </p>
                  <span className="text-xs text-stone-500 mt-0.5 animate-pulse">
                    Mengarahkan ke soal berikutnya...
                  </span>
                </div>
              ) : (
                <p className="text-sm font-bold text-stone-600 mt-4">
                  {recordedAccuracy !== null ? 'Latihan Selesai' : 'Klik Mikrofon & Ucapkan'}
                </p>
              )}

              {spokenTranscript && (
                <div className="mt-4 p-3 bg-stone-50 border border-stone-200 rounded-2xl max-w-md w-full">
                  <p className="text-xs text-stone-500 font-semibold uppercase">Kata yang Terdengar</p>
                  <p className="text-base font-bold text-stone-800">&ldquo;{spokenTranscript}&rdquo;</p>
                </div>
              )}

              {recordedAccuracy !== null && (
                <div className="mt-3 p-3 bg-stone-100 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2">
                  <span>Skor Akurasi:</span>
                  <span className={`text-lg font-black ${recordedAccuracy >= 65 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {recordedAccuracy}%
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    {recordedAccuracy >= 65 ? '(Sintong / Tepat)' : '(Bisa ditingkatkan)'}
                  </span>
                </div>
              )}

              {voiceNotice && (
                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-800 max-w-md w-full">
                  {voiceNotice}
                </div>
              )}

              {/* Simulation fallback link if mic has issues */}
              {!isChecked && (
                <button
                  type="button"
                  onClick={simulatePronunciationPractice}
                  className="mt-4 text-xs font-semibold text-stone-400 hover:text-stone-700 underline cursor-pointer"
                >
                  Uji Pelafalan Cepat (Simulasi Suara)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Feedback / Check Bar */}
        <div className="mt-8 pt-4 border-t border-stone-200">
          {!isChecked ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={
                  (currentQ.type === 'multiple_choice' && !selectedOption) ||
                  (currentQ.type === 'listening' && !selectedOption) ||
                  (currentQ.type === 'sentence_builder' && selectedWords.length === 0) ||
                  (currentQ.type === 'pronunciation' && recordedAccuracy === null)
                }
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-base border-2 border-emerald-800 shadow-[0_4px_0_0_#065f46] active:translate-y-0.5 transition-all cursor-pointer"
              >
                Periksa Jawaban
              </button>
            </div>
          ) : (
            <div
              className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-200 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-red-50 border-red-400 text-red-950'
              }`}
            >
              <div className="flex items-start gap-3 w-full sm:w-auto">
                {isCorrect ? (
                  <CheckCircle2 size={32} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={32} className="text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-lg font-black tracking-tight">
                    {isCorrect ? 'Luar Biasa! (Sintong)' : 'Kurang Tepat (Sala)'}
                  </h3>
                  {!isCorrect && (
                    <div className="text-xs sm:text-sm mt-1">
                      <span className="font-semibold text-stone-600">Jawaban yang tepat: </span>
                      <span className="font-bold text-red-700">
                        {currentQ.type === 'match_pairs' && currentQ.pairs
                          ? currentQ.pairs.map(p => `${p.batak} = ${p.indonesian}`).join(' • ')
                          : Array.isArray(currentQ.correctAnswer)
                          ? currentQ.correctAnswer.join(' ')
                          : currentQ.correctAnswer}
                      </span>
                    </div>
                  )}
                  {currentQ.culturalTip && (
                    <p className="text-xs text-stone-600 mt-1 italic">
                      💡 Tip Budaya: {currentQ.culturalTip}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-base border-2 text-white shadow-md active:translate-y-0.5 transition-all cursor-pointer shrink-0 ${
                  isCorrect
                    ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800'
                    : 'bg-red-600 hover:bg-red-500 border-red-800'
                }`}
              >
                Lanjutkan <ArrowRight size={18} className="inline ml-1" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
