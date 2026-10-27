import React, { useState } from 'react';
import { CaseData } from '../types';
import { Disc, Watch, Sparkles, CheckCircle, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface DeductionClimaxModalProps {
  currentCase: CaseData;
  onCaseSolved: () => void;
  onClose: () => void;
}

export const DeductionClimaxModal: React.FC<DeductionClimaxModalProps> = ({
  currentCase,
  onCaseSolved,
  onClose,
}) => {
  const [phase, setPhase] = useState<'AIM_MORI' | 'SLEEPING_MORI' | 'QUESTIONS' | 'CULPRIT_REVEAL'>('AIM_MORI');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [stepFeedback, setStepFeedback] = useState<string | null>(null);
  const [isStepCorrect, setIsStepCorrect] = useState<boolean>(false);

  // Phase 1: Shoot dart at Mori
  const handleShootMori = () => {
    conanAudio.playStunDart();
    conanVoice.speak('KOGORO_NORMAL', 'Ủa... Conan, sao gáy chú thấy nhói một cái... Buồn ngủ quá... Oáp...');
    setTimeout(() => {
      setPhase('SLEEPING_MORI');
      conanAudio.playEpiphany();
    }, 1500);
  };

  // Phase 2: Switch to Kogoro voice via Bowtie
  const handleStartSleepingKogoro = () => {
    conanAudio.playBowtieDial();
    conanAudio.playBgm('DEDUCTION');
    conanVoice.speak(
      'SLEEPING_KOGORO',
      'Hừm... Cảnh sát Megure! Mọi người hãy bình tĩnh lại! Vụ án này không hề có hung thủ tàng hình nào cả. Thủ đoạn căn phòng khóa kín và kẻ giết hại ông Tachibana... đã nằm trọn trong tay tôi!'
    );
    setPhase('QUESTIONS');
  };

  // Phase 4: Submit deduction step
  const handleAnswerSubmit = (optionIndex: number) => {
    const step = currentCase.deductionSteps[currentStepIndex];
    const option = step.options[optionIndex];
    setSelectedOptionIndex(optionIndex);

    if (option.isCorrect) {
      conanAudio.playObjectionSlam();
      setIsStepCorrect(true);
      setStepFeedback(option.feedback);
      conanVoice.speak('SLEEPING_KOGORO', option.feedback);
    } else {
      conanAudio.playDramaticShock();
      setIsStepCorrect(false);
      setStepFeedback(option.feedback);
      conanVoice.speak('SLEEPING_KOGORO', 'Không đúng! Cần phải suy nghĩ thật cẩn trọng về bằng chứng vật lý!');
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < currentCase.deductionSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setStepFeedback(null);
      setIsStepCorrect(false);
    } else {
      // Climax reached!
      setPhase('CULPRIT_REVEAL');
      conanAudio.playDramaticShock();
      conanVoice.speak(
        'SLEEPING_KOGORO',
        'Hung thủ không ai khác chính là anh, thư ký Tatsumi Ryuichi! Chiếc bút máy giấu độc chất trong túi áo anh chính là bằng chứng thép không thể chối cãi! Chân tướng sự thật chỉ có một mà thôi!'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-red-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 rounded-xl border border-red-500/40">
              <Sparkles className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wider text-white uppercase">
                Màn Phá Án Của Thám Tử Ngủ Gật Mori
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
                {phase === 'AIM_MORI' && 'Bước 1: Bắn kim thuốc mê'}
                {phase === 'SLEEPING_MORI' && 'Bước 2: Cài đặt nơ thay đổi giọng nói'}
                {phase === 'QUESTIONS' && `Bước 3: Lập luận logic (${currentStepIndex + 1}/${currentCase.deductionSteps.length})`}
                {phase === 'CULPRIT_REVEAL' && 'Bước 4: Chân tướng duy nhất!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phase 1: Aim crosshairs at Mori */}
        {phase === 'AIM_MORI' && (
          <div className="p-4 sm:p-8 flex flex-col items-center text-center space-y-4 sm:space-y-6 overflow-y-auto">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-blue-500/40 bg-slate-950 flex items-center justify-center overflow-hidden shadow-2xl group cursor-crosshair">
              {/* Radar rings */}
              <div className="absolute inset-0 border border-blue-500/20 rounded-full scale-75" />
              <div className="absolute inset-0 border border-blue-500/20 rounded-full scale-50" />
              <div className="absolute w-full h-0.5 bg-blue-500/40" />
              <div className="absolute h-full w-0.5 bg-blue-500/40" />
              
              <div className="text-center z-10 space-y-2">
                <Watch className="w-12 h-12 text-blue-400 mx-auto animate-pulse" />
                <div className="font-mono text-xs text-blue-400 font-bold">
                  MỤC TIÊU: GÁY CHÚ MORI
                </div>
                <div className="text-[11px] text-slate-400">
                  Khoảng cách: 3 mét
                </div>
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-lg font-bold text-white">Khóa Mục Tiêu Đồng Hồ Bắn Thuốc Mê</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hãy bắn một mũi kim gây mê tức thì vào chú Mori Kogoro để chú ấy ngủ say trên chiếc ghế bành, mở màn cho buổi phá án kinh điển!
              </p>
            </div>

            <button
              onClick={handleShootMori}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-950/50 transition-all uppercase tracking-wider active:scale-95 cursor-pointer"
            >
              BẮN KIM THUỐC MÊ!
            </button>
          </div>
        )}

        {/* Phase 2: Sleeping Mori posture */}
        {phase === 'SLEEPING_MORI' && (
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="p-6 bg-slate-950 rounded-2xl border border-red-500/40 max-w-lg space-y-3">
              <div className="text-3xl">💤 🕵️‍♂️</div>
              <h3 className="text-lg font-black text-white">Thám Tử Ngủ Gật Đã Xuất Hiện!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chú Mori đã ngồi tựa lưng vào ghế bành, đầu cúi gục xuống, hai tay buông thõng điềm tĩnh. Conan đang nấp phía sau ghế và điều chỉnh chiếc Nơ Thay Đổi Giọng Nói sang tần số của chú Mori!
              </p>
            </div>

            <button
              onClick={handleStartSleepingKogoro}
              className="flex items-center gap-3 px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-950/50 transition-all uppercase tracking-wider active:scale-95"
            >
              <Disc className="w-5 h-5" />
              <span>Bật Giọng Mori & Bắt Đầu Phá Án!</span>
            </button>
          </div>
        )}

        {/* Phase 3: Step Questions */}
        {phase === 'QUESTIONS' && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <div className="text-xs font-mono text-red-400 mb-1">
                LẬP LUẬN SỐ #{currentStepIndex + 1}
              </div>
              <h3 className="text-base font-bold text-white leading-snug">
                {currentCase.deductionSteps[currentStepIndex].question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentCase.deductionSteps[currentStepIndex].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswerSubmit(oIdx)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs leading-relaxed transition-all ${
                    selectedOptionIndex === oIdx
                      ? opt.isCorrect
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                        : 'bg-red-950/50 border-red-500 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback box */}
            {stepFeedback && (
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
                  isStepCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/40 text-red-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {isStepCorrect ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>{isStepCorrect ? 'CHÍNH XÁC! LẬP LUẬN HOÀN HẢO' : 'CHƯA CHÍNH XÁC'}</span>
                </div>
                <p>{stepFeedback}</p>
              </div>
            )}

            {isStepCorrect && (
              <div className="pt-2">
                <button
                  onClick={handleNextStep}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950/40 transition-all uppercase tracking-wider"
                >
                  <span>{currentStepIndex < currentCase.deductionSteps.length - 1 ? 'Tiếp Tục Lập Luận' : 'Vạch Trần Hung Thủ!'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Phase 4: Culprit Breakdown & Case Solved */}
        {phase === 'CULPRIT_REVEAL' && (
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-3 max-w-lg">
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest">
                SHINJITSU WA ITSUMO HITOTSU!
              </span>
              <h2 className="text-2xl font-black text-white">
                CHÂN TƯỚNG SỰ THẬT CHỈ CÓ MỘT!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thư ký <span className="font-bold text-red-400">Tatsumi Ryuichi</span> đã quỳ sụp xuống sàn gạch, hai tay run rẩy cúi đầu nhận tội trước Thanh tra Megure và toàn bộ cảnh sát Tokyo. Căn phòng khóa kín đã được giải mã trọn vẹn!
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-2 w-full max-w-lg">
              <div className="font-bold text-amber-400">Tóm tắt thủ đoạn vụ án:</div>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                <li>Hung thủ tẩm Kali Xyanua vào vành miệng ly pha lê của nạn nhân.</li>
                <li>Dùng cước câu cá luồn qua khe cửa, nối vào khối đá lạnh ngoài ban công để tự động đóng then chốt bên trong.</li>
                <li>Dựng hiện trường cuộc gọi nội bộ giả mạo lúc 20:20 để tạo chứng cứ ngoại phạm.</li>
              </ul>
            </div>

            <button
              onClick={() => {
                onCaseSolved();
                onClose();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-red-950/50 transition-all uppercase tracking-wider active:scale-95"
            >
              Hoàn Thành Vụ Án & Lưu Hồ Sơ Thắng Lợi!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
