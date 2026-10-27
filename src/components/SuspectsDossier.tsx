import React, { useState } from 'react';
import { Suspect, DifficultyLevel } from '../types';
import { User, Clock, AlertTriangle, ShieldAlert, MessageSquare, ChevronRight, Eye } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface SuspectsDossierProps {
  suspects: Suspect[];
  difficulty?: DifficultyLevel;
  onStartInterrogation: (suspectId: string) => void;
}

export const SuspectsDossier: React.FC<SuspectsDossierProps> = ({
  suspects,
  difficulty = 'EASY',
  onStartInterrogation,
}) => {
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect>(suspects[0]);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TIMELINE' | 'STATEMENTS'>('PROFILE');

  const handleSelectSuspect = (suspect: Suspect) => {
    setSelectedSuspect(suspect);
    conanAudio.playClueFound();
    conanVoice.speak(
      suspect.id === 'SUSPECT_TATSUMI'
        ? 'SUSPECT_TATSUMI'
        : suspect.id === 'SUSPECT_AYANE'
        ? 'SUSPECT_AYANE'
        : 'SUSPECT_KENZO',
      suspect.initialVoiceLine
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-slate-950 p-3 sm:p-4 md:p-8 flex flex-col gap-4 sm:gap-6 pb-28 lg:pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div>
          <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">
            SỞ CẢNH SÁT TOKYO · DANH SÁCH 3 NGHI CAN TRỌNG ĐIỂM
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-wide mt-1">
            Hồ Sơ Nghi Can & Thẩm Vấn
          </h1>
        </div>
        <button
          onClick={() => onStartInterrogation(selectedSuspect.id)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/40 transition-all cursor-pointer active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Thẩm Vấn {selectedSuspect.name}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left column: Suspect list */}
        <div className="lg:col-span-4 space-y-2.5 sm:space-y-3">
          {suspects.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelectSuspect(s)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer active:scale-98 ${
                selectedSuspect.id === s.id
                  ? 'bg-slate-800 border-red-500 shadow-xl shadow-red-950/30 ring-1 ring-red-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{s.furigana}</span>
                  <h3 className="text-sm sm:text-base font-bold text-white">{s.name}</h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {s.age} tuổi
                </span>
              </div>

              <div className="text-xs text-red-400 font-medium mb-1">
                {s.occupation}
              </div>

              <div className="text-xs text-slate-400 line-clamp-1 mb-2.5">
                {s.relationshipToVictim}
              </div>

              {/* Stress meter */}
              {(() => {
                const displayedNervousness = difficulty === 'HARD' 
                  ? (s.hardNervousnessLevel ?? Math.max(18, s.nervousnessLevel - 25))
                  : s.nervousnessLevel;
                return (
                  <div>
                    <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-400 mb-1">
                      <span>{difficulty === 'HARD' ? 'Tâm lý: Điềm tĩnh' : 'Mức độ lo âu'}</span>
                      <span className="font-mono text-amber-400 font-bold">{displayedNervousness}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-red-500 h-full transition-all"
                        style={{ width: `${displayedNervousness}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>

        {/* Right column: Suspect details & tabs */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4 sm:gap-6">
          {/* Sub tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none gap-2">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('PROFILE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'PROFILE'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tiểu Sử
              </button>
              <button
                onClick={() => setActiveTab('TIMELINE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'TIMELINE'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dòng Thời Gian
              </button>
              <button
                onClick={() => setActiveTab('STATEMENTS')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'STATEMENTS'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lời Khai Ban Đầu
              </button>
            </div>

            <button
              onClick={() => onStartInterrogation(selectedSuspect.id)}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-0.5 shrink-0"
            >
              <span>Vào Thẩm Vấn</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab 1: Profile */}
          {activeTab === 'PROFILE' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400">Nghề nghiệp:</div>
                  <div className="font-bold text-slate-100 text-sm">{selectedSuspect.occupation}</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400">Quan hệ với nạn nhân:</div>
                  <div className="font-bold text-slate-100 text-sm">{selectedSuspect.relationshipToVictim}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Động cơ sát hại khả nghi:</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {selectedSuspect.motive}
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-blue-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Tính cách & Hành vi biểu hiện:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedSuspect.personality}
                </p>
              </div>

              <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/40 space-y-2">
                <div className="font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Gợi ý sơ hở của Conan:</span>
                </div>
                <p className="text-red-200 leading-relaxed">
                  💡 {selectedSuspect.weaknessHint}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Timeline */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 mb-2">
                Dòng sự kiện lúc xảy ra vụ án (20:00 - 20:30):
              </div>
              {selectedSuspect.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs"
                >
                  <div className="font-mono text-red-400 font-bold w-14 shrink-0 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex-1 text-slate-200">
                    {item.action}
                  </div>
                  <div className="shrink-0">
                    {item.verified ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                        Đã xác minh
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                        Chưa có chứng cớ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Statements */}
          {activeTab === 'STATEMENTS' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 mb-2">
                Những phát ngôn trực tiếp ghi nhận tại hiện trường:
              </div>
              {selectedSuspect.statements.map((st, i) => (
                <div
                  key={st.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono text-red-400">Lời khai #{i + 1}</span>
                    {st.isContradictory && (
                      <span className="text-[10px] text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded font-bold">
                        Chứa mâu thuẫn ẩn
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200 italic font-medium text-sm">
                    "{st.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
