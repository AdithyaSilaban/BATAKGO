import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { VOCABULARY_LIST } from '../utils/batakData';
import { AudioPronunciationButton } from './AudioPronunciationButton';
import { Mascot } from './Mascot';
import { PitaTenun } from './GorgaEmblem';

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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 font-body">
      {/* Header Banner */}
      <div className="bg-[#1E1A17] rounded-[4px] p-4 sm:p-6 text-[#F4EDE0] mb-4 sm:mb-6 border-[1.5px] border-[#1E1A17] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <PitaTenun className="absolute top-0 left-0 right-0" />

        <div className="pt-2 text-center sm:text-left">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#2C2622] text-[#F4EDE0] border border-[#433D38] px-2.5 py-0.5 rounded-[2px] inline-block mb-1.5 sm:mb-2">
            Pustaka Kata Penutur Asli
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F4EDE0]">
            Kamus Saku Bahasa Batak
          </h1>
          <p className="text-[#E8DFC8] text-xs sm:text-sm mt-1 max-w-lg font-medium">
            Dengarkan pelafalan asli, pelajari suku kata pemenggalan, dan uji suara pelafalan Anda lewat mikrofon bersama Sigale-gale.
          </p>
        </div>
        <Mascot
          mood="thinking"
          size="sm"
          showStatusLabel={false}
        />
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3 sm:mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#433D38]" size={18} />
          <input
            type="text"
            placeholder="Cari kata Batak atau artinya (horas, terima kasih)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] rounded-[4px] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] font-semibold text-[#1E1A17] text-base sm:text-sm"
          />
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 sm:mb-6 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-[4px] font-bold text-xs whitespace-nowrap border-[1.5px] transition cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#23365A] text-[#F4EDE0] border-[#162238]'
                : 'bg-[#FAF6EE] text-[#1E1A17] border-[#1E1A17] hover:bg-[#E8DFC8]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Vocab Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {filtered.map(item => (
          <div
            key={item.id}
            className="card-batak p-3.5 sm:p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2.5 mb-2">
                <div>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1E1A17] tracking-tight">
                    {item.batak}
                  </h3>
                  <p className="text-xs text-[#A62B1F] font-semibold italic">
                    /{item.phonetic}/
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1A17] bg-[#E8DFC8] px-2 py-0.5 rounded-[2px] border border-[#1E1A17] shrink-0">
                  {item.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#1E1A17] font-bold mt-1">
                {item.indonesian}
              </p>

              {item.exampleBatak && (
                <div className="bg-[#E8DFC8]/50 rounded-[4px] p-2.5 my-2.5 border border-[#1E1A17] text-xs">
                  <p className="font-bold text-[#1E1A17] italic">
                    &ldquo;{item.exampleBatak}&rdquo;
                  </p>
                  <p className="text-[#433D38] mt-0.5">
                    {item.exampleIndonesian}
                  </p>
                </div>
              )}
            </div>

            {/* Audio & Practice Controls */}
            <div className="pt-2 border-t border-[#1E1A17]/20 flex items-center justify-between">
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
          <div className="col-span-full text-center py-12 text-[#433D38] card-batak p-8">
            <p className="text-base font-bold">Ndang adong kosakata na dapot</p>
            <p className="text-xs mt-1">Tidak ada kosakata yang cocok dengan pencarian &ldquo;{search}&rdquo;.</p>
          </div>
        )}
      </div>
    </div>
  );
};
