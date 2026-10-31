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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF6EE] text-[#1E1A17] border-2 border-[#1E1A17] rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[88vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className={`p-4 sm:p-6 ${unit.bannerColor} text-white relative shadow-md`} style={{ backgroundColor: unit.themeColor }}>
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-white/90">
            <BookOpen size={14} />
            <span>Buku Panduan • Unit 0{unit.number}</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-black mt-1 text-white">
            {unit.title}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-white/90 italic mt-0.5">
            {unit.batakTitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-sm">
          {/* Ringkasan Unit */}
          <div className="bg-[#F4EDE0] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#433D38]/30">
            <h3 className="font-bold text-[#1E1A17] text-sm sm:text-base flex items-center gap-2 mb-1">
              <Sparkles size={15} className="text-[#A62B1F]" />
              Ringkasan Pembelajaran
            </h3>
            <p className="text-xs sm:text-sm text-[#433D38] leading-relaxed">
              {unit.description}
            </p>
          </div>

          {/* Frasa & Kosakata Kunci */}
          <div>
            <h3 className="font-extrabold text-[#1E1A17] uppercase text-[11px] sm:text-xs tracking-wider mb-2.5 sm:mb-3 text-[#A62B1F]">
              Kosakata & Frasa Kunci Unit Ini
            </h3>
            <div className="space-y-2 sm:space-y-2.5">
              {unit.lessons.flatMap(l => l.questions).slice(0, 6).map((q, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFFFFF] p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[#433D38]/30 flex items-center justify-between gap-3 shadow-xs hover:border-[#A62B1F]/60 transition"
                >
                  <div className="truncate">
                    <span className="font-bold text-[#1E1A17] text-sm sm:text-base block font-heading truncate">
                      {q.batakText || q.prompt}
                    </span>
                    <span className="text-xs text-[#433D38] truncate block">
                      {q.translation || q.prompt}
                    </span>
                  </div>

                  {q.batakText && (
                    <button
                      type="button"
                      onClick={() => speakBatakWord(q.batakText || '')}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#F4EDE0] hover:bg-[#A62B1F] hover:text-white border border-[#433D38]/30 text-[#A62B1F] flex items-center justify-center shrink-0 transition cursor-pointer"
                      title="Dengarkan Suara"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips Budaya Batak */}
          <div className="bg-[#E8DFC8] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-l-4 border-[#A62B1F] border-t border-r border-b border-[#433D38]/20">
            <h4 className="font-bold text-[#A62B1F] text-[11px] sm:text-xs uppercase tracking-wider mb-1">
              💡 Nilai Filosofi & Tata Krama Batak
            </h4>
            <p className="text-xs text-[#1E1A17] leading-relaxed">
              Dalam percakapan suku Batak, keramahan diawali dengan ucapan salam <strong>"Horas"</strong> yang diiringi jabat tangan erat. Ucapkan dengan nada hangat, tulus, dan penuh rasa hormat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
