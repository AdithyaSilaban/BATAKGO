import React, { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen, Volume2 } from 'lucide-react';
import { latinToAksaraBatak, INA_NI_SURAT } from '../utils/aksaraBatak';
import { Mascot } from './Mascot';
import { speakBatakWord } from '../utils/audioSynthesizer';
import { GorgaBorder } from './GorgaEmblem';

export const AksaraBatakView: React.FC = () => {
  const [inputText, setInputText] = useState('horas ma di hita');
  const [copied, setCopied] = useState(false);

  const convertedAksara = latinToAksaraBatak(inputText);

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedAksara);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const samplePhrases = [
    'horas',
    'mauliate',
    'dalihan na tolu',
    'sigale-gale',
    'tao toba na uli'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-[#18181B] rounded-2xl p-6 text-white mb-6 border border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <GorgaBorder className="absolute top-0 left-0 right-0 h-2 opacity-80" />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
            Surat Batak Toba
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Konverter Aksara Batak
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-lg">
            Aksara Batak adalah aksara abugida peninggalan leluhur suku Batak. Ketik teks latin di bawah untuk melihat wujud aslinya dalam aksara Batak.
          </p>
        </div>
        <Mascot
          mood="thinking"
          size="lg"
          speech="Ketik namamu atau kalimat Batak kesukaanmu!"
          showStatusLabel={false}
        />
      </div>

      {/* Interactive Transliteration Box */}
      <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-md p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="latin-input" className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Teks Latin Batak
            </label>
            <textarea
              id="latin-input"
              rows={2}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ketik teks latin di sini..."
              className="w-full p-4 rounded-2xl border-2 border-stone-300 focus:border-red-600 focus:outline-none font-bold text-stone-800 text-lg"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 font-bold">Contoh:</span>
            {samplePhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(phrase)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-700 text-xs font-bold border border-stone-200 transition-colors cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>

          {/* Aksara Batak Output Display */}
          <div className="mt-2 bg-stone-900 rounded-2xl p-6 text-white border-2 border-stone-800 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                ᯅᯖᯂ᯲ Hasil Surat Batak
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl border border-white/20 cursor-pointer transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Tersalin!' : 'Salin Aksara'}
              </button>
            </div>

            <div className="py-4 text-center">
              <p className="text-4xl sm:text-5xl tracking-widest text-amber-300 font-['Noto_Sans_Batak',serif] min-h-16 flex items-center justify-center break-all select-all">
                {convertedAksara || 'ᯀ'}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
              <span>Transliterasi Abugida Batak Toba</span>
              <button
                type="button"
                onClick={() => speakBatakWord(inputText)}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer"
              >
                <Volume2 size={16} /> Dengarkan Suara
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ina ni Surat (Alphabet Reference Table) */}
      <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="text-red-600" size={24} />
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Ina ni Surat (Induk Huruf Batak)
          </h2>
        </div>
        <p className="text-xs text-stone-600 mb-6">
          Setiap huruf induk pada aksara Batak secara inheren memiliki vokal [a] jika tidak dilekatkan anak ni surat.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {Object.entries(INA_NI_SURAT).map(([key, unicode]) => (
            <div
              key={key}
              onClick={() => {
                setInputText(prev => (prev ? prev + ' ' + key : key));
              }}
              className="p-3 rounded-2xl bg-stone-50 border-2 border-stone-200 hover:border-amber-500 hover:bg-amber-50 transition-all text-center cursor-pointer group"
            >
              <span className="text-3xl text-stone-900 font-['Noto_Sans_Batak',serif] block group-hover:scale-110 transition-transform">
                {unicode}
              </span>
              <span className="text-xs font-bold text-stone-500 uppercase mt-1 block">
                {key}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
