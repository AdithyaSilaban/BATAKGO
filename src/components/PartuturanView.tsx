import React, { useState } from 'react';
import { Users, Search, HelpCircle, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { PARTUTURAN_RULES, findPartuturan } from '../utils/partuturan';
import { AudioPronunciationButton } from './AudioPronunciationButton';
import { Mascot } from './Mascot';

export const PartuturanView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = findPartuturan(search).filter(item => {
    if (activeCategory === 'all') return true;
    return item.dalihanCategory === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-red-950 to-stone-900 rounded-3xl p-6 text-white mb-6 border-2 border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-red-600/60 border border-red-400 px-3 py-1 rounded-full inline-block mb-2">
            Filsafat Adat & Kekerabatan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka',sans-serif]">
            Partuturan & Dalihan Na Tolu
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-lg">
            Sistem kekerabatan Batak yang kaya nilai martabat. Cari tahu panggilan adat yang tepat untuk kerabat, sahabat, dan mertua.
          </p>
        </div>
        <Mascot
          mood="thinking"
          size="lg"
          speech="Tanda do partuturan di halak Batak!"
          subSpeech="Kenali silsilah dan panggilannya"
          showStatusLabel={false}
        />
      </div>

      {/* Dalihan Na Tolu 3 Pillars Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">☀️</span>
            <h3 className="font-extrabold text-red-900 text-sm font-['Fredoka',sans-serif]">
              Somba Marhula-hula
            </h3>
          </div>
          <p className="text-xs text-red-800 font-medium">
            Hormat kepada keluarga pihak ibu atau istri (Tulang & Hula-hula) sebagai sumber berkat doa restu.
          </p>
        </div>

        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">🌸</span>
            <h3 className="font-extrabold text-amber-900 text-sm font-['Fredoka',sans-serif]">
              Elek Marboru
            </h3>
          </div>
          <p className="text-xs text-amber-800 font-medium">
            Mengayomi, bersikap lembut dan melindungi pihak perempuan (saudara perempuan & keluarga boru).
          </p>
        </div>

        <div className="bg-stone-100 border-2 border-stone-300 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">🤝</span>
            <h3 className="font-extrabold text-stone-900 text-sm font-['Fredoka',sans-serif]">
              Manat Mardongan Tubu
            </h3>
          </div>
          <p className="text-xs text-stone-800 font-medium">
            Hati-hati, menjaga kesopanan dan kerukunan erat dengan sesama saudara satu marga.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Ketik hubungan kerabat (misal: paman, ibu, saudara perempuan, tulang)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-2 border-stone-300 focus:border-red-600 focus:outline-none font-medium text-stone-800 shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {['all', 'Hula-hula', 'Dongan Tubu', 'Boru', 'Umum'].map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap border-2 transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-stone-800 text-white border-stone-900 shadow-[0_2px_0_0_#1c1917]'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            {cat === 'all' ? 'Semua Hubungan' : cat}
          </button>
        ))}
      </div>

      {/* Partuturan Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border-2 border-stone-200 p-5 shadow-sm hover:border-red-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  {item.relation}
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  item.dalihanCategory === 'Hula-hula'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : item.dalihanCategory === 'Boru'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-stone-100 text-stone-700 border-stone-200'
                }`}>
                  {item.dalihanCategory}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-black text-stone-900 font-['Fredoka',sans-serif]">
                  {item.batakTerm}
                </h3>
              </div>

              <p className="text-xs text-stone-600 mt-2 font-medium leading-relaxed">
                {item.description}
              </p>

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 mt-3 text-xs">
                <span className="font-bold text-stone-700">Panggilan Balasan: </span>
                <span className="text-red-700 font-extrabold">{item.counterTerm}</span>
                <p className="text-stone-500 mt-1 italic">&ldquo;{item.example}&rdquo;</p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
              <AudioPronunciationButton
                text={item.batakTerm}
                size="sm"
                showSlowOption={true}
                allowPractice={true}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
