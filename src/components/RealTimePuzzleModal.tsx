import React, { useState, useEffect } from 'react';
import { Timer, AlertOctagon, KeyRound, Lightbulb, CheckCircle2, RotateCcw } from 'lucide-react';
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
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const CORRECT_PIN = puzzleData ? String(puzzleData.solution) : '2015';
  const penalty = difficulty === 'HARD' ? 8 : 5;

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
          conanVoice.speak('CONAN', 'Không kịp rồi! Hệ thống bảo mật đã kích hoạt chế độ tự khóa vĩnh viễn!');
          return 0;
        }
        conanAudio.playTick(prev <= 15);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSolved, isFailed]);

  const handleDigitClick = (digit: string) => {
    if (pinInput.length < 4 && !isSolved && !isFailed) {
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
    if (pinInput === CORRECT_PIN) {
      setIsSolved(true);
      conanAudio.playEpiphany();
      conanVoice.speak('CONAN', `Mật mã ${CORRECT_PIN} hoàn toàn chính xác! Cơ quan bí mật đã được mở ra!`);
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

  const handleRetry = () => {
    setTimeLeft(initialTime);
    setPinInput('');
    setIsFailed(false);
    setIsSolved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-red-500/50 rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col gap-4 sm:gap-5 max-h-[92vh] overflow-y-auto">
        {/* Header & Urgent Timer */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/20 rounded-xl border border-red-500/40">
              <KeyRound className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Mật Mã Két Sắt Khẩn Cấp</h2>
              <p className="text-[11px] text-slate-400 font-mono">Giải đố theo thời gian thực</p>
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
            Két sắt tự hủy dữ liệu sau 60 giây. Mật mã gồm 4 chữ số biểu thị thời khắc quan trọng nhất mà nạn nhân đã cố gắng báo trước khi ngã xuống!
          </p>
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                setShowHint(!showHint);
                conanAudio.playEpiphany();
              }}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold text-[11px]"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHint ? 'Ẩn gợi ý' : 'Gợi ý của Conan'}</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">4 Chữ Số</span>
          </div>

          {showHint && (
            <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl text-amber-200 text-[11px] leading-relaxed animate-fade-in">
              💡 Bác Tachibana trúng độc vào lúc 20:15 và chiếc đồng hồ trên bàn làm việc đã dừng lại đúng lúc đó!
            </div>
          )}
        </div>

        {/* PIN Display */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[0, 1, 2, 3].map((idx) => (
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

        {errorMsg && (
          <div className="text-center text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 animate-shake">
            <AlertOctagon className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((key) => {
            if (key === 'C') {
              return (
                <button
                  key={key}
                  onClick={handleDelete}
                  className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
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
                  disabled={pinInput.length !== 4}
                  className="py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Mở Khóa
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => handleDigitClick(key)}
                className="py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-100 font-mono font-bold rounded-xl text-base transition-colors active:scale-95"
              >
                {key}
              </button>
            );
          })}
        </div>

        {/* Failed State Dialog */}
        {isFailed && (
          <div className="p-4 bg-red-950/80 border border-red-500 rounded-2xl text-center space-y-3">
            <div className="text-red-400 font-bold text-sm">HẾT GIỜ! KÉT SẮT ĐÃ KHÓA</div>
            <p className="text-xs text-slate-300">
              Dữ liệu sắp bị xóa! Conan có thể thử lại bằng cách kích hoạt xung điện từ của Giày Tăng Lực!
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRetry}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử Lại (60s Mới)</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Bỏ Qua
              </button>
            </div>
          </div>
        )}

        {/* Solved State */}
        {isSolved && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-emerald-300 font-bold text-sm">MẬT MÃ CHÍNH XÁC: 2015!</div>
            <p className="text-xs text-slate-300">
              Két sắt đã bật mở! Thu được Hợp đồng biển thủ 500 triệu Yên của Tatsumi!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
