import React from 'react';
import { Award, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { Mascot } from './Mascot';

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
    colorPattern: 'from-red-700 via-stone-900 to-amber-700',
    motifName: 'Motif Pinar Halak-halak'
  },
  {
    id: 'ulos-ragidup',
    name: 'Ulos Ragidup',
    batakFunction: 'Lambang Kehidupan Tertinggi (Raja ni Ulos)',
    description: 'Ulos paling tinggi derajatnya dalam adat Batak. Memiliki tenunan rumit yang melambangkan keabadian hidup dan kerukunan keluarga besar.',
    unlocked: true,
    colorPattern: 'from-stone-900 via-red-900 to-stone-900',
    motifName: 'Motif Sialtong & Sigumang'
  },
  {
    id: 'ulos-sibolang',
    name: 'Ulos Sibolang',
    batakFunction: 'Tanda Kehormatan & Kedewasaan',
    description: 'Dipakai pada upacara adat dukacita maupun sukacita untuk menunjukkan rasa hormat kepada orang tua dan leluhur.',
    unlocked: false,
    colorPattern: 'from-blue-950 via-stone-900 to-sky-900',
    motifName: 'Motif Simarpusoran'
  },
  {
    id: 'ulos-sadum',
    name: 'Ulos Sadum',
    batakFunction: 'Kegembiraan & Kemeriahan Pesta',
    description: 'Ulos dengan warna-warna cerah ceria (merah, emas, hijau) yang melambangkan keceriaan hati (marlas ni roha) dalam perayaan.',
    unlocked: false,
    colorPattern: 'from-amber-600 via-red-600 to-emerald-700',
    motifName: 'Motif Bunga Harungguan'
  },
  {
    id: 'ulos-bintang-maratur',
    name: 'Ulos Bintang Maratur',
    batakFunction: 'Keteraturan & Doa Kejayaan',
    description: 'Menggambarkan bintang-bintang yang berbaris teratur di langit malam Toba, lambang keluarga yang rukun dan taat adat.',
    unlocked: false,
    colorPattern: 'from-stone-950 via-red-950 to-amber-900',
    motifName: 'Motif Bintang Maratur'
  }
];

export const UlosCollectionView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-800 via-stone-900 to-red-900 rounded-3xl p-6 text-white mb-6 border-2 border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
            Warisan Tenun Budaya
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka',sans-serif]">
            Koleksi Ulos Tradisional Sigale-gale
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-lg">
            Ulos adalah lambang kehangatan, perlindungan, dan doa restu suku Batak. Kumpulkan seluruh koleksi tenun ulos dengan menyelesaikan unit pelajaran!
          </p>
        </div>
        <Mascot
          mood="happy"
          size="lg"
          speech="Gale bangga memakai ulos tenun Batak!"
          showStatusLabel={false}
        />
      </div>

      {/* Grid of Ulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_ULOS.map(ulos => (
          <div
            key={ulos.id}
            className={`rounded-3xl border-2 p-5 transition-all flex flex-col justify-between ${
              ulos.unlocked
                ? 'bg-white border-stone-300 shadow-sm hover:border-red-500 hover:shadow-md'
                : 'bg-stone-100/70 border-dashed border-stone-300 opacity-75'
            }`}
          >
            <div>
              {/* Ulos Fabric Banner Mockup */}
              <div
                className={`h-24 rounded-2xl bg-gradient-to-r ${ulos.colorPattern} p-3 flex flex-col justify-between text-white shadow-inner mb-4 relative overflow-hidden`}
              >
                {/* Traditional fringe threads at the ends */}
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,#fff,#fff_2px,transparent_2px,transparent_4px)] opacity-30" />
                <div className="absolute top-0 left-0 bottom-0 w-4 bg-[repeating-linear-gradient(-45deg,#fff,#fff_2px,transparent_2px,transparent_4px)] opacity-30" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded-full">
                    {ulos.motifName}
                  </span>
                  {ulos.unlocked ? (
                    <span className="text-xs font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> Dikoleksi
                    </span>
                  ) : (
                    <span className="text-xs font-bold bg-stone-700 text-stone-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Lock size={12} /> Terkunci
                    </span>
                  )}
                </div>

                <div className="z-10">
                  <h3 className="text-lg font-black font-['Fredoka',sans-serif] text-amber-200">
                    {ulos.name}
                  </h3>
                </div>
              </div>

              <h4 className="font-extrabold text-stone-900 text-base font-['Fredoka',sans-serif]">
                {ulos.batakFunction}
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                {ulos.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="font-bold text-stone-400">
                {ulos.unlocked ? 'Status: Terbuka di Lemari Adat' : 'Selesaikan Unit 3-5 untuk membuka'}
              </span>
              {ulos.unlocked && (
                <span className="text-red-600 font-extrabold flex items-center gap-1">
                  <Sparkles size={14} /> Berkah Restu Aktif
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
