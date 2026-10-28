import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { Mascot } from './Mascot';
import { PitaTenun } from './GorgaEmblem';

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
    colorPattern: 'repeating-linear-gradient(45deg, #A62B1F 0px, #A62B1F 6px, #1E1A17 6px, #1E1A17 12px)',
    motifName: 'Motif Pinar Halak-halak'
  },
  {
    id: 'ulos-ragidup',
    name: 'Ulos Ragidup',
    batakFunction: 'Lambang Kehidupan Tertinggi (Raja ni Ulos)',
    description: 'Ulos paling tinggi derajatnya dalam adat Batak. Memiliki tenunan rumit yang melambangkan keabadian hidup dan kerukunan keluarga besar.',
    unlocked: true,
    colorPattern: 'repeating-linear-gradient(45deg, #1E1A17 0px, #1E1A17 6px, #A62B1F 6px, #A62B1F 12px)',
    motifName: 'Motif Sialtong & Sigumang'
  },
  {
    id: 'ulos-sibolang',
    name: 'Ulos Sibolang',
    batakFunction: 'Tanda Kehormatan & Kedewasaan',
    description: 'Dipakai pada upacara adat dukacita maupun sukacita untuk menunjukkan rasa hormat kepada orang tua dan leluhur.',
    unlocked: false,
    colorPattern: 'repeating-linear-gradient(45deg, #23365A 0px, #23365A 6px, #1E1A17 6px, #1E1A17 12px)',
    motifName: 'Motif Simarpusoran'
  },
  {
    id: 'ulos-sadum',
    name: 'Ulos Sadum',
    batakFunction: 'Kegembiraan & Kemeriahan Pesta',
    description: 'Ulos dengan warna-warna cerah ceria (merah, emas, hijau) yang melambangkan keceriaan hati (marlas ni roha) dalam perayaan.',
    unlocked: false,
    colorPattern: 'repeating-linear-gradient(45deg, #D9A21B 0px, #D9A21B 6px, #A62B1F 6px, #A62B1F 12px)',
    motifName: 'Motif Bunga Harungguan'
  },
  {
    id: 'ulos-bintang-maratur',
    name: 'Ulos Bintang Maratur',
    batakFunction: 'Keteraturan & Doa Kejayaan',
    description: 'Menggambarkan bintang-bintang yang berbaris teratur di langit malam Toba, lambang keluarga yang rukun dan taat adat.',
    unlocked: false,
    colorPattern: 'repeating-linear-gradient(45deg, #1E1A17 0px, #1E1A17 6px, #D9A21B 6px, #D9A21B 12px)',
    motifName: 'Motif Bintang Maratur'
  }
];

export const UlosCollectionView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-body">
      {/* Banner */}
      <div className="bg-[#1E1A17] rounded-[4px] text-[#F4EDE0] mb-8 border-[1.5px] border-[#1E1A17] relative overflow-hidden">
        <PitaTenun />

        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#2C2622] text-[#F4EDE0] border border-[#433D38] px-2.5 py-0.5 rounded-[2px] inline-block mb-2">
              Warisan Tenun Tradisional
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#F4EDE0]">
              Galeri Koleksi Ulos Adat Batak
            </h1>
            <p className="text-[#E8DFC8] text-sm mt-1.5 max-w-lg leading-relaxed font-medium">
              Koleksi kain tenun adat Batak Toba. Buka setiap jenis ulos dengan menyelesaikan unit pelajaran!
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

      {/* Grid of Ulos: Papan Datar, Garis Arang 1.5px, Tanpa Bayangan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_ULOS.map(ulos => (
          <div
            key={ulos.id}
            className={`card-batak p-5 flex flex-col justify-between ${
              ulos.unlocked
                ? 'bg-[#FAF6EE] border-[#1E1A17]'
                : 'bg-[#F4EDE0] border-dashed border-[#433D38] opacity-75'
            }`}
          >
            <div>
              {/* Pattern Strip */}
              <div
                className="w-full h-3.5 rounded-[2px] border border-[#1E1A17] mb-3"
                style={{ background: ulos.colorPattern }}
                aria-hidden="true"
              />

              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#A62B1F] tracking-tight">
                    {ulos.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#433D38]">
                    {ulos.motifName}
                  </p>
                </div>
                {ulos.unlocked ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-[#E8DFC8] text-[#1E1A17] border border-[#1E1A17] px-2 py-0.5 rounded-[2px]">
                    <CheckCircle2 size={12} className="text-[#23365A]" /> Terbuka
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-[#E8DFC8] text-[#433D38] border border-[#1E1A17] px-2 py-0.5 rounded-[2px]">
                    <Lock size={12} /> Terkunci
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-[#1E1A17] mb-2">
                <span className="text-[#433D38]">Fungsi: </span>
                {ulos.batakFunction}
              </div>

              <p className="text-xs text-[#433D38] leading-relaxed">
                {ulos.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
