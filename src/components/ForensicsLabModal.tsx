import React, { useState } from 'react';
import { 
  X, 
  Dna, 
  Fingerprint, 
  Microscope, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  FlaskConical, 
  Sparkles,
  Zap,
  UserCheck
} from 'lucide-react';
import { EvidenceItem, Suspect } from '../types';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface ForensicsLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceList: EvidenceItem[];
  suspects: Suspect[];
  analyzedSampleIds: string[];
  onAnalyzeSample: (evidenceId: string) => void;
}

export const ForensicsLabModal: React.FC<ForensicsLabModalProps> = ({
  isOpen,
  onClose,
  evidenceList,
  suspects,
  analyzedSampleIds,
  onAnalyzeSample,
}) => {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  if (!isOpen) return null;

  const collectedEvidence = evidenceList.filter(e => e.collected);
  const activeEvidence = evidenceList.find(e => e.id === selectedEvidenceId) || collectedEvidence[0];

  const handleStartAnalysis = (evId: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    conanAudio.playClueFound();

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          onAnalyzeSample(evId);
          conanAudio.playEpiphany();
          conanVoice.speak('CONAN', 'Kết quả giám định pháp y đã hoàn tất! Vân tay và mẫu ADN trùng khớp hoàn toàn!');
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const getMatchedSuspect = (ev: EvidenceItem) => {
    if (ev.contradictsSuspectId) {
      return suspects.find(s => s.id === ev.contradictsSuspectId);
    }
    return suspects.find(s => s.isCulprit);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-2xl">
              <FlaskConical className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">
                PHÒNG GIÁM ĐỊNH PHÁP Y ADVANCED · TIẾN SĨ AGASA
              </div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Giám Định Vân Tay & Mẫu ADN Sinh Học
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {collectedEvidence.length === 0 ? (
            <div className="p-12 text-center bg-slate-950/50 border border-slate-800 rounded-2xl space-y-3">
              <Search className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">
                Chưa có mẫu vật chứng nào được thu thập tại hiện trường.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Hãy di chuyển và nhấp vào các vị trí khả nghi tại Hiện Trường Vụ Án để tìm kiếm mẫu vân tay, vết máu hoặc vi vết hóa chất mang đi giám định!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Evidence Picker List */}
              <div className="md:col-span-5 space-y-3">
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Mẫu Vật Chứng Đã Thu Thập ({collectedEvidence.length})
                </div>
                {collectedEvidence.map(ev => {
                  const isAnalyzed = analyzedSampleIds.includes(ev.id);
                  const isSelected = activeEvidence?.id === ev.id;

                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedEvidenceId(ev.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-950/30'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono text-purple-400 truncate">{ev.category}</span>
                        {isAnalyzed ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Đã ADN
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                            Chờ Giám Định
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold mt-1 text-white truncate">{ev.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">📍 {ev.discoveredLocation}</p>
                    </button>
                  );
                })}
              </div>

              {/* Analysis Inspector Screen */}
              <div className="md:col-span-7 space-y-4">
                {activeEvidence && (
                  <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-mono text-purple-400">{activeEvidence.category}</span>
                        <h3 className="text-base font-black text-white">{activeEvidence.title}</h3>
                      </div>
                      <div className="p-2.5 bg-purple-950/80 border border-purple-700/60 rounded-xl">
                        <Fingerprint className="w-5 h-5 text-purple-300" />
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-400">Ghi chú hiện trường:</span>
                        <p className="text-slate-200 mt-1 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          {activeEvidence.description}
                        </p>
                      </div>

                      {analyzedSampleIds.includes(activeEvidence.id) ? (
                        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl space-y-3 animate-fade-in">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>KẾT QUẢ GIÁM ĐỊNH PHÁP Y THÀNH CÔNG</span>
                          </div>

                          <div className="space-y-2 text-emerald-200 text-xs">
                            <p className="leading-relaxed">
                              🔬 <strong>Quang phổ sinh học & Vi vết vân tay:</strong> {activeEvidence.detailedAnalysis}
                            </p>
                            {getMatchedSuspect(activeEvidence) && (
                              <div className="p-2.5 bg-emerald-900/40 rounded-xl border border-emerald-700/50 flex items-center gap-2 text-white font-bold text-xs mt-2">
                                <UserCheck className="w-4 h-4 text-emerald-300" />
                                <span>Trùng khớp hoàn toàn với hồ sơ: {getMatchedSuspect(activeEvidence)?.name}!</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                          <div className="text-xs text-slate-300">
                            Tiến sĩ Agasa đã sẵn sàng đưa mẫu này vào kính hiển vi quang phổ sinh học để tìm dấu vân tay và ADN!
                          </div>

                          {isAnalyzing ? (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-mono text-purple-400 font-bold">
                                <span>ĐANG PHÂN TÍCH QUANG PHỔ ADN...</span>
                                <span>{analysisProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-purple-800">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full transition-all duration-300"
                                  style={{ width: `${analysisProgress}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartAnalysis(activeEvidence.id)}
                              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                            >
                              <Sparkles className="w-4 h-4" />
                              <span>Tiến Hành Giám Định Pháp Y Vân Tay & ADN</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
