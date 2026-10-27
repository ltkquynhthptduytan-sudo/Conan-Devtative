import React, { useState } from 'react';
import { 
  Activity, 
  Wine, 
  Link as LinkIcon, 
  Droplets, 
  Feather, 
  FileText, 
  Music, 
  Zap, 
  Mail, 
  Search, 
  CheckCircle, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';
import { EvidenceItem, Suspect, DifficultyLevel } from '../types';

interface EvidenceNotebookProps {
  evidenceList: EvidenceItem[];
  suspects: Suspect[];
  difficulty?: DifficultyLevel;
  onNavigateToInterrogation: (suspectId: string) => void;
}

export const EvidenceNotebook: React.FC<EvidenceNotebookProps> = ({
  evidenceList,
  suspects,
  difficulty = 'EASY',
  onNavigateToInterrogation,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(
    evidenceList.find(e => e.collected) || evidenceList[0] || null
  );

  // Logic Pairing Tool State
  const [selectedSuspectId, setSelectedSuspectId] = useState<string>(suspects[0]?.id || '');
  const [selectedStatementId, setSelectedStatementId] = useState<string>('');
  const [pairingFeedback, setPairingFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null);

  const categories = [
    { key: 'ALL', label: 'Tất Cả' },
    { key: 'Khám nghiệm y khoa', label: 'Khám Nghiệm Y Khoa' },
    { key: 'Thủ đoạn cơ học', label: 'Thủ Đoạn Cơ Học' },
    { key: 'Thời gian & Ngoại phạm', label: 'Thời Gian & Ngoại Phạm' },
    { key: 'Hóa chất & Vật phẩm', label: 'Hóa Chất & Độc Tố' },
    { key: 'Manh mối số', label: 'Tài Liệu Số' },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-5 h-5 text-red-400" />;
      case 'Wine': return <Wine className="w-5 h-5 text-purple-400" />;
      case 'Link': return <LinkIcon className="w-5 h-5 text-cyan-400" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'Feather': return <Feather className="w-5 h-5 text-amber-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-emerald-400" />;
      case 'Music': return <Music className="w-5 h-5 text-pink-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Mail': return <Mail className="w-5 h-5 text-indigo-400" />;
      default: return <Search className="w-5 h-5 text-slate-400" />;
    }
  };

  const activeEvidence = difficulty === 'EASY'
    ? evidenceList.filter(item => item.difficulty !== 'HARD')
    : evidenceList;

  const filteredEvidence = activeEvidence.filter(item => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  const collectedCount = activeEvidence.filter(e => e.collected).length;

  const currentSuspect = suspects.find(s => s.id === selectedSuspectId);

  const handleTestContradiction = () => {
    if (!selectedEvidence || !selectedStatementId || !currentSuspect) return;

    const statement = currentSuspect.statements.find(s => s.id === selectedStatementId);
    if (!statement) return;

    if (statement.isContradictory && statement.refutingEvidenceId === selectedEvidence.id) {
      conanAudio.playObjectionSlam();
      setPairingFeedback({
        isSuccess: true,
        message: `MÂU THUẪN HOÀN TOÀN ĐƯỢC CHỨNG MINH! ${statement.refutationExplanation}`,
      });
      if (statement.conanVoiceline) {
        conanVoice.speak('CONAN', statement.conanVoiceline);
      }
    } else {
      conanAudio.playDramaticShock();
      setPairingFeedback({
        isSuccess: false,
        message: 'Bằng chứng này chưa đủ để bác bỏ lời khai trên. Hãy quan sát kỹ thời gian và hiện vật vật lý!',
      });
      conanVoice.speak('CONAN', 'Khoan đã... Lập luận này hình như còn điểm chưa hợp lý.');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-slate-950 p-3 sm:p-4 md:p-8 flex flex-col gap-4 sm:gap-6 pb-28 lg:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div>
          <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">
            SỔ TAY TANG CHỨNG THÁM TỬ · HỒ SƠ BEIKA
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-wide mt-1">
            Bằng Chứng & Phân Tích Mâu Thuẫn
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] sm:text-xs text-slate-400">Đã thu thập</span>
            <div className="font-mono text-base sm:text-lg font-bold text-red-400">
              {collectedCount} / {evidenceList.length}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
              activeCategory === cat.key
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/40'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid: Evidence List & Evidence Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Evidence Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredEvidence.map(item => (
            <div
              key={item.id}
              onClick={() => {
                if (item.collected) {
                  setSelectedEvidence(item);
                  conanAudio.playClueFound();
                }
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                !item.collected
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  : selectedEvidence?.id === item.id
                  ? 'bg-slate-800/90 border-red-500 shadow-lg shadow-red-950/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl border ${item.collected ? 'bg-slate-800 border-slate-700' : 'bg-slate-950 border-slate-800'}`}>
                  {item.collected ? getIcon(item.iconName) : <HelpCircle className="w-5 h-5 text-slate-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-400">{item.category}</span>
                    {item.collected ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Đã giám định
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Chưa tìm thấy</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-0.5 truncate">
                    {item.collected ? item.title : 'Vật chứng chưa thu thập tại hiện trường'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.collected ? item.description : 'Hãy tìm kiếm tại các điểm khả nghi trong hiện trường Penthouse.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Evidence Deep Inspector & Contradiction Tool */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detailed Inspector Card */}
          {selectedEvidence && selectedEvidence.collected ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-600/20 rounded-xl border border-red-500/30">
                    {getIcon(selectedEvidence.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-red-400">{selectedEvidence.category}</span>
                    <h2 className="text-lg font-black text-white">{selectedEvidence.title}</h2>
                  </div>
                </div>
                {selectedEvidence.isKeyEvidence && (
                  <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold rounded-lg">
                    Vật Chứng Trọng Tâm
                  </span>
                )}
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-slate-400 mb-1">Vị trí thu thập:</div>
                  <div className="p-3 bg-slate-950 rounded-xl text-slate-200 border border-slate-800 font-mono">
                    📍 {selectedEvidence.discoveredLocation}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-1">Mô tả chi tiết:</div>
                  <div className="p-3 bg-slate-950 rounded-xl text-slate-200 border border-slate-800 leading-relaxed">
                    {selectedEvidence.description}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-1">Phân tích pháp y & suy luận của Conan:</div>
                  <div className="p-3 bg-red-950/20 rounded-xl text-red-200 border border-red-900/40 leading-relaxed">
                    🔍 {selectedEvidence.detailedAnalysis}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center text-slate-500">
              Chọn một bằng chứng đã thu thập ở danh sách bên trái để kiểm tra phân tích chi tiết.
            </div>
          )}

          {/* Logic Contradiction Pairing Engine */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Đối Chiếu & Ghép Nối Bác Bỏ Lời Khai Mâu Thuẫn
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Chọn một nghi can, một lời khai của họ và đối chiếu với vật chứng đang chọn ({selectedEvidence?.title || 'Chưa chọn'}) để tìm ra kẽ hở logic!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  1. Chọn Nghi Can:
                </label>
                <select
                  value={selectedSuspectId}
                  onChange={(e) => {
                    setSelectedSuspectId(e.target.value);
                    setSelectedStatementId('');
                    setPairingFeedback(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl p-2.5 focus:border-red-500 focus:outline-none"
                >
                  {suspects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.occupation})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  2. Chọn Lời Khai Cần Bác Bỏ:
                </label>
                <select
                  value={selectedStatementId}
                  onChange={(e) => {
                    setSelectedStatementId(e.target.value);
                    setPairingFeedback(null);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl p-2.5 focus:border-red-500 focus:outline-none"
                >
                  <option value="">-- Chọn lời khai --</option>
                  {currentSuspect?.statements.map(st => (
                    <option key={st.id} value={st.id}>{st.text.slice(0, 50)}...</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedStatementId && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300">
                <span className="font-bold text-amber-400">Lời khai đầy đủ: </span>
                "{currentSuspect?.statements.find(s => s.id === selectedStatementId)?.text}"
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleTestContradiction}
                disabled={!selectedEvidence || !selectedStatementId}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-98"
              >
                Bác Bỏ Lời Khai Này!
              </button>

              <button
                onClick={() => onNavigateToInterrogation(selectedSuspectId)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all whitespace-nowrap"
              >
                Vào Phòng Thẩm Vấn
              </button>
            </div>

            {pairingFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                  pairingFeedback.isSuccess
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/40 text-red-300'
                }`}
              >
                <span className="font-bold block mb-1">
                  {pairingFeedback.isSuccess ? '✓ PHÁ VỠ CHỨNG CỨ NGOẠI PHẠM!' : '✗ LẬP LUẬN CHƯA CHÍNH XÁC'}
                </span>
                {pairingFeedback.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
