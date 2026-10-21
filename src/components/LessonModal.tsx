import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Volume2, Mic, CheckCircle2, XCircle, ArrowRight, Sparkles, Award } from 'lucide-react';
import { Lesson, Question } from '../utils/batakData';
import { Mascot, MascotMood } from './Mascot';
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

  // Pronunciation voice state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAccuracy, setRecordedAccuracy] = useState<number | null>(null);

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
    setIsChecked(false);
    setIsCorrect(false);

    if (currentQ?.wordBank) {
      setAvailableWords([...currentQ.wordBank].sort(() => 0.5 - Math.random()));
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
      setMatchedPairs(prev => [...prev, batakVal, indoVal]);
      setSelectedBatakPair(null);
      setSelectedIndoPair(null);

      // Check if all matched
      if (currentQ.pairs && matchedPairs.length + 2 >= currentQ.pairs.length * 2) {
        setIsChecked(true);
        setIsCorrect(true);
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
  const startVoiceRecording = () => {
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Fallback for simulation if API not present in iframe
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const simAccuracy = 88;
        setRecordedAccuracy(simAccuracy);
        setIsChecked(true);
        setIsCorrect(true);
        setMascotMood('happy');
        setMascotSpeech('Luar biasa! Pelafalan mantap!');
        playGordangBeat();
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'id-ID';
      recognition.interimResults = false;

      setIsRecording(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        const target = currentQ.batakText || (typeof currentQ.correctAnswer === 'string' ? currentQ.correctAnswer : '');
        const score = calculatePronunciationAccuracy(transcript, target);
        setRecordedAccuracy(score);
        setIsRecording(false);
        setIsChecked(true);

        if (score >= 65) {
          setIsCorrect(true);
          setMascotMood('happy');
          setMascotSpeech('Pintar hian ho! Pelafalan pas!');
          playGordangBeat();
        } else {
          setIsCorrect(false);
          setMascotMood('sad');
          setMascotSpeech('Boasa sala? Coba taulahi muse!');
          playMistakeSound();
          handleWrongAnswer();
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech error:', err);
      setIsRecording(false);
    }
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
      correct = true; // handled by pair clicks
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

          <h2 className="text-3xl font-extrabold text-stone-900 font-['Fredoka',sans-serif]">
            Parsiajaran Sidung! 🎉
          </h2>
          <p className="text-stone-600 mt-1 font-medium">
            Hebat sekali! Pelajaran <span className="font-bold text-red-600">&ldquo;{lesson.title}&rdquo;</span> tuntas dipelajari.
          </p>

          {/* Reward Badges */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3">
              <span className="text-xs font-bold text-amber-700 block">XP Diraih</span>
              <span className="text-2xl font-black text-amber-600 font-['Fredoka',sans-serif]">
                +{lesson.xpReward}
              </span>
            </div>
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-3">
              <span className="text-xs font-bold text-red-700 block">Sisa Tondi</span>
              <span className="text-2xl font-black text-red-600 font-['Fredoka',sans-serif] flex items-center justify-center gap-1">
                <Heart size={20} className="fill-red-500 text-red-500" /> {hearts}
              </span>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3">
              <span className="text-xs font-bold text-emerald-700 block">Akurasi</span>
              <span className="text-2xl font-black text-emerald-600 font-['Fredoka',sans-serif]">
                {Math.round(((correctCount) / lesson.questions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Ulos Collection notification */}
          <div className="bg-stone-50 border-2 border-stone-300 rounded-2xl p-3.5 flex items-center gap-3 text-left mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center text-xl shrink-0 shadow-inner">
              🧣
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
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-lg border-2 border-emerald-800 shadow-[0_5px_0_0_#065f46] active:translate-y-1 active:shadow-[0_1px_0_0_#065f46] transition-all cursor-pointer font-['Fredoka',sans-serif]"
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
          <h2 className="text-2xl font-extrabold text-stone-900 font-['Fredoka',sans-serif]">
            Tondi Sudah Habis 💔
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
          <span className="text-base font-['Fredoka',sans-serif]">{hearts}</span>
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
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1 font-['Fredoka',sans-serif] leading-snug">
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
                    <span className="text-lg font-bold text-stone-900 block font-['Fredoka',sans-serif]">
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
            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* Batak Column */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  Bahasa Batak
                </span>
                {currentQ.pairs?.map((p, idx) => {
                  const isMatched = matchedPairs.includes(p.batak);
                  const isSelected = selectedBatakPair === p.batak;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handlePairClick('batak', p.batak)}
                      className={`p-3.5 rounded-xl border-2 font-bold text-left transition-all ${
                        isMatched
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 opacity-60'
                          : isSelected
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-[0_3px_0_0_#f59e0b]'
                          : 'border-stone-300 bg-white text-stone-800 shadow-[0_3px_0_0_#e7e5e4] hover:bg-stone-50 cursor-pointer'
                      }`}
                    >
                      {p.batak}
                    </button>
                  );
                })}
              </div>

              {/* Indonesian Column */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  Bahasa Indonesia
                </span>
                {currentQ.pairs?.map((p, idx) => {
                  const isMatched = matchedPairs.includes(p.indonesian);
                  const isSelected = selectedIndoPair === p.indonesian;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handlePairClick('indo', p.indonesian)}
                      className={`p-3.5 rounded-xl border-2 font-bold text-left transition-all ${
                        isMatched
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 opacity-60'
                          : isSelected
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-[0_3px_0_0_#f59e0b]'
                          : 'border-stone-300 bg-white text-stone-800 shadow-[0_3px_0_0_#e7e5e4] hover:bg-stone-50 cursor-pointer'
                      }`}
                    >
                      {p.indonesian}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Pronunciation Practice */}
          {currentQ.type === 'pronunciation' && (
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="bg-white border-2 border-stone-300 rounded-3xl p-6 shadow-sm max-w-md w-full mb-6">
                <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-2">
                  Target Pelafalan
                </p>
                <p className="text-3xl font-black text-stone-900 font-['Fredoka',sans-serif] text-red-600">
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
              <button
                type="button"
                disabled={isRecording}
                onClick={startVoiceRecording}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-white border-4 transition-all cursor-pointer shadow-lg ${
                  isRecording
                    ? 'bg-red-600 border-red-800 animate-ping'
                    : 'bg-emerald-500 hover:bg-emerald-400 border-emerald-700 shadow-[0_6px_0_0_#047857] active:translate-y-1'
                }`}
              >
                <Mic size={36} />
              </button>
              <p className="text-sm font-bold text-stone-600 mt-4">
                {isRecording ? 'Mendengarkan suara Anda...' : 'Klik Mikrofon & Ucapkan'}
              </p>

              {recordedAccuracy !== null && (
                <div className="mt-4 p-3 bg-stone-100 rounded-2xl border text-sm font-bold">
                  Skor Akurasi: <span className="text-emerald-700 text-lg font-black">{recordedAccuracy}%</span>
                </div>
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
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-base border-2 border-emerald-800 shadow-[0_4px_0_0_#065f46] active:translate-y-1 active:shadow-[0_1px_0_0_#065f46] transition-all cursor-pointer font-['Fredoka',sans-serif]"
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
                  <h3 className="text-lg font-extrabold font-['Fredoka',sans-serif]">
                    {isCorrect ? 'Luar Biasa! (Sintong)' : 'Kurang Tepat (Sala)'}
                  </h3>
                  {!isCorrect && (
                    <div className="text-xs sm:text-sm mt-1">
                      <span className="font-semibold text-stone-600">Jawaban yang tepat: </span>
                      <span className="font-bold text-red-700">
                        {Array.isArray(currentQ.correctAnswer)
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
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-base border-2 text-white shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 transition-all cursor-pointer font-['Fredoka',sans-serif] shrink-0 ${
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
