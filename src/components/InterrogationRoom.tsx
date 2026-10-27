import React, { useState, useEffect } from 'react';
import { Suspect, EvidenceItem, DifficultyLevel } from '../types';
import { Volume2, AlertTriangle, ShieldCheck, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface InterrogationRoomProps {
  suspect: Suspect;
  evidenceList: EvidenceItem[];
  difficulty?: DifficultyLevel;
  onBack: () => void;
  onSolveCasePrompt: () => void;
  isPixelBWMode?: boolean;
}

export const InterrogationRoom: React.FC<InterrogationRoomProps> = ({
  suspect,
  evidenceList,
  difficulty = 'EASY',
  onBack,
  onSolveCasePrompt,
  isPixelBWMode = true,
}) => {
  const [selectedStatementIndex, setSelectedStatementIndex] = useState<number>(0);
  const [presentedEvidenceId, setPresentedEvidenceId] = useState<string>('');
  const [dialogueHistory, setDialogueHistory] = useState<{ speaker: string; text: string; isConan?: boolean }[]>([]);
  const [isBrokenDown, setIsBrokenDown] = useState<boolean>(false);
  const initialNervousness = difficulty === 'HARD' 
    ? (suspect.hardNervousnessLevel ?? Math.max(18, suspect.nervousnessLevel - 25))
    : suspect.nervousnessLevel;
  const [nervousness, setNervousness] = useState<number>(initialNervousness);
  const [isSpeakingActive, setIsSpeakingActive] = useState<boolean>(false);

  const interrogationImage = '/src/assets/images/suspects_interrogation_1792666678276.jpg';

  // Listen to voice engine speaking state
  useEffect(() => {
    const unsub = conanVoice.subscribe((speaking) => {
      setIsSpeakingActive(speaking);
    });
    return unsub;
  }, []);

  // Initial greeting
  useEffect(() => {
    conanAudio.playBgm('SUSPENSE');
    setDialogueHistory([
      {
        speaker: suspect.name,
        text: suspect.initialVoiceLine,
      },
    ]);
    const voiceKey = suspect.id === 'SUSPECT_TATSUMI' ? 'SUSPECT_TATSUMI' : suspect.id === 'SUSPECT_AYANE' ? 'SUSPECT_AYANE' : 'SUSPECT_KENZO';
    conanVoice.speak(voiceKey, suspect.initialVoiceLine);
  }, [suspect]);

  const handleAskQuestion = (questionText: string, conanSpeech: string, answerText: string) => {
    conanAudio.playBowtieDial();
    conanVoice.speak('CONAN', conanSpeech, () => {
      const voiceKey = suspect.id === 'SUSPECT_TATSUMI' ? 'SUSPECT_TATSUMI' : suspect.id === 'SUSPECT_AYANE' ? 'SUSPECT_AYANE' : 'SUSPECT_KENZO';
      conanVoice.speak(voiceKey, answerText);
    });

    setDialogueHistory(prev => [
      ...prev,
      { speaker: 'Edogawa Conan', text: conanSpeech, isConan: true },
      { speaker: suspect.name, text: answerText },
    ]);
  };

  const handlePresentEvidence = () => {
    if (!presentedEvidenceId) return;

    const currentStatement = suspect.statements[selectedStatementIndex];
    const selectedEvidence = evidenceList.find(e => e.id === presentedEvidenceId);
    if (!currentStatement || !selectedEvidence) return;

    if (currentStatement.isContradictory && currentStatement.refutingEvidenceId === presentedEvidenceId) {
      // SUCCESSFUL CONTRADICTION!
      conanAudio.playObjectionSlam();
      const conanSpeech = currentStatement.conanVoiceline || `Chân tướng sự thật chỉ có một! ${selectedEvidence.title} đã hoàn toàn bác bỏ lời khai của ông!`;
      
      conanVoice.speak('CONAN', conanSpeech, () => {
        // Suspect breakdown
        setTimeout(() => {
          conanAudio.playDramaticShock();
          const voiceKey = suspect.id === 'SUSPECT_TATSUMI' ? 'SUSPECT_TATSUMI' : suspect.id === 'SUSPECT_AYANE' ? 'SUSPECT_AYANE' : 'SUSPECT_KENZO';
          conanVoice.speak(voiceKey, suspect.breakdownVoiceLine);
        }, 600);
      });

      setNervousness(100);
      setIsBrokenDown(true);

      setDialogueHistory(prev => [
        ...prev,
        { 
          speaker: 'Edogawa Conan', 
          text: `[TRÌNH BẰNG CHỨNG: ${selectedEvidence.title}] ${conanSpeech}`, 
          isConan: true 
        },
        { 
          speaker: suspect.name, 
          text: suspect.breakdownVoiceLine 
        },
      ]);
    } else {
      // FAILED CONTRADICTION
      conanAudio.playDramaticShock();
      conanVoice.speak('CONAN', 'Khoan đã... Vật chứng này chưa trực tiếp liên quan đến lời khai đó.');
      setDialogueHistory(prev => [
        ...prev,
        { 
          speaker: 'Edogawa Conan', 
          text: `[Trình ${selectedEvidence.title}] Nhưng có vẻ vật chứng này chưa khớp với sơ hở trong lời khai.`, 
          isConan: true 
        },
        { 
          speaker: suspect.name, 
          text: 'Haha, thằng nhóc này cầm tinh tinh cái gì thế? Đừng làm mất thời gian quý báu của tôi!' 
        },
      ]);
    }
  };

  const collectedEvidence = evidenceList.filter(e => e.collected);

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-slate-950 p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4 pb-28 lg:pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Quay lại Hồ Sơ</span>
          <span className="sm:hidden">Hồ Sơ</span>
        </button>

        <div className="text-center px-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest hidden sm:block">PHÒNG THẨM VẤN ĐẶC BIỆT</div>
          <h2 className="text-xs sm:text-base font-bold text-white truncate max-w-[160px] sm:max-w-none">{suspect.name}</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">Áp lực:</span>
          <span className="font-mono text-xs sm:text-sm font-bold text-red-400">{nervousness}%</span>
        </div>
      </div>

      {/* Main Split: Visual Interrogation Art & Interactive Dialogue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 flex-1">
        {/* Left: Interrogation Visual Backdrop */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black min-h-[260px] sm:min-h-[380px] flex flex-col justify-end">
          <img
            src={interrogationImage}
            alt="Phòng thẩm vấn nghi phạm Anime Conan"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover ${
              isPixelBWMode ? 'pixel-monochrome pixelated contrast-200 brightness-110 opacity-90' : 'opacity-90'
            }`}
          />
          {isPixelBWMode && (
            <div className="absolute inset-0 pixel-scanlines pointer-events-none opacity-40 z-10" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none" />

          {/* Talking Indicator */}
          {isSpeakingActive && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white text-xs font-bold rounded-lg shadow-lg">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>Đang phát giọng lồng tiếng...</span>
            </div>
          )}

          {/* Suspect breakdown visual status */}
          {isBrokenDown && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-red-950/90 border border-red-500 text-red-300 text-xs font-bold rounded-lg animate-pulse">
              ⚠️ TÂM LÝ SỤP ĐỔ - ĐÃ THỪA NHẬN SƠ HỞ!
            </div>
          )}

          {/* Subtitle Bar at bottom of video window */}
          <div className="relative z-20 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 m-3 rounded-xl">
            <div className="text-[11px] font-mono text-red-400 uppercase tracking-widest mb-1">
              {dialogueHistory[dialogueHistory.length - 1]?.speaker || suspect.name}
            </div>
            <p className="text-sm text-slate-100 font-medium leading-relaxed italic">
              "{dialogueHistory[dialogueHistory.length - 1]?.text || '...'}"
            </p>
          </div>
        </div>

        {/* Right: Questioning & Objection Console */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-5">
          {/* Question selection buttons */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Gợi Hỏi Các Chi Tiết Khả Nghi</span>
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => handleAskQuestion(
                  'Hỏi về thời gian 20:15',
                  'Chú Tatsumi ơi, lúc 20:15 chú nói chú ở quầy lễ tân tầng 1, nhưng tại sao áo khoác của chú lại bị ướt nước mưa tuyết ngoài trời ạ?',
                  'Đó... đó là lúc tôi ra ngoài sảnh đón gió một lát thôi! Có gì phạm pháp sao?!'
                )}
                className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all flex items-center justify-between"
              >
                <span>1. Chất vấn về vết ướt trên áo khoác lúc 20:15</span>
                <Send className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={() => handleAskQuestion(
                  'Hỏi về cuộc gọi 20:20',
                  'Thưa chú, bác Tachibana qua đời từ 20:15, vậy người gọi điện thoại nội bộ cho chú lúc 20:20 thực sự là ai?',
                  'Cái gì?! Giám định pháp y bảo 20:15 sao?! Không thể nào... Rõ ràng tôi nghe thấy giọng ông ấy mà!'
                )}
                className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-all flex items-center justify-between"
              >
                <span>2. Đối chiếu thời gian tử vong 20:15 và cuộc gọi 20:20</span>
                <Send className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* Objection / Present Evidence Section */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Trình Vật Chứng Phá Vỡ Ngụy Biện!</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {collectedEvidence.length} Vật chứng sẵn sàng
              </span>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Chọn lời khai của nghi can cần phản bác:
              </label>
              <select
                value={selectedStatementIndex}
                onChange={(e) => setSelectedStatementIndex(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 focus:outline-none"
              >
                {suspect.statements.map((st, idx) => (
                  <option key={st.id} value={idx}>
                    Lời khai #{idx + 1}: {st.text.slice(0, 45)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Chọn tang vật đối chiếu mâu thuẫn:
              </label>
              <select
                value={presentedEvidenceId}
                onChange={(e) => setPresentedEvidenceId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2 focus:outline-none"
              >
                <option value="">-- Chọn vật chứng đã thu thập --</option>
                {collectedEvidence.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.category})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePresentEvidence}
              disabled={!presentedEvidenceId}
              className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-xs rounded-xl shadow-lg shadow-red-950/40 transition-all uppercase tracking-wider active:scale-98"
            >
              Bác Bỏ! Chân Tướng Sự Thật!
            </button>
          </div>

          {/* Climax Button when culprit broken down */}
          {isBrokenDown && (
            <button
              onClick={onSolveCasePrompt}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm rounded-xl shadow-xl shadow-red-950/50 transition-all animate-bounce uppercase tracking-wider"
            >
              Mời Toàn Bộ Mọi Người: Bắt Đầu Màn Phá Án Của Thám Tử Mori!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
