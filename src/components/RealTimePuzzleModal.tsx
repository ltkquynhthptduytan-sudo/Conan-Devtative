import React, { useState, useEffect } from 'react';
import { Timer, AlertOctagon, KeyRound, Lightbulb, CheckCircle2, RotateCcw, Scissors, Zap } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

import { DifficultyLevel, CaseData } from '../types';

interface RealTimePuzzleModalProps {
  puzzleData?: CaseData['realTimePuzzle'];
  difficulty?: DifficultyLevel;
  onSuccess: () => void;
  onClose: () => void;
}

export const RealTimePuzzleModal: React.FC<RealTimePuzzleModalProps> = ({
  puzzleData,
  difficulty = 'EASY',
  onSuccess,
  onClose,
}) => {
  const initialTime = difficulty === 'HARD'
    ? (puzzleData?.hardTimeLimitSeconds || 40)
    : (puzzleData?.timeLimitSeconds || 60);

  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [pinInput, setPinInput] = useState<string>('');
  const [selectedWire, setSelectedWire] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const puzzleType = puzzleData?.type || 'CIPHER';
  const solution = puzzleData ? String(puzzleData.solution).toUpperCase() : '2015';
  const penalty = difficulty === 'HARD' ? Math.max(puzzleData?.penaltySeconds || 5, 8) : (puzzleData?.penaltySeconds || 5);

  const title = puzzleData?.title || 'Giải Mã Khẩn Cấp Thời Gian Thực';
  const description = puzzleData?.description || 'Hệ thống đếm ngược đang kích hoạt. Hãy nhanh chóng tìm lời giải!';
  const hintText = puzzleData?.hint || 'Hãy quan sát kỹ các chi tiết xung quanh hiện trường!';
  const rewardText = puzzleData?.rewardText || 'Giải mã thành công! Đã thu thập được vật chứng mấu chốt!';

  // Timer countdown loop
  useEffect(() => {
    if (isSolved || isFailed) return;

    conanAudio.playBgm('SUSPENSE');

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFailed(true);
          conanAudio.playDramaticShock();
          conanVoice.speak('CONAN', 'Không kịp rồi! Thời gian đếm ngược đã kết thúc!');
          return 0;
        }
        conanAudio.playTick(prev <= 15);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSolved, isFailed]);

  // Handle Cipher / Keypad input
  const handleDigitClick = (digit: string) => {
    if (pinInput.length < solution.length && !isSolved && !isFailed) {
      conanAudio.playBowtieDial();
      setPinInput(prev => prev + digit);
      setErrorMsg('');
    }
  };

  const handleDelete = () => {
    conanAudio.playBowtieDial();
    setPinInput(prev => prev.slice(0, -1));
  };

  const handleCheckCode = () => {
    if (pinInput === solution) {
      setIsSolved(true);
      conanAudio.playEpiphany();
      conanVoice.speak('CONAN', `Mật mã ${solution} hoàn toàn chính xác! Cơ quan đã được mở!`);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      conanAudio.playDramaticShock();
      setErrorMsg(`Mật mã không đúng! Bị trừ ${penalty} giây thời gian!`);
      setTimeLeft(prev => Math.max(0, prev - penalty));
      setPinInput('');
    }
  };

  // Handle Wires cutting
  const handleCutWire = (wireId: string) => {
    if (isSolved || isFailed) return;
    setSelectedWire(wireId);

    if (wireId.toUpperCase() === solution) {
      setIsSolved(true);
      conanAudio.playEpiphany();
      conanVoice.speak('CONAN', 'Cắt đúng dây xanh lam rồi! Quả bom đã bị vô hiệu hóa hoàn toàn!');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      conanAudio.playDramaticShock();
      setErrorMsg(`Cắt nhầm dây bẫy! Mạch điện phát bíp dồn dập, bị trừ ${penalty} giây!`);
      setTimeLeft(prev => Math.max(0, prev - penalty));
    }
  };

  const handleRetry = () => {
    setTimeLeft(initialTime);
    setPinInput('');
    setSelectedWire(null);
    setIsFailed(false);
    setIsSolved(false);
    setErrorMsg('');
  };

  const wiresList = [
    { id: 'RED', label: 'Dây Đỏ (Red)', color: 'from-red-600 to-red-800', borderColor: 'border-red-500', glow: 'shadow-red-500/50' },
    { id: 'BLUE', label: 'Dây Xanh Lam (Blue)', color: 'from-blue-600 to-blue-800', borderColor: 'border-blue-500', glow: 'shadow-blue-500/50' },
    { id: 'YELLOW', label: 'Dây Vàng (Yellow)', color: 'from-amber-500 to-amber-700', borderColor: 'border-amber-400', glow: 'shadow-amber-500/50' },
    { id: 'WHITE', label: 'Dây Trắng (White)', color: 'from-slate-200 to-slate-400', borderColor: 'border-white text-slate-900', glow: 'shadow-white/50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-red-500/50 rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col gap-4 sm:gap-5 max-h-[92vh] overflow-y-auto">
        {/* Header & Urgent Timer */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/20 rounded-xl border border-red-500/40">
              {puzzleType === 'WIRES' ? (
                <Zap className="w-6 h-6 text-red-500 animate-pulse" />
              ) : (
                <KeyRound className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white line-clamp-1">{title}</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {puzzleType === 'WIRES' ? 'Tháo ngòi nổ ngắt mạch' : 'Giải mã thời gian thực'}
              </p>
            </div>
          </div>

          {/* Countdown Display */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
            timeLeft <= 15
              ? 'bg-red-600/30 text-red-400 border-red-500 animate-pulse'
              : 'bg-slate-950 text-amber-400 border-slate-800'
          }`}>
            <Timer className="w-4 h-4" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
        </div>

        {/* Puzzle description & hint */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
          <p className="text-slate-300 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                setShowHint(!showHint);
                conanAudio.playEpiphany();
              }}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Ẩn gợi ý' : 'Gợi ý của Conan'}</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">
              {puzzleType === 'WIRES' ? 'Chọn 1 dây ngắt mạch' : `${solution.length} Chữ Số`}
            </span>
          </div>

          {showHint && (
            <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-200 text-[11px] leading-relaxed animate-fade-in">
              💡 {hintText}
            </div>
          )}
        </div>

        {/* Puzzle Interactive Controls: WIRES vs CIPHER */}
        {puzzleType === 'WIRES' ? (
          /* Wire Cutting Interface */
          <div className="space-y-3 py-2">
            <div className="text-center text-xs font-mono text-slate-400 mb-1">
              Nhấp vào kéo để chọn dây điện muốn cắt:
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {wiresList.map((wire) => (
                <button
                  key={wire.id}
                  onClick={() => handleCutWire(wire.id)}
                  disabled={isSolved || isFailed}
                  className={`group relative flex items-center justify-between px-4 py-3 bg-gradient-to-r ${wire.color} border ${wire.borderColor} rounded-2xl shadow-lg hover:brightness-125 transition-all duration-200 cursor-pointer disabled:opacity-50`}
                >
                  {/* Wire lines graphics */}
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-slate-950 border ${wire.borderColor}`} />
                    <span className="font-bold text-sm tracking-wide text-white drop-shadow">
                      {wire.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1 rounded-xl text-xs font-mono text-slate-200 border border-slate-700 group-hover:border-white">
                    <Scissors className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                    <span>Cắt Dây</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Keypad CIPHER Interface */
          <>
            {/* PIN Display */}
            <div className="flex justify-center items-center gap-2.5 py-2">
              {Array.from({ length: solution.length }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center font-mono text-2xl font-black ${
                    pinInput[idx]
                      ? 'border-red-500 bg-red-950/30 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-600'
                  }`}
                >
                  {pinInput[idx] || '•'}
                </div>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((key) => {
                if (key === 'C') {
                  return (
                    <button
                      key={key}
                      onClick={handleDelete}
                      className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Xóa
                    </button>
                  );
                }
                if (key === '✓') {
                  return (
                    <button
                      key={key}
                      onClick={handleCheckCode}
                      disabled={pinInput.length !== solution.length}
                      className="py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Mở Khóa
                    </button>
                  );
                }
                return (
                  <button
                    key={key}
                    onClick={() => handleDigitClick(key)}
                    className="py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-100 font-mono font-bold rounded-xl text-base transition-colors active:scale-95 cursor-pointer"
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {errorMsg && (
          <div className="text-center text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 animate-shake p-2 bg-red-950/40 rounded-xl border border-red-500/30">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Failed State Dialog */}
        {isFailed && (
          <div className="p-4 bg-red-950/80 border border-red-500 rounded-2xl text-center space-y-3">
            <div className="text-red-400 font-bold text-sm uppercase tracking-wider">HẾT GIỜ! GIẢI MÃ THẤT BẠI</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thời gian đếm ngược đã kết thúc! Bạn có thể kích hoạt xung điện từ thiết bị của Conan để thử lại!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/50"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử Lại ({initialTime}s)</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Solved State */}
        {isSolved && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-emerald-300 font-bold text-sm">XUẤT SẮC! GIẢI MÃ HOÀN TẤT</div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {rewardText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
