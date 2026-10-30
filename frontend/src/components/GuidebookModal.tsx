import React from 'react';
import { X, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { Unit } from '../utils/batakData';
import { speakBatakWord } from '../utils/audioSynthesizer';

interface GuidebookModalProps {
  unit: Unit;
  isOpen: boolean;
  onClose: () => void;
}

export const GuidebookModal: React.FC<GuidebookModalProps> = ({
  unit,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF6EE] text-[#1E1A17] border-2 border-[#1E1A17] rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header dengan Satu Warna Dinamis Unit */}
        <div className={`p-6 ${unit.bannerColor} text-white relative shadow-md`} style={{ backgroundColor: unit.themeColor }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white/90">
            <BookOpen size={16} />
            <span>Buku Panduan • Unit 0{unit.number}</span>
          </div>
          <h2 className="font-heading text-2xl font-black mt-1 text-white">
            {unit.title}
          </h2>
          <p className="text-sm font-semibold text-white/90 italic mt-0.5">
            {unit.batakTitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Ringkasan Unit */}
          <div className="bg-[#F4EDE0] p-4 rounded-2xl border border-[#433D38]/30">
            <h3 className="font-bold text-[#1E1A17] text-base flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-[#A62B1F]" />
              Ringkasan Pembelajaran
            </h3>
            <p className="text-[#433D38] leading-relaxed">
              {unit.description}
            </p>
          </div>

          {/* Frasa & Kosakata Kunci */}
          <div>
            <h3 className="font-extrabold text-[#1E1A17] uppercase text-xs tracking-wider mb-3 text-[#A62B1F]">
              Kosakata & Frasa Kunci Unit Ini
            </h3>
            <div className="space-y-2.5">
              {unit.lessons.flatMap(l => l.questions).slice(0, 6).map((q, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#433D38]/30 flex items-center justify-between gap-3 shadow-xs hover:border-[#A62B1F]/60 transition"
                >
                  <div>
                    <span className="font-bold text-[#1E1A17] text-base block font-heading">
                      {q.batakText || q.prompt}
                    </span>
                    <span className="text-xs text-[#433D38]">
                      {q.translation || q.prompt}
                    </span>
                  </div>

                  {q.batakText && (
                    <button
                      type="button"
                      onClick={() => speakBatakWord(q.batakText || '')}
                      className="w-10 h-10 rounded-xl bg-[#F4EDE0] hover:bg-[#A62B1F] hover:text-white border border-[#433D38]/30 text-[#A62B1F] flex items-center justify-center shrink-0 transition cursor-pointer"
                      title="Dengarkan Suara"
                    >
                      <Volume2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips Budaya Batak */}
          <div className="bg-[#E8DFC8] p-4 rounded-2xl border-l-4 border-[#A62B1F] border-t border-r border-b border-[#433D38]/20">
            <h4 className="font-bold text-[#A62B1F] text-xs uppercase tracking-wider mb-1">
              💡 Nilai Filosofi & Tata Krama Batak
            </h4>
            <p className="text-xs text-[#1E1A17] leading-relaxed">
              Dalam percakapan suku Batak, keramahan diawali dengan ucapan salam <strong>"Horas"</strong> yang diiringi jabat tangan erat. Ucapkan dengan nada hangat, tulus, dan penuh rasa hormat.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F4EDE0] border-t border-[#433D38]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#A62B1F] hover:bg-[#7A1F16] border-b-4 border-[#5E1610] text-[#F4EDE0] font-extrabold uppercase rounded-xl text-xs tracking-wider transition active:translate-y-1 active:border-b-0 cursor-pointer shadow-md"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
