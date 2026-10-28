/**
 * BATAKGO Audio & Native Pronunciation Engine
 * 
 * Features:
 * 1. Web Speech Synthesis tuned for Batak phonetics & intonation (normal & slow speed)
 * 2. Web Audio API Acoustic Synthesizer for traditional Batak musical feedback:
 *    - Ogung (Sacred Batak Gong)
 *    - Gordang (Traditional Batak Drum rhythm)
 *    - Hasapi (Two-stringed Batak lute pluck)
 *    - Wholesome success & error cues
 * 3. Speech Recognition evaluation for user pronunciation practice
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays traditional Batak Gong (Ogung) sound using additive synthesis with realistic bronze harmonics
 */
export function playOgungGong() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Fundamental + partial frequencies for bronze gong
    const freqs = [130, 260, 395, 520, 810];
    const gains = [0.6, 0.35, 0.2, 0.1, 0.05];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // Slight pitch bend characteristic of hit gong
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 1.2);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.3);
    });
  } catch (err) {
    console.warn('Audio playback not supported:', err);
  }
}

/**
 * Plays traditional Gordang drum celebratory beats (two resonant beats)
 */
export function playGordangBeat() {
  try {
    const ctx = getAudioContext();
    const playSingleBeat = (time: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + duration);

      gain.gain.setValueAtTime(0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    };

    const now = ctx.currentTime;
    playSingleBeat(now, 140, 0.18);
    playSingleBeat(now + 0.14, 110, 0.25);
  } catch (err) {
    console.warn('Gordang audio error:', err);
  }
}

/**
 * Plays Hasapi (Batak string pluck) for word clicks
 */
export function playHasapiPluck(pitch = 440) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (err) {
    console.warn('Pluck audio error:', err);
  }
}

/**
 * Plays mistake sound (friendly wooden thud)
 */
export function playMistakeSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.28);

    // Filter to make it soft and wooden
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  } catch (err) {
    console.warn('Mistake sound error:', err);
  }
}

/**
 * High-quality Batak Voice Pronunciation using SpeechSynthesis with tuned pitch and cadence
 */
export function speakBatakWord(
  text: string,
  options?: {
    speed?: number; // 1.0 = normal, 0.6 = slow syllable
    onStart?: () => void;
    onEnd?: () => void;
  }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    options?.onEnd?.();
    return;
  }

  window.speechSynthesis.cancel(); // Stop any pending speech

  const speed = options?.speed ?? 1.0;
  
  // Format text phonetically for smoother regional vocalization
  const formattedText = text
    .replace(/-/g, ' ')
    .replace(/hula-hula/gi, 'hula hula');

  const utterance = new SpeechSynthesisUtterance(formattedText);
  utterance.rate = speed;
  utterance.pitch = speed < 0.9 ? 1.05 : 1.1; // Slightly warm resonant tone

  // Look for Indonesian or Malay voice for best Batak phoneme approximation
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(v => v.lang.startsWith('id') || v.lang.startsWith('ms'));
  if (idVoice) {
    utterance.voice = idVoice;
  }
  utterance.lang = 'id-ID';

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;
  utterance.onerror = () => options?.onEnd?.();

  window.speechSynthesis.speak(utterance);
}

/**
 * Calculates similarity score (0 to 100) between user spoken text and target Batak phrase
 */
export function calculatePronunciationAccuracy(spoken: string, target: string): number {
  if (!spoken || !target) return 0;
  const s = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const t = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  if (s === t) return 100;

  // Normalized Levenshtein distance
  const matrix: number[][] = [];
  const m = s.length;
  const n = t.length;

  for (let i = 0; i <= m; i++) matrix[i] = [i];
  for (let j = 0; j <= n; j++) matrix[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  const distance = matrix[m][n];
  const maxLen = Math.max(m, n);
  const similarity = Math.max(0, Math.round((1 - distance / maxLen) * 100));

  // Word token overlap bonus if words are in correct set
  const sWords = s.split(/\s+/);
  const tWords = t.split(/\s+/);
  const common = sWords.filter(w => tWords.includes(w));
  const wordOverlapScore = Math.round((common.length / Math.max(sWords.length, tWords.length)) * 100);

  return Math.min(100, Math.max(similarity, wordOverlapScore));
}
