import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Volume2, Mic, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Lesson, Question } from '../utils/batakData';
import { Mascot, MascotMood } from './Mascot';
import { GorgaShield, PitaTenun } from './GorgaEmblem';
import {
  speakBatakWord,
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
  const [shuffledIndoPairs, setShuffledIndoPairs] = useState<string[]>([]);
  const [shuffledBatakPairs, setShuffledBatakPairs] = useState<string[]>([]);

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

    if (currentQ?.type === 'match_pairs' && currentQ.pairs) {
      const batakList = currentQ.pairs.map(p => p.batak);
      const indoList = currentQ.pairs.map(p => p.indonesian);
      let shuffled = [...indoList].sort(() => 0.5 - Math.random());
      if (indoList.length > 1 && shuffled.every((v, i) => v === indoList[i])) {
        shuffled = [...shuffled.slice(1), shuffled[0]];
      }
      setShuffledBatakPairs(batakList);
      setShuffledIndoPairs(shuffled);
    } else {
      setShuffledBatakPairs([]);
      setShuffledIndoPairs([]);
    }

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
      const nextMatched = [...matchedPairs, batakVal, indoVal];
      setMatchedPairs(nextMatched);
      setSelectedBatakPair(null);
      setSelectedIndoPair(null);
      if (currentQ.pairs && nextMatched.length >= currentQ.pairs.length * 2) {
        setMascotMood('happy');
        setMascotSpeech('Sintong! Pasangan cocok sude!');
      }
    } else {
      playMistakeSound();
      setSelectedBatakPair(null);
      setSelectedIndoPair(null);
    }
  };

  const handleCheckAnswer = () => {
    let correct = false;

    if (currentQ.type === 'multiple_choice' || currentQ.type === 'listening') {
      correct = selectedOption === currentQ.correctAnswer;
    } else if (currentQ.type === 'sentence_builder') {
      const userSentence = selectedWords.join(' ').trim().toLowerCase();
      const expected = Array.isArray(currentQ.correctAnswer)
        ? currentQ.correctAnswer.join(' ').trim().toLowerCase()
        : String(currentQ.correctAnswer).trim().toLowerCase();
      correct = userSentence === expected;
    } else if (currentQ.type === 'match_pairs') {
      correct = currentQ.pairs ? matchedPairs.length >= currentQ.pairs.length * 2 : false;
    } else if (currentQ.type === 'pronunciation') {
      correct = (recordedAccuracy || 0) >= 65;
    }

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      playHasapiPluck(680);
      setCorrectCount(prev => prev + 1);
      setMascotMood('happy');
      setMascotSpeech('Sintong! Denggan hian!');
    } else {
      playMistakeSound();
      setMascotMood('sad');
      setMascotSpeech('Sala! Unang mandele, ingot poda!');
      handleDepleteHeart();
    }
  };

  const startVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const simAcc = Math.floor(Math.random() * 25) + 75;
        setRecordedAccuracy(simAcc);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const accuracy = calculatePronunciationAccuracy(transcript, currentQ.batakText || '');
        setRecordedAccuracy(accuracy);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setRecordedAccuracy(80);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      setRecordedAccuracy(82);
    }
  };

  const handleDepleteHeart = () => {
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
      <div className="fixed inset-0 z-50 bg-[#1E1A17]/70 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="card-batak bg-[#F4EDE0] max-w-lg w-full p-5 sm:p-8 text-center animate-in zoom-in-95 duration-200 my-auto">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Mascot
              mood="happy"
              size="md"
              speech="Mauliate godang! Ho memang juara!"
              subSpeech="Kamu berhasil menyelesaikan parsiajaran ini!"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading text-[#1E1A17] tracking-tight">
            Parsiajaran Sidung!
          </h2>
          <p className="text-[#1E1A17]/80 mt-1 font-body text-xs sm:text-base">
            Pelajaran <span className="font-bold text-[#A62B1F]">&ldquo;{lesson.title}&rdquo;</span> tuntas dipelajari.
          </p>

          <div className="my-3 sm:my-4">
            <PitaTenun />
          </div>

          {/* Reward Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4 sm:my-6">
            <div className="bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-2.5 sm:p-3 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#1E1A17]/70 block uppercase">XP Diraih</span>
              <span className="text-lg sm:text-2xl font-heading font-bold text-[#D9A21B]">
                +{lesson.xpReward}
              </span>
            </div>
            <div className="bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-2.5 sm:p-3 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#1E1A17]/70 block uppercase">Sisa Tondi</span>
              <span className="text-lg sm:text-2xl font-heading font-bold text-[#A62B1F] flex items-center justify-center gap-1">
                <Heart size={16} className="fill-[#A62B1F] text-[#A62B1F]" /> {hearts}
              </span>
            </div>
            <div className="bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-2.5 sm:p-3 text-center">
              <span className="text-[10px] sm:text-xs font-bold text-[#1E1A17]/70 block uppercase">Akurasi</span>
              <span className="text-lg sm:text-2xl font-heading font-bold text-[#23365A]">
                {Math.round(((correctCount) / lesson.questions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Cultural reward notification */}
          <div className="bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-3 flex items-center gap-3 text-left mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[4px] bg-[#1E1A17] text-[#D9A21B] flex items-center justify-center shrink-0 border border-[#1E1A17]">
              <GorgaShield size={24} />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-bold text-[#A62B1F] uppercase tracking-wide">Hadiah Budaya</p>
              <p className="font-heading font-bold text-[#1E1A17] text-xs sm:text-sm">Poin Tenun Ulos Ditambahkan!</p>
              <p className="text-[11px] sm:text-xs text-[#1E1A17]/75">Simbol berkah dan doa keselamatan dari Sigale-gale.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onComplete({ xpEarned: lesson.xpReward, correctCount, heartsRemaining: hearts })}
            className="btn-indigo w-full py-3.5 text-sm sm:text-base font-bold cursor-pointer min-h-[48px]"
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
      <div className="fixed inset-0 z-50 bg-[#1E1A17]/70 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="card-batak bg-[#F4EDE0] max-w-md w-full p-5 sm:p-6 text-center animate-in zoom-in-95 duration-200 my-auto">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Mascot
              mood="angry"
              size="md"
              speech="Tondimu habis! Istirahat jolo sebentar."
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-heading text-[#1E1A17] tracking-tight">
            Tondi Sudah Habis
          </h2>
          <p className="text-[#1E1A17]/80 mt-1.5 text-xs sm:text-sm font-body">
            Jangan berkecil hati. Buka Kamus Batak untuk melatih kosakata atau tunggu pemulihan tondi.
          </p>

          <div className="my-3 sm:my-4">
            <PitaTenun />
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setHearts(3);
                setCurrentIndex(0);
              }}
              className="btn-secang w-full py-3 text-xs sm:text-sm font-bold cursor-pointer min-h-[46px]"
            >
              Ulangi Pelajaran dari Awal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline-arang w-full py-2.5 text-xs sm:text-sm font-bold cursor-pointer min-h-[44px]"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F4EDE0] text-[#1E1A17] flex flex-col justify-between overflow-hidden">
      {/* Top Ribbon */}
      <PitaTenun />

      {/* Top Header Bar */}
      <header className="max-w-4xl w-full mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2.5 sm:gap-4 border-b-[1.5px] border-[#1E1A17] shrink-0">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Pelajaran"
          className="p-1 sm:p-1.5 rounded-[4px] border border-[#1E1A17] bg-[#EADBCE] text-[#1E1A17] hover:bg-[#D9CDBF] transition-colors cursor-pointer shrink-0"
        >
          <X size={20} />
        </button>

        {/* Progress Bar Tenun */}
        <div
          className="flex-1 progress-tenun-container h-3.5 sm:h-4"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-tenun-bar h-full transition-all duration-300"
            style={{ width: `${Math.max(8, progressPercent)}%` }}
          />
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1 font-bold text-[#A62B1F] bg-[#EADBCE] border-[1.5px] border-[#1E1A17] px-2 sm:px-3 py-0.5 sm:py-1 rounded-[4px] shrink-0 text-xs sm:text-sm">
          <Heart size={16} className="fill-[#A62B1F] text-[#A62B1F]" />
          <span className="font-heading font-bold text-[#1E1A17]">{hearts}</span>
        </div>
      </header>

      {/* Main Content Area (Scrollable body) */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-4 overflow-y-auto">
        <div>
          {/* Question Title & Prompt */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Mascot
              mood={mascotMood}
              size="sm"
              speech={mascotSpeech}
              showStatusLabel={false}
            />
            <div className="flex-1">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#A62B1F] bg-[#EADBCE] border border-[#1E1A17] px-2 py-0.5 rounded-[4px]">
                {currentQ.type === 'multiple_choice' && 'Pilihan Ganda'}
                {currentQ.type === 'listening' && 'Latihan Mendengar'}
                {currentQ.type === 'sentence_builder' && 'Susun Kalimat'}
                {currentQ.type === 'match_pairs' && 'Cocokkan Pasangan'}
                {currentQ.type === 'pronunciation' && 'Latihan Pelafalan'}
              </span>
              <h1 className="text-lg sm:text-2xl font-heading text-[#1E1A17] mt-1.5 sm:mt-2 tracking-tight leading-snug">
                {currentQ.prompt}
              </h1>

              {/* Batak phrase card with audio trigger */}
              {currentQ.batakText && currentQ.type !== 'listening' && currentQ.type !== 'pronunciation' && (
                currentQ.type !== 'multiple_choice' ||
                currentQ.prompt.toLowerCase().includes(currentQ.batakText.toLowerCase())
              ) && (
                <div className="mt-2.5 inline-flex items-center gap-2.5 sm:gap-3 bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-2 sm:p-2.5 px-3 sm:px-4 max-w-full">
                  <button
                    type="button"
                    onClick={() => speakBatakWord(currentQ.batakText!)}
                    aria-label={`Dengarkan ${currentQ.batakText}`}
                    className="btn-indigo w-8 h-8 sm:w-9 sm:h-9 rounded-[4px] flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <Volume2 size={18} />
                  </button>
                  <div className="truncate">
                    <span className="text-base sm:text-lg font-heading font-bold text-[#1E1A17] block tracking-tight truncate">
                      &ldquo;{currentQ.batakText}&rdquo;
                    </span>
                    {currentQ.phonetic && (
                      <span className="text-[11px] sm:text-xs text-[#1E1A17]/70 font-medium">
                        Pelafalan: <span className="text-[#A62B1F] italic font-semibold">{currentQ.phonetic}</span>
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
            <div className="mt-3 sm:mt-4">
              {currentQ.type === 'listening' && currentQ.batakText && (
                <div className="flex items-center justify-center py-4 mb-3">
                  <button
                    type="button"
                    onClick={() => speakBatakWord(currentQ.batakText!)}
                    className="btn-indigo px-5 py-3 text-sm sm:text-base font-bold flex items-center gap-2.5 cursor-pointer"
                  >
                    <Volume2 size={20} /> Putar Audio Penutur Asli
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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
                      className={`p-3 sm:p-4 rounded-[4px] border-[1.5px] text-left font-bold transition-all text-sm sm:text-base flex items-center justify-between cursor-pointer min-h-[48px] ${
                        isSelected
                          ? 'border-[#162238] bg-[#23365A] text-[#F4EDE0] border-b-[3px] border-b-[#162238]'
                          : 'border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] border-b-[3px] border-b-[#1E1A17] hover:bg-[#EADBCE] active:translate-y-[2px]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] border flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? 'border-[#F4EDE0] text-[#F4EDE0]'
                            : 'border-[#1E1A17] text-[#1E1A17]'
                        }`}>
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
            <div className="mt-3 sm:mt-4">
              {/* Answer Slot */}
              <div className="min-h-16 p-3 sm:p-4 border-[1.5px] border-[#1E1A17] rounded-[4px] flex flex-wrap gap-1.5 sm:gap-2 items-center mb-4 sm:mb-6 bg-[#EADBCE]/50">
                {selectedWords.length === 0 ? (
                  <span className="text-[#1E1A17]/60 italic text-xs sm:text-sm">
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
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[4px] bg-[#23365A] text-[#F4EDE0] border-[1.5px] border-[#162238] border-b-[3px] border-b-[#162238] font-bold text-xs sm:text-sm cursor-pointer hover:bg-[#162238]"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              {/* Word Bank */}
              <div className="flex flex-wrap gap-2 items-center justify-center p-3 bg-[#FAF6EE] rounded-[4px] border border-[#1E1A17]">
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
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[4px] bg-[#F4EDE0] text-[#1E1A17] border-[1.5px] border-[#1E1A17] border-b-[3px] border-b-[#1E1A17] font-bold text-xs sm:text-sm hover:bg-[#EADBCE] cursor-pointer active:translate-y-[2px]"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Match Pairs */}
          {currentQ.type === 'match_pairs' && (
            <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2.5 sm:gap-4">
              {/* Batak Column */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] sm:text-xs font-bold text-[#A62B1F] uppercase tracking-wide">
                  Bahasa Batak
                </span>
                {(shuffledBatakPairs.length > 0 ? shuffledBatakPairs : (currentQ.pairs?.map(p => p.batak) || [])).map((batakWord, idx) => {
                  const isMatched = matchedPairs.includes(batakWord);
                  const isSelected = selectedBatakPair === batakWord;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handlePairClick('batak', batakWord)}
                      className={`p-2.5 sm:p-3.5 rounded-[4px] border-[1.5px] font-bold text-left transition-all text-xs sm:text-sm min-h-[44px] ${
                        isMatched
                          ? 'border-dashed border-[#1E1A17] bg-[#EADBCE] text-[#1E1A17] opacity-45'
                          : isSelected
                          ? 'border-[#162238] bg-[#23365A] text-[#F4EDE0] border-b-[3px] border-b-[#162238]'
                          : 'border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] border-b-[3px] border-b-[#1E1A17] hover:bg-[#EADBCE] cursor-pointer active:translate-y-[2px]'
                      }`}
                    >
                      {batakWord}
                    </button>
                  );
                })}
              </div>

              {/* Indonesian Column */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] sm:text-xs font-bold text-[#23365A] uppercase tracking-wide">
                  Bahasa Indonesia
                </span>
                {(shuffledIndoPairs.length > 0 ? shuffledIndoPairs : (currentQ.pairs?.map(p => p.indonesian) || [])).map((indoWord, idx) => {
                  const isMatched = matchedPairs.includes(indoWord);
                  const isSelected = selectedIndoPair === indoWord;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handlePairClick('indo', indoWord)}
                      className={`p-2.5 sm:p-3.5 rounded-[4px] border-[1.5px] font-bold text-left transition-all text-xs sm:text-sm min-h-[44px] ${
                        isMatched
                          ? 'border-dashed border-[#1E1A17] bg-[#EADBCE] text-[#1E1A17] opacity-45'
                          : isSelected
                          ? 'border-[#162238] bg-[#23365A] text-[#F4EDE0] border-b-[3px] border-b-[#162238]'
                          : 'border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] border-b-[3px] border-b-[#1E1A17] hover:bg-[#EADBCE] cursor-pointer active:translate-y-[2px]'
                      }`}
                    >
                      {indoWord}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Pronunciation Practice */}
          {currentQ.type === 'pronunciation' && (
            <div className="mt-4 sm:mt-6 flex flex-col items-center text-center">
              <div className="card-batak bg-[#F4EDE0] p-4 sm:p-6 max-w-md w-full mb-4 sm:mb-6 text-center">
                <p className="text-[#A62B1F] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                  Target Pelafalan
                </p>
                <p className="text-2xl sm:text-3xl font-heading font-bold text-[#1E1A17] tracking-tight">
                  &ldquo;{currentQ.batakText}&rdquo;
                </p>
                {currentQ.syllables && (
                  <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
                    {currentQ.syllables.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-[4px] bg-[#EADBCE] text-[#1E1A17] text-xs sm:text-sm font-semibold border border-[#1E1A17]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[#1E1A17]/75 text-xs sm:text-sm mt-2.5 italic font-body">
                  Artinya: &ldquo;{currentQ.translation}&rdquo;
                </p>
              </div>

              {/* Mic interaction button */}
              <button
                type="button"
                disabled={isRecording}
                onClick={startVoiceRecording}
                className={`w-18 h-18 sm:w-20 sm:h-20 rounded-[4px] flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-[#A62B1F] text-[#F4EDE0] border-2 border-[#1E1A17] animate-pulse'
                    : 'btn-secang text-[#F4EDE0]'
                }`}
              >
                <Mic size={28} />
              </button>
              <p className="text-xs sm:text-sm font-bold text-[#1E1A17] mt-2.5">
                {isRecording ? 'Mendengarkan suara Anda...' : 'Klik Mikrofon & Ucapkan'}
              </p>

              {recordedAccuracy !== null && (
                <div className="mt-3 p-2.5 bg-[#EADBCE] rounded-[4px] border-[1.5px] border-[#1E1A17] text-xs sm:text-sm font-bold text-[#1E1A17]">
                  Skor Akurasi: <span className="text-[#23365A] text-base sm:text-lg font-heading font-bold">{recordedAccuracy}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Docked Sticky Bottom Feedback / Check Bar */}
      <footer className="sticky bottom-0 bg-[#FAF6EE] border-t-[1.5px] border-[#1E1A17] px-3 sm:px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-md shrink-0">
        {!isChecked ? (
          <div className="max-w-3xl mx-auto flex justify-end">
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={
                (currentQ.type === 'multiple_choice' && !selectedOption) ||
                (currentQ.type === 'listening' && !selectedOption) ||
                (currentQ.type === 'sentence_builder' && selectedWords.length === 0) ||
                (currentQ.type === 'match_pairs' && (!currentQ.pairs || matchedPairs.length < currentQ.pairs.length * 2)) ||
                (currentQ.type === 'pronunciation' && recordedAccuracy === null)
              }
              className="btn-indigo w-full sm:w-auto px-8 py-3 text-sm sm:text-base font-bold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer min-h-[48px]"
            >
              Periksa Jawaban
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div
              className={`p-3 sm:p-4 rounded-[4px] border-[1.5px] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-150 ${
                isCorrect
                  ? 'bg-[#EADBCE] border-[#23365A] text-[#1E1A17]'
                  : 'bg-[#F5E2DF] border-[#A62B1F] text-[#1E1A17]'
              }`}
            >
              <div className="flex items-start gap-2.5 w-full sm:w-auto">
                {isCorrect ? (
                  <CheckCircle2 size={26} className="text-[#23365A] shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={26} className="text-[#A62B1F] shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-heading font-bold tracking-tight">
                    {isCorrect ? 'Luar Biasa! (Sintong)' : 'Kurang Tepat (Sala)'}
                  </h3>
                  {!isCorrect && (
                    <div className="text-xs sm:text-sm mt-0.5">
                      <span className="font-semibold text-[#1E1A17]/80">Jawaban: </span>
                      <span className="font-bold text-[#A62B1F]">
                        {Array.isArray(currentQ.correctAnswer)
                          ? currentQ.correctAnswer.join(' ')
                          : currentQ.correctAnswer}
                      </span>
                    </div>
                  )}
                  {currentQ.culturalTip && (
                    <p className="text-[11px] sm:text-xs text-[#1E1A17]/80 mt-0.5 italic">
                      Tip: {currentQ.culturalTip}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className={`w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base font-bold cursor-pointer shrink-0 min-h-[44px] ${
                  isCorrect ? 'btn-indigo' : 'btn-secang'
                }`}
              >
                Lanjutkan <ArrowRight size={16} className="inline ml-1" />
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};
