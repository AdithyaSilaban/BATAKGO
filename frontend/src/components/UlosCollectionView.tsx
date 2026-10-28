import React from 'react';
import { Award, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import { Mascot } from './Mascot';
import { GorgaBorder } from './GorgaEmblem';

interface UlosItem {
  id: string;
  name: string;
  batakFunction: string;
  description: string;
  unlocked: boolean;
  colorPattern: string;
  motifName: string;
}

const ALL_ULOS: UlosItem[] = [
  {
    id: 'ulos-mangiring',
    name: 'Ulos Mangiring',
    batakFunction: 'Tanda Kasih & Harapan Keturunan / Langkah Awal',
    description: 'Diberikan kepada anak sulung atau seseorang yang memulai perjuangan baru, sebagai doa agar terus diiringi keberkahan dan kebaikan.',
    unlocked: true,
    colorPattern: 'from-[#7F1D1D] via-[#1C1917] to-[#B45309]',
    motifName: 'Motif Pinar Halak-halak'
  },
  {
    id: 'ulos-ragidup',
    name: 'Ulos Ragidup',
    batakFunction: 'Lambang Kehidupan Tertinggi (Raja ni Ulos)',
    description: 'Ulos paling tinggi derajatnya dalam adat Batak. Memiliki tenunan rumit yang melambangkan keabadian hidup dan kerukunan keluarga besar.',
    unlocked: true,
    colorPattern: 'from-[#18181B] via-[#7F1D1D] to-[#18181B]',
    motifName: 'Motif Sialtong & Sigumang'
  },
  {
    id: 'ulos-sibolang',
    name: 'Ulos Sibolang',
    batakFunction: 'Tanda Kehormatan & Kedewasaan',
    description: 'Dipakai pada upacara adat dukacita maupun sukacita untuk menunjukkan rasa hormat kepada orang tua dan leluhur.',
    unlocked: false,
    colorPattern: 'from-[#0F172A] via-[#1E293B] to-[#334155]',
    motifName: 'Motif Simarpusoran'
  },
  {
    id: 'ulos-sadum',
    name: 'Ulos Sadum',
    batakFunction: 'Kegembiraan & Kemeriahan Pesta',
    description: 'Ulos dengan warna-warna cerah ceria (merah, emas, hijau) yang melambangkan keceriaan hati (marlas ni roha) dalam perayaan.',
    unlocked: false,
    colorPattern: 'from-[#B45309] via-[#991B1B] to-[#065F46]',
    motifName: 'Motif Bunga Harungguan'
  },
  {
    id: 'ulos-bintang-maratur',
    name: 'Ulos Bintang Maratur',
    batakFunction: 'Keteraturan & Doa Kejayaan',
    description: 'Menggambarkan bintang-bintang yang berbaris teratur di langit malam Toba, lambang keluarga yang rukun dan taat adat.',
    unlocked: false,
    colorPattern: 'from-[#1C1917] via-[#450A0A] to-[#78350F]',
    motifName: 'Motif Bintang Maratur'
  }
];

export const UlosCollectionView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#18181B] via-[#27272A] to-[#7F1D1D] rounded-3xl text-white mb-8 border border-stone-800 shadow-xl overflow-hidden relative">
        <GorgaBorder />

        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-stone-200 inline-block mb-2">
              Warisan Tenun Tradisional
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Galeri Koleksi Ulos Adat Batak
            </h1>
            <p className="text-stone-300 text-sm mt-1.5 max-w-lg leading-relaxed">
              Ulos adalah simbol kehangatan, restu, dan perlindungan spiritual suku Batak. Kumpulkan koleksi tenun ulos dengan menyelesaikan unit-unit pelajaran!
            </p>
          </div>
          <Mascot
            mood="happy"
            size="lg"
            speech="Gale bangga memakai ulos tenun Batak!"
            showStatusLabel={false}
          />
        </div>
      </div>

      {/* Grid of Ulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ALL_ULOS.map(ulos => (
          <div
            key={ulos.id}
            className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
              ulos.unlocked
                ? 'bg-white border-stone-200 shadow-xs hover:border-[#991B1B]/40 hover:shadow-sm'
                : 'bg-stone-50/70 border-dashed border-stone-300 opacity-70'
            }`}
          >
            <div>
              {/* Ulos Fabric Banner Visual */}
              <div
                className={`h-24 rounded-xl bg-gradient-to-r ${ulos.colorPattern} p-3.5 flex flex-col justify-between text-white shadow-inner mb-4 relative overflow-hidden`}
              >
                {/* Traditional fringe threads at the ends */}
                <div className="absolute top-0 right-0 bottom-0 w-3 bg-[repeating-linear-gradient(45deg,#fff,#fff_2px,transparent_2px,transparent_4px)] opacity-20" />
                <div className="absolute top-0 left-0 bottom-0 w-3 bg-[repeating-linear-gradient(-45deg,#fff,#fff_2px,transparent_2px,transparent_4px)] opacity-20" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-semibold tracking-wider uppercase bg-black/50 px-2 py-0.5 rounded">
                    {ulos.motifName}
                  </span>
                  {ulos.unlocked ? (
                    <span className="text-[11px] font-bold bg-emerald-700/80 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={11} /> Terbuka
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock size={11} /> Terkunci
                    </span>
                  )}
                </div>

                <div className="z-10">
                  <h3 className="text-base font-bold text-amber-200 tracking-tight">
                    {ulos.name}
                  </h3>
                </div>
              </div>

              <h4 className="font-bold text-stone-900 text-sm">
                {ulos.batakFunction}
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {ulos.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400 font-medium">
                {ulos.unlocked ? 'Tersimpan di Lemari Adat' : 'Selesaikan unit lanjutan'}
              </span>
              {ulos.unlocked && (
                <span className="text-[#991B1B] font-bold flex items-center gap-1">
                  <ShieldCheck size={14} /> Berkah Restu
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
