import React, { useState } from 'react';
import { Search, Volume2, Mic, Filter, BookOpen } from 'lucide-react';
import { VOCABULARY_LIST, VocabItem } from '../utils/batakData';
import { AudioPronunciationButton } from './AudioPronunciationButton';
import { Mascot } from './Mascot';
import { GorgaBorder } from './GorgaEmblem';

export const DictionaryView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Kosakata' },
    { id: 'sapaan', label: 'Sapaan & Salam' },
    { id: 'keluarga', label: 'Keluarga & Partuturan' },
    { id: 'angka', label: 'Angka & Waktu' },
    { id: 'kata_kerja', label: 'Aktivitas / Kata Kerja' },
    { id: 'budaya', label: 'Budaya & Adat' },
    { id: 'sifat', label: 'Kata Sifat' }
  ];

  const filtered = VOCABULARY_LIST.filter(item => {
    const matchesSearch =
      item.batak.toLowerCase().includes(search.toLowerCase()) ||
      item.indonesian.toLowerCase().includes(search.toLowerCase()) ||
      item.phonetic.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-[#18181B] rounded-2xl p-6 text-white mb-6 border border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <GorgaBorder className="absolute top-0 left-0 right-0 h-2 opacity-80" />


        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
            Pustaka Kata Penutur Asli
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Kamus Saku Bahasa Batak
          </h1>
          <p className="text-stone-200 text-sm mt-1 max-w-lg">
            Dengarkan pelafalan asli, pelajari suku kata pemenggalan, dan uji suara pelafalan Anda lewat mikrofon bersama Sigale-gale.
          </p>
        </div>
        <Mascot
          mood="thinking"
          size="lg"
          speech="Gunakan tombol mikrofon untuk uji suaramu!"
          showStatusLabel={false}
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Cari kata Batak atau artinya (misal: horas, terima kasih, mangan)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-2 border-stone-300 focus:border-red-600 focus:outline-none font-medium text-stone-800 shadow-sm"
          />
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap border-2 transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white border-red-800 shadow-[0_2px_0_0_#991b1b]'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Vocab Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border-2 border-stone-200 p-4 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-xl font-black text-stone-900 tracking-tight">
                    {item.batak}
                  </h3>
                  <p className="text-sm font-semibold text-stone-600">
                    {item.indonesian}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                  {item.category}
                </span>
              </div>

              {/* Example sentences */}
              <div className="bg-stone-50 rounded-xl p-2.5 my-3 border border-stone-100 text-xs">
                <p className="font-bold text-stone-800 italic">
                  &ldquo;{item.exampleBatak}&rdquo;
                </p>
                <p className="text-stone-500 mt-0.5">
                  {item.exampleIndonesian}
                </p>
              </div>
            </div>

            {/* Audio & Practice Controls */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <AudioPronunciationButton
                text={item.batak}
                phonetic={item.phonetic}
                syllables={item.syllables}
                size="sm"
                showSlowOption={true}
                allowPractice={true}
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-stone-300">
            <Mascot mood="sad" size="md" className="mx-auto mb-3" />
            <p className="text-stone-600 font-bold">
              Kosakata &ldquo;{search}&rdquo; tidak ditemukan.
            </p>
            <p className="text-stone-400 text-xs mt-1">
              Coba cari kata lain seperti "horas", "lae", atau "tulang".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
