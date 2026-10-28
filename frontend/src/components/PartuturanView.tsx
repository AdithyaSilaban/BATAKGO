import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { PitaTenun } from './GorgaEmblem';
import { findPartuturan } from '../utils/partuturan';
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
    <div className="max-w-4xl mx-auto px-4 py-6 font-body">
      {/* Banner */}
      <div className="bg-[#1E1A17] rounded-[4px] p-6 text-[#F4EDE0] mb-6 border-[1.5px] border-[#1E1A17] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <PitaTenun className="absolute top-0 left-0 right-0" />
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#2C2622] text-[#F4EDE0] border border-[#433D38] px-2.5 py-0.5 rounded-[2px] inline-block mb-2">
            Kekerabatan Adat Batak Toba
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F4EDE0]">
            Partuturan & Dalihan Na Tolu
          </h1>
          <p className="text-[#E8DFC8] text-sm mt-1 max-w-lg font-medium">
            Sistem silsilah kekerabatan Batak Toba. Cari sapaan adat yang tepat untuk kerabat, sahabat, dan mertua.
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

      {/* Dalihan Na Tolu 3 Pillars: Struktur Panel Papan Datar */}
      <div className="border-[1.5px] border-[#1E1A17] rounded-[4px] bg-[#FAF6EE] p-4 mb-6">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-[#A62B1F] mb-3">
          Prinsip Dalihan Na Tolu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="border border-[#1E1A17] p-3 rounded-[2px] bg-[#F4EDE0]">
            <h3 className="font-heading font-bold text-sm text-[#1E1A17]">
              1. Somba Marhula-hula
            </h3>
            <p className="text-xs text-[#433D38] mt-1 font-medium leading-relaxed">
              Hormat kepada keluarga pihak ibu atau istri (Tulang & Hula-hula).
            </p>
          </div>

          <div className="border border-[#1E1A17] p-3 rounded-[2px] bg-[#F4EDE0]">
            <h3 className="font-heading font-bold text-sm text-[#1E1A17]">
              2. Elek Marboru
            </h3>
            <p className="text-xs text-[#433D38] mt-1 font-medium leading-relaxed">
              Mengayomi dan melindungi pihak perempuan (saudara perempuan & boru).
            </p>
          </div>

          <div className="border border-[#1E1A17] p-3 rounded-[2px] bg-[#F4EDE0]">
            <h3 className="font-heading font-bold text-sm text-[#1E1A17]">
              3. Manat Mardongan Tubu
            </h3>
            <p className="text-xs text-[#433D38] mt-1 font-medium leading-relaxed">
              Menjaga kesopanan dan kerukunan erat dengan sesama saudara satu marga.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#433D38]" size={18} />
          <input
            type="text"
            placeholder="Ketik hubungan kerabat (misal: paman, ibu, saudara perempuan, tulang)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] rounded-[4px] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] font-semibold text-[#1E1A17] text-sm"
          />
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {['all', 'Hula-hula', 'Dongan Tubu', 'Boru', 'Umum'].map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-[4px] font-bold text-xs whitespace-nowrap border-[1.5px] transition cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#23365A] text-[#F4EDE0] border-[#162238]'
                : 'bg-[#FAF6EE] text-[#1E1A17] border-[#1E1A17] hover:bg-[#E8DFC8]'
            }`}
          >
            {cat === 'all' ? 'Semua Hubungan' : cat}
          </button>
        ))}
      </div>

      {/* Partuturan Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.map(item => (
          <div
            key={item.id}
            className="card-batak p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-heading text-2xl font-bold text-[#A62B1F] tracking-tight">
                  {item.batakTerm}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1A17] bg-[#E8DFC8] px-2 py-0.5 rounded-[2px] border border-[#1E1A17]">
                  {item.dalihanCategory}
                </span>
              </div>

              <div className="text-xs text-[#1E1A17] font-semibold mb-2">
                <span className="text-[#433D38]">Hubungan: </span>
                {item.relation}
              </div>

              <p className="text-xs text-[#433D38] leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1E1A17]/30 flex items-center justify-between">
              <AudioPronunciationButton
                text={item.batakTerm}
                size="sm"
                showSlowOption={false}
                allowPractice={true}
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center bg-[#FAF6EE] rounded-[4px] border-[1.5px] border-dashed border-[#1E1A17]">
            <Mascot mood="sad" size="md" className="mx-auto mb-3" />
            <p className="text-[#1E1A17] font-bold">
              Hubungan kerabat &ldquo;{search}&rdquo; tidak ditemukan.
            </p>
            <p className="text-[#433D38] text-xs mt-1">
              Coba cari hubungan lain seperti "paman", "saudara", atau "mertua".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
