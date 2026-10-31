import React, { useState } from 'react';
import { Copy, Check, BookOpen, Volume2 } from 'lucide-react';
import { latinToAksaraBatak, INA_NI_SURAT } from '../utils/aksaraBatak';
import { Mascot } from './Mascot';
import { speakBatakWord } from '../utils/audioSynthesizer';
import { PitaTenun } from './GorgaEmblem';

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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 font-body">
      {/* Header Banner */}
      <div className="bg-[#1E1A17] rounded-[4px] p-4 sm:p-6 text-[#F4EDE0] mb-4 sm:mb-6 border-[1.5px] border-[#1E1A17] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <PitaTenun className="absolute top-0 left-0 right-0" />
        <div className="pt-2 text-center sm:text-left">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#2C2622] text-[#F4EDE0] border border-[#433D38] px-2.5 py-0.5 rounded-[2px] inline-block mb-1.5 sm:mb-2">
            Surat Batak Toba
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F4EDE0]">
            Konverter Aksara Batak
          </h1>
          <p className="text-[#E8DFC8] text-xs sm:text-sm mt-1 max-w-lg font-medium">
            Aksara Batak adalah aksara abugida tradisional. Ketik teks latin di bawah untuk melihat wujud aslinya dalam aksara Batak.
          </p>
        </div>
        <Mascot
          mood="thinking"
          size="sm"
          showStatusLabel={false}
        />
      </div>

      {/* Interactive Transliteration Box */}
      <div className="card-batak p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col gap-3.5 sm:gap-4">
          <div>
            <label htmlFor="latin-input" className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1.5">
              Teks Latin Batak
            </label>
            <textarea
              id="latin-input"
              rows={2}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ketik teks latin di sini..."
              className="w-full p-3 sm:p-3.5 rounded-[4px] bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] font-bold text-[#1E1A17] text-base"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#433D38] font-bold">Contoh:</span>
            {samplePhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(phrase)}
                className="px-2.5 py-1 rounded-[2px] bg-[#E8DFC8] hover:bg-[#F4EDE0] text-[#1E1A17] text-xs font-bold border border-[#1E1A17] transition cursor-pointer"
              >
                {phrase}
              </button>
            ))}
          </div>

          {/* Aksara Batak Output Display */}
          <div className="mt-2 bg-[#1E1A17] rounded-[4px] p-4 sm:p-6 text-[#F4EDE0] border-[1.5px] border-[#1E1A17] relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-batak text-xs sm:text-sm text-[#D9A21B]" style={{ fontWeight: 400, fontSynthesis: 'none' }}>
                ᯅᯖᯂ᯲ Hasil Surat Batak
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="btn-outline-arang px-2.5 py-1 text-xs"
              >
                {copied ? <Check size={13} className="text-[#A62B1F] mr-1" /> : <Copy size={13} className="mr-1" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            <div className="py-4 sm:py-6 text-center overflow-x-auto no-scrollbar">
              <p
                className="font-batak text-3xl sm:text-5xl text-[#D9A21B] min-h-14 sm:min-h-16 flex items-center justify-center break-all select-all tracking-wider px-2"
                style={{ fontWeight: 400, fontSynthesis: 'none' }}
              >
                {convertedAksara || 'ᯀ'}
              </p>
            </div>

            <div className="pt-2.5 border-t border-[#433D38] flex items-center justify-between text-xs text-[#E8DFC8]">
              <span className="text-[11px] sm:text-xs">Transliterasi Abugida Batak Toba</span>
              <button
                type="button"
                onClick={() => speakBatakWord(inputText)}
                className="text-[#D9A21B] hover:underline flex items-center gap-1 font-bold cursor-pointer text-xs"
              >
                <Volume2 size={14} /> Dengarkan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ina ni Surat */}
      <div className="card-batak p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="text-[#A62B1F]" size={18} />
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1E1A17] tracking-tight">
            Ina ni Surat (Induk Huruf Batak)
          </h2>
        </div>
        <p className="text-xs text-[#433D38] mb-4 font-medium leading-relaxed">
          Setiap huruf induk pada aksara Batak secara inheren memiliki vokal [a] jika tidak dilekatkan anak ni surat.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
          {Object.entries(INA_NI_SURAT).map(([key, unicode]) => (
            <div
              key={key}
              onClick={() => {
                setInputText(prev => (prev ? prev + ' ' + key : key));
              }}
              className="p-2 sm:p-3 rounded-[2px] bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] hover:bg-[#E8DFC8] transition text-center cursor-pointer select-none"
            >
              <div
                className="font-batak text-2xl sm:text-3xl text-[#1E1A17] mb-0.5 sm:mb-1 leading-none select-none"
                style={{ fontWeight: 400, fontSynthesis: 'none' }}
              >
                {unicode}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[#A62B1F] tracking-wide uppercase">
                {key}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
