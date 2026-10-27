import React from 'react';
import { CaseData } from '../types';
import { Sliders, CheckCircle2, AlertCircle, Key, Minus, Plus, X } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';

interface EvidenceCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCase: CaseData;
  customCount: number;
  onUpdateCustomCount: (caseId: string, newCount: number) => void;
  isPixelBWMode?: boolean;
}

export const EvidenceCustomizerModal: React.FC<EvidenceCustomizerModalProps> = ({
  isOpen,
  onClose,
  selectedCase,
  customCount,
  onUpdateCustomCount,
  isPixelBWMode = true,
}) => {
  if (!isOpen) return null;

  const totalMax = selectedCase.evidence.length;
  const currentCount = Math.min(Math.max(2, customCount), totalMax);

  // Key evidence count in case
  const keyEvidenceCount = selectedCase.evidence.filter(e => e.isKeyEvidence).length;

  // Sorted list: key evidence first
  const sortedEvidence = [...selectedCase.evidence].sort(
    (a, b) => (b.isKeyEvidence ? 1 : 0) - (a.isKeyEvidence ? 1 : 0)
  );

  const activeItems = sortedEvidence.slice(0, currentCount);
  const activeIds = new Set(activeItems.map(item => item.id));

  const handleSetCount = (count: number) => {
    const validCount = Math.min(Math.max(2, count), totalMax);
    onUpdateCustomCount(selectedCase.id, validCount);
    conanAudio.playClueFound();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl bg-slate-900 border-2 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isPixelBWMode ? 'border-slate-400 font-mono' : 'border-red-500 font-sans'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-950/60 border border-red-500/50 rounded-xl text-red-400">
              <Sliders className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Tùy Chỉnh Số Lượng Vật Chứng
              </h2>
              <p className="text-[11px] text-slate-400">
                Vụ án: <span className="text-red-400 font-semibold">{selectedCase.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Main Slider & Stepper Control */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Số lượng vật chứng xuất hiện:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black text-red-400 font-mono">
                  {currentCount}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ {totalMax} vật chứng</span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min={2}
                max={totalMax}
                value={currentCount}
                onChange={(e) => handleSetCount(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Tối thiểu (2)</span>
                <span>Vừa (4)</span>
                <span>Tối đa ({totalMax})</span>
              </div>
            </div>

            {/* Plus / Minus Stepper Buttons */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => handleSetCount(currentCount - 1)}
                disabled={currentCount <= 2}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Giảm ( -1 )</span>
              </button>

              <button
                onClick={() => handleSetCount(currentCount + 1)}
                disabled={currentCount >= totalMax}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tăng ( +1 )</span>
              </button>
            </div>
          </div>

          {/* Preset Quick Options */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Chọn nhanh cấu hình gợi ý:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleSetCount(Math.min(3, totalMax))}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  currentCount === Math.min(3, totalMax)
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">🟢 Rút Gọn (3 vật chứng)</div>
                <div className="text-[10px] opacity-80 mt-0.5">Chỉ 3 manh mối cốt lõi để phá án siêu tốc</div>
              </button>

              <button
                onClick={() => handleSetCount(Math.min(5, totalMax))}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  currentCount === Math.min(5, totalMax)
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">🟡 Tiêu Chuẩn (5 vật chứng)</div>
                <div className="text-[10px] opacity-80 mt-0.5">Độ dài vừa đủ, cân bằng giữa suy luận và tốc độ</div>
              </button>

              <button
                onClick={() => handleSetCount(totalMax)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  currentCount === totalMax
                    ? 'bg-red-950/60 border-red-500 text-red-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">🔴 Tối Đa ({totalMax} vật chứng)</div>
                <div className="text-[10px] opacity-80 mt-0.5">Toàn bộ vật chứng & manh mối nghi vấn</div>
              </button>
            </div>
          </div>

          {/* List of Evidence Included */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Danh sách vật chứng sẽ xuất hiện ({activeItems.length}):</span>
              <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                <Key className="w-3 h-3" /> {keyEvidenceCount} Bắt buộc cốt lõi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {selectedCase.evidence.map((ev) => {
                const isIncluded = activeIds.has(ev.id);
                return (
                  <div
                    key={ev.id}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isIncluded
                        ? 'bg-slate-950 border-slate-700 text-slate-200'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600 line-through opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {isIncluded ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{ev.title}</span>
                    </div>

                    {ev.isKeyEvidence && isIncluded && (
                      <span className="px-1.5 py-0.5 bg-amber-950/80 border border-amber-500/50 text-amber-400 text-[9px] font-mono rounded shrink-0">
                        Cốt lõi
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            * Các vật chứng cốt lõi luôn được ưu tiên để vụ án luôn phá được!
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Áp Dụng Cấu Hình
          </button>
        </div>
      </div>
    </div>
  );
};
