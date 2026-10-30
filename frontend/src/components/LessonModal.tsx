import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Heart, Volume2, Mic, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Lesson, Question } from '../utils/batakData';
import { Mascot, MascotMood } from './Mascot';
import { GorgaShield, PitaTenun } from './GorgaEmblem';
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

      // Check if all matched
      if (currentQ.pairs && nextMatched.length >= currentQ.pairs.length * 2) {
        setCorrectCount(prev => prev + 1);
        setIsChecked(true);
        setIsCorrect(true);
        setMascotMood('happy');
        setMascotSpeech('Las roha! Lengkap sude!');
        playGordangBeat();
      }
    } else {
      playMistakeSound();
      setMascotMood('sad');
      setMascotSpeech('Sala pasanganna! Coba rimangi muse.');
      handleWrongAnswer();
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
      correct = Boolean(currentQ.pairs && matchedPairs.length >= currentQ.pairs.length * 2);
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
      <div className="fixed inset-0 z-50 bg-[#1E1A17]/70 flex items-center justify-center p-4">
        <div className="card-batak bg-[#F4EDE0] max-w-lg w-full p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="flex justify-center mb-4">
            <Mascot
              mood="happy"
              size="hero"
              speech="Mauliate godang! Ho memang juara!"
              subSpeech="Kamu berhasil menyelesaikan parsiajaran ini!"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading text-[#1E1A17] tracking-tight">
            Parsiajaran Sidung!
          </h2>
          <p className="text-[#1E1A17]/80 mt-1 font-body text-sm sm:text-base">
            Pelajaran <span className="font-bold text-[#A62B1F]">&ldquo;{lesson.title}&rdquo;</span> tuntas dipelajari.
          </p>

          <div className="my-4">
            <PitaTenun />
          </div>

          {/* Reward Badges */}
          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-3 text-center">
              <span className="text-xs font-bold text-[#1E1A17]/70 block uppercase">XP Diraih</span>
              <span className="text-xl sm:text-2xl font-heading font-bold text-[#D9A21B]">
                +{lesson.xpReward}
              </span>
            </div>
            <div className="bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-3 text-center">
              <span className="text-xs font-bold text-[#1E1A17]/70 block uppercase">Sisa Tondi</span>
              <span className="text-xl sm:text-2xl font-heading font-bold text-[#A62B1F] flex items-center justify-center gap-1">
                <Heart size={20} className="fill-[#A62B1F] text-[#A62B1F]" /> {hearts}
              </span>
            </div>
            <div className="bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-3 text-center">
              <span className="text-xs font-bold text-[#1E1A17]/70 block uppercase">Akurasi</span>
              <span className="text-xl sm:text-2xl font-heading font-bold text-[#23365A]">
                {Math.round(((correctCount) / lesson.questions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* Cultural reward notification */}
          <div className="bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-3.5 flex items-center gap-3 text-left mb-6">
            <div className="w-12 h-12 rounded-[4px] bg-[#1E1A17] text-[#D9A21B] flex items-center justify-center shrink-0 border border-[#1E1A17]">
              <GorgaShield size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#A62B1F] uppercase tracking-wide">Hadiah Budaya</p>
              <p className="font-heading font-bold text-[#1E1A17] text-sm">Poin Tenun Ulos Ditambahkan!</p>
              <p className="text-xs text-[#1E1A17]/75">Simbol berkah dan doa keselamatan dari Sigale-gale.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onComplete({ xpEarned: lesson.xpReward, correctCount, heartsRemaining: hearts })}
            className="btn-indigo w-full py-3.5 text-base font-bold cursor-pointer"
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
      <div className="fixed inset-0 z-50 bg-[#1E1A17]/70 flex items-center justify-center p-4">
        <div className="card-batak bg-[#F4EDE0] max-w-md w-full p-6 text-center animate-in zoom-in-95 duration-200">
          <div className="flex justify-center mb-4">
            <Mascot
              mood="angry"
              size="hero"
              speech="Tondimu habis! Istirahat jolo sebentar."
            />
          </div>
          <h2 className="text-2xl font-heading text-[#1E1A17] tracking-tight">
            Tondi Sudah Habis
          </h2>
          <p className="text-[#1E1A17]/80 mt-2 text-sm font-body">
            Jangan berkecil hati. Buka Kamus Batak untuk melatih kosakata atau tunggu pemulihan tondi.
          </p>

          <div className="my-4">
            <PitaTenun />
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setHearts(3);
                setCurrentIndex(0);
              }}
              className="btn-secang w-full py-3 text-sm font-bold cursor-pointer"
            >
              Ulangi Pelajaran dari Awal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline-arang w-full py-2.5 text-sm font-bold cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F4EDE0] text-[#1E1A17] flex flex-col">
      {/* Top Ribbon */}
      <PitaTenun />

      {/* Top Header Bar */}
      <header className="max-w-4xl w-full mx-auto px-4 py-3 flex items-center justify-between gap-4 border-b-[1.5px] border-[#1E1A17]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup Pelajaran"
          className="p-1.5 rounded-[4px] border border-[#1E1A17] bg-[#EADBCE] text-[#1E1A17] hover:bg-[#D9CDBF] transition-colors cursor-pointer"
        >
          <X size={22} />
        </button>

        {/* Progress Bar Tenun */}
        <div
          className="flex-1 progress-tenun-container h-4"
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
        <div className="flex items-center gap-1.5 font-bold text-[#A62B1F] bg-[#EADBCE] border-[1.5px] border-[#1E1A17] px-3 py-1 rounded-[4px]">
          <Heart size={18} className="fill-[#A62B1F] text-[#A62B1F]" />
          <span className="text-base font-heading font-bold text-[#1E1A17]">{hearts}</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#A62B1F] bg-[#EADBCE] border border-[#1E1A17] px-2.5 py-0.5 rounded-[4px]">
                {currentQ.type === 'multiple_choice' && 'Pilihan Ganda'}
                {currentQ.type === 'listening' && 'Latihan Mendengar'}
                {currentQ.type === 'sentence_builder' && 'Susun Kalimat'}
                {currentQ.type === 'match_pairs' && 'Cocokkan Pasangan'}
                {currentQ.type === 'pronunciation' && 'Latihan Pelafalan'}
              </span>
              <h1 className="text-xl sm:text-2xl font-heading text-[#1E1A17] mt-2 tracking-tight leading-snug">
                {currentQ.prompt}
              </h1>

              {/* Batak phrase card with audio trigger */}
              {currentQ.batakText && currentQ.type !== 'listening' && currentQ.type !== 'pronunciation' && (
                currentQ.type !== 'multiple_choice' ||
                currentQ.prompt.toLowerCase().includes(currentQ.batakText.toLowerCase())
              ) && (
                <div className="mt-3 inline-flex items-center gap-3 bg-[#EADBCE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-2.5 px-4">
                  <button
                    type="button"
                    onClick={() => speakBatakWord(currentQ.batakText!)}
                    aria-label={`Dengarkan ${currentQ.batakText}`}
                    className="btn-indigo w-9 h-9 rounded-[4px] flex items-center justify-center cursor-pointer"
                  >
                    <Volume2 size={20} />
                  </button>
                  <div>
                    <span className="text-lg font-heading font-bold text-[#1E1A17] block tracking-tight">
                      &ldquo;{currentQ.batakText}&rdquo;
                    </span>
                    {currentQ.phonetic && (
                      <span className="text-xs text-[#1E1A17]/70 font-medium">
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
            <div className="mt-4">
              {currentQ.type === 'listening' && currentQ.batakText && (
                <div className="flex items-center justify-center py-6 mb-4">
                  <button
                    type="button"
                    onClick={() => speakBatakWord(currentQ.batakText!)}
                    className="btn-indigo px-6 py-3.5 text-base font-bold flex items-center gap-3 cursor-pointer"
                  >
                    <Volume2 size={24} /> Putar Audio Penutur Asli
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
                      className={`p-4 rounded-[4px] border-[1.5px] text-left font-bold transition-all text-base sm:text-lg flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#162238] bg-[#23365A] text-[#F4EDE0] border-b-[3px] border-b-[#162238]'
                          : 'border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] border-b-[3px] border-b-[#1E1A17] hover:bg-[#EADBCE] active:translate-y-[2px]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-[4px] border flex items-center justify-center text-xs font-bold ${
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
            <div className="mt-4">
              {/* Answer Slot */}
              <div className="min-h-20 p-4 border-[1.5px] border-[#1E1A17] rounded-[4px] flex flex-wrap gap-2 items-center mb-6 bg-[#EADBCE]/50">
                {selectedWords.length === 0 ? (
                  <span className="text-[#1E1A17]/60 italic text-sm">
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
                      className="px-4 py-2 rounded-[4px] bg-[#23365A] text-[#F4EDE0] border-[1.5px] border-[#162238] border-b-[3px] border-b-[#162238] font-bold cursor-pointer active:translate-y-[2px]"
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
                    className="px-4 py-2 rounded-[4px] bg-[#F4EDE0] text-[#1E1A17] border-[1.5px] border-[#1E1A17] border-b-[3px] border-b-[#1E1A17] font-bold hover:bg-[#EADBCE] cursor-pointer active:translate-y-[2px]"
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
                <span className="text-xs font-bold text-[#A62B1F] uppercase tracking-wide">
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
                      className={`p-3.5 rounded-[4px] border-[1.5px] font-bold text-left transition-all ${
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

              {/* Indonesian Column (Diacak) */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-[#23365A] uppercase tracking-wide">
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
                      className={`p-3.5 rounded-[4px] border-[1.5px] font-bold text-left transition-all ${
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
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="card-batak bg-[#F4EDE0] p-6 max-w-md w-full mb-6 text-center">
                <p className="text-[#A62B1F] text-xs font-bold uppercase tracking-wider mb-2">
                  Target Pelafalan
                </p>
                <p className="text-3xl font-heading font-bold text-[#1E1A17] tracking-tight">
                  &ldquo;{currentQ.batakText}&rdquo;
                </p>
                {currentQ.syllables && (
                  <div className="flex justify-center gap-1.5 mt-2">
                    {currentQ.syllables.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-[4px] bg-[#EADBCE] text-[#1E1A17] text-sm font-semibold border border-[#1E1A17]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[#1E1A17]/75 text-sm mt-3 italic font-body">
                  Artinya: &ldquo;{currentQ.translation}&rdquo;
                </p>
              </div>

              {/* Mic interaction button */}
              <button
                type="button"
                disabled={isRecording}
                onClick={startVoiceRecording}
                className={`w-20 h-20 rounded-[4px] flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-[#A62B1F] text-[#F4EDE0] border-2 border-[#1E1A17] animate-pulse'
                    : 'btn-secang text-[#F4EDE0]'
                }`}
              >
                <Mic size={32} />
              </button>
              <p className="text-sm font-bold text-[#1E1A17] mt-3">
                {isRecording ? 'Mendengarkan suara Anda...' : 'Klik Mikrofon & Ucapkan'}
              </p>

              {recordedAccuracy !== null && (
                <div className="mt-4 p-3 bg-[#EADBCE] rounded-[4px] border-[1.5px] border-[#1E1A17] text-sm font-bold text-[#1E1A17]">
                  Skor Akurasi: <span className="text-[#23365A] text-lg font-heading font-bold">{recordedAccuracy}%</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Feedback / Check Bar */}
        <div className="mt-8 pt-4">
          <div className="mb-4">
            <PitaTenun />
          </div>

          {!isChecked ? (
            <div className="flex justify-end">
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
                className="btn-indigo w-full sm:w-auto px-8 py-3.5 text-base font-bold disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
              >
                Periksa Jawaban
              </button>
            </div>
          ) : (
            <div
              className={`p-4 sm:p-5 rounded-[4px] border-[1.5px] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-150 ${
                isCorrect
                  ? 'bg-[#EADBCE] border-[#23365A] text-[#1E1A17]'
                  : 'bg-[#F5E2DF] border-[#A62B1F] text-[#1E1A17]'
              }`}
            >
              <div className="flex items-start gap-3 w-full sm:w-auto">
                {isCorrect ? (
                  <CheckCircle2 size={32} className="text-[#23365A] shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={32} className="text-[#A62B1F] shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-lg font-heading font-bold tracking-tight">
                    {isCorrect ? 'Luar Biasa! (Sintong)' : 'Kurang Tepat (Sala)'}
                  </h3>
                  {!isCorrect && (
                    <div className="text-xs sm:text-sm mt-1">
                      <span className="font-semibold text-[#1E1A17]/80">Jawaban yang tepat: </span>
                      <span className="font-bold text-[#A62B1F]">
                        {Array.isArray(currentQ.correctAnswer)
                          ? currentQ.correctAnswer.join(' ')
                          : currentQ.correctAnswer}
                      </span>
                    </div>
                  )}
                  {currentQ.culturalTip && (
                    <p className="text-xs text-[#1E1A17]/80 mt-1 italic">
                      Tip Budaya: {currentQ.culturalTip}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className={`w-full sm:w-auto px-8 py-3 text-base font-bold cursor-pointer shrink-0 ${
                  isCorrect ? 'btn-indigo' : 'btn-secang'
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
