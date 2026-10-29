import React, { useState, useEffect } from 'react';
import { Timer, AlertOctagon, KeyRound, Lightbulb, CheckCircle2, RotateCcw, Scissors, Zap, Flame, Check, BookOpen, X, HelpCircle, ShieldAlert, UserCheck } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

import { DifficultyLevel, CaseData } from '../types';
import { DetectiveCharacter, DETECTIVE_CHARACTERS } from '../data/charactersData';

interface RealTimePuzzleModalProps {
  puzzleData?: CaseData['realTimePuzzle'];
  difficulty?: DifficultyLevel;
  selectedCharacter?: DetectiveCharacter;
  equippedItemsBonusTime?: number;
  onSuccess: () => void;
  onClose: () => void;
}

const WIRE_INFO: Record<string, { label: string; colorName: string; verse: string; effect: string; stepBadgeClass: string }> = {
  WHITE: {
    label: 'Dây Trắng (WHITE)',
    colorName: 'Màu Trắng',
    verse: '"Tuyết trắng phủ ngọn núi"',
    effect: 'Cô lập vi mạch kích nổ phụ',
    stepBadgeClass: 'bg-slate-200 text-slate-950',
  },
  RED: {
    label: 'Dây Đỏ (RED)',
    colorName: 'Màu Đỏ',
    verse: '"Hoa anh đào rực đỏ"',
    effect: 'Ngắt dòng điện áp cao nguyên phát',
    stepBadgeClass: 'bg-red-600 text-white',
  },
  YELLOW: {
    label: 'Dây Vàng (YELLOW)',
    colorName: 'Màu Vàng',
    verse: '"Ánh nắng thu vàng ấm"',
    effect: 'Triệt tiêu điện áp tụ tích lũy',
    stepBadgeClass: 'bg-amber-400 text-slate-950',
  },
  BLUE: {
    label: 'Dây Xanh Lam (BLUE)',
    colorName: 'Màu Xanh Lam',
    verse: '"Chìm vào biển xanh bao la"',
    effect: 'Triệt tiêu nguồn điện dự phòng cuối cùng',
    stepBadgeClass: 'bg-blue-600 text-white',
  },
};

const generateRandomWireSequence = (): string[] => {
  const wires = ['WHITE', 'RED', 'YELLOW', 'BLUE'];
  for (let i = wires.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wires[i], wires[j]] = [wires[j], wires[i]];
  }
  return wires;
};

export const RealTimePuzzleModal: React.FC<RealTimePuzzleModalProps> = ({
  puzzleData,
  difficulty = 'EASY',
  selectedCharacter = DETECTIVE_CHARACTERS[0],
  equippedItemsBonusTime = 0,
  onSuccess,
  onClose,
}) => {
  // Apply character bonus extra time + shop equipment bonus time
  const characterTimeBonus = selectedCharacter?.extraTimeSeconds || 0;
  const initialTime = Math.round((difficulty === 'HARD'
    ? (puzzleData?.hardTimeLimitSeconds || 40)
    : (puzzleData?.timeLimitSeconds || 60)) + characterTimeBonus + equippedItemsBonusTime);

  const maxManualViews = selectedCharacter?.maxManualViews ?? 1;

  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [pinInput, setPinInput] = useState<string>('');
  const [cutSequence, setCutSequence] = useState<string[]>([]);
  const [randomWireSequence, setRandomWireSequence] = useState<string[]>(generateRandomWireSequence);
  const [manualViewsCount, setManualViewsCount] = useState<number>(0);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showDefusalManual, setShowDefusalManual] = useState<boolean>(false);

  const puzzleType = puzzleData?.type || 'CIPHER';
  
  // Target solution array (randomized per attempt for WIRES, fixed cipher for CIPHER)
  const targetSequence = React.useMemo(() => {
    if (puzzleType === 'WIRES') {
      return randomWireSequence;
    }
    if (!puzzleData?.solution) return ['2015'];
    if (Array.isArray(puzzleData.solution)) {
      return puzzleData.solution.map(s => String(s).toUpperCase());
    }
    return [String(puzzleData.solution).toUpperCase()];
  }, [puzzleType, randomWireSequence, puzzleData?.solution]);

  const cipherSolution = puzzleData ? String(puzzleData.solution).toUpperCase() : '2015';
  const penalty = difficulty === 'HARD' ? Math.max(puzzleData?.penaltySeconds || 5, 8) : (puzzleData?.penaltySeconds || 5);

  const title = puzzleData?.title || 'Giải Mã Khẩn Cấp Thời Gian Thực';
  const description = puzzleData?.description || 'Hệ thống đếm ngược đang kích hoạt. Hãy nhanh chóng tìm lời giải!';
  const hintText = puzzleData?.hint || 'Hãy quan sát kỹ các chi tiết xung quanh hiện trường!';
  const rewardText = puzzleData?.rewardText || 'Giải mã thành công! Đã thu thập được vật chứng mấu chốt!';

  // Open defusal manual handler with 1-view limit enforcement
  const handleOpenDefusalManual = () => {
    if (manualViewsCount >= maxManualViews) {
      conanAudio.playDramaticShock();
      setErrorMsg(`⚠️ Đã xem Sổ Hướng Dẫn ${manualViewsCount}/${maxManualViews} lần tối đa! Hãy tự ghi nhớ để cắt dây!`);
      return;
    }
    setManualViewsCount(prev => prev + 1);
    setShowDefusalManual(true);
    conanAudio.playEpiphany();
  };

  // Timer countdown loop
  useEffect(() => {
    if (isSolved || isFailed || isExploded) return;

    conanAudio.playBgm('SUSPENSE');

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFailed(true);
          conanAudio.playDramaticShock();
          conanVoice.speak('CONAN', 'Hết giờ rồi! Quả bom đã tự động kích hoạt ngòi nổ!');
          return 0;
        }
        conanAudio.playTick(prev <= 15);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSolved, isFailed, isExploded]);

  // Handle Cipher / Keypad input
  const handleDigitClick = (digit: string) => {
    if (pinInput.length < cipherSolution.length && !isSolved && !isFailed) {
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
    if (pinInput === cipherSolution) {
      setIsSolved(true);
      conanAudio.playEpiphany();
      conanVoice.speak('CONAN', `Mật mã ${cipherSolution} hoàn toàn chính xác! Cơ quan đã được mở!`);
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

  // Handle Sequential Wire cutting (Case 2 Bomb Defusal)
  const handleCutWire = (wireId: string) => {
    if (isSolved || isFailed || isExploded) return;

    const normalizedWire = wireId.toUpperCase();

    // Ignore if wire already cut
    if (cutSequence.includes(normalizedWire)) return;

    // Expected wire at this step in the sequence
    const expectedWire = targetSequence[cutSequence.length];

    if (normalizedWire === expectedWire) {
      // Correct wire cut in sequence!
      const newSequence = [...cutSequence, normalizedWire];
      setCutSequence(newSequence);
      conanAudio.playBowtieDial();
      setErrorMsg('');

      // Check if full sequence completed
      if (newSequence.length === targetSequence.length) {
        setIsSolved(true);
        conanAudio.playEpiphany();
        conanVoice.speak('CONAN', 'Xuất sắc! Toàn bộ 4 sợi dây đã được cắt đúng thứ tự! Quả bom C4 đã bị vô hiệu hóa hoàn toàn!');
        setTimeout(() => {
          onSuccess();
        }, 1800);
      } else {
        // Feedback for correct step
        conanAudio.playClueFound();
      }
    } else {
      // WRONG WIRE OR WRONG ORDER -> INSTANT EXPLOSION!
      setIsExploded(true);
      setIsFailed(true);
      conanAudio.playDramaticShock();
      conanVoice.speak('CONAN', 'BOM ĐÃ NỔ TUNG! Cắt sai thứ tự dây kích nổ rồi!');
    }
  };

  const handleRetry = () => {
    setRandomWireSequence(generateRandomWireSequence());
    setManualViewsCount(0);
    setTimeLeft(initialTime);
    setPinInput('');
    setCutSequence([]);
    setIsExploded(false);
    setIsFailed(false);
    setIsSolved(false);
    setErrorMsg('');
  };

  const wiresList = [
    { id: 'WHITE', label: 'Dây Trắng (WHITE)', color: 'from-slate-100 to-slate-300 text-slate-900', borderColor: 'border-white', badgeBg: 'bg-slate-200 text-slate-900' },
    { id: 'RED', label: 'Dây Đỏ (RED)', color: 'from-red-600 to-red-800 text-white', borderColor: 'border-red-500', badgeBg: 'bg-red-600 text-white' },
    { id: 'YELLOW', label: 'Dây Vàng (YELLOW)', color: 'from-amber-400 to-amber-600 text-slate-950 font-bold', borderColor: 'border-amber-400', badgeBg: 'bg-amber-400 text-slate-950' },
    { id: 'BLUE', label: 'Dây Xanh Lam (BLUE)', color: 'from-blue-600 to-blue-800 text-white', borderColor: 'border-blue-500', badgeBg: 'bg-blue-600 text-white' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-md bg-slate-900 border ${
        isExploded ? 'border-red-600 shadow-red-900/80 bg-red-950/40' : 'border-red-500/50'
      } rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col gap-4 sm:gap-5 max-h-[92vh] overflow-y-auto transition-all duration-300`}>
        
        {/* Header & Urgent Timer */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isExploded ? 'bg-red-600/30 border-red-500 animate-ping' : 'bg-red-600/20 border-red-500/40'
            }`}>
              {puzzleType === 'WIRES' ? (
                <Zap className="w-6 h-6 text-red-500 animate-pulse" />
              ) : (
                <KeyRound className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white line-clamp-1">{title}</h2>
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Thám tử: {selectedCharacter.name} (+{characterTimeBonus}s)</span>
              </p>
            </div>
          </div>

          {/* Countdown Display & Close X button */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
              timeLeft <= 15 || isExploded
                ? 'bg-red-600/30 text-red-400 border-red-500 animate-pulse'
                : 'bg-slate-950 text-amber-400 border-slate-800'
            }`}>
              <Timer className="w-4 h-4" />
              <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
            </div>

            <button
              onClick={onClose}
              title="Đóng bảng giải mật mã (Nút X)"
              className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer border border-slate-700 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
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
            <span className="text-[10px] text-red-400 font-mono font-bold">
              {puzzleType === 'WIRES' ? `Tiến độ: ${cutSequence.length}/${targetSequence.length} dây` : `${cipherSolution.length} Chữ Số`}
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
          /* Wire Cutting Interface with Sequence Step Indicators & Defusal Manual Button */
          <div className="space-y-3 py-1">
            {/* Defusal Manual Toggle Button (Strict 1-view limit) */}
            <button
              onClick={handleOpenDefusalManual}
              disabled={manualViewsCount >= maxManualViews}
              className={`w-full py-2.5 px-3 border rounded-2xl flex items-center justify-between text-xs font-bold shadow-md cursor-pointer transition-all active:scale-[0.98] ${
                manualViewsCount >= maxManualViews
                  ? 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-amber-600/30 to-amber-700/30 hover:from-amber-600/50 hover:to-amber-700/50 border-amber-500/50 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>📖 Sổ Hướng Dẫn Gỡ Bom C4</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                manualViewsCount >= maxManualViews ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}>
                {manualViewsCount >= maxManualViews ? 'ĐÃ XEM (ĐÃ KHÓA)' : `${manualViewsCount}/${maxManualViews} Lần Xem`}
              </span>
            </button>

            {/* Sequence Step Indicators (Masked to prevent spoiling) */}
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-300 flex justify-between items-center">
                <span>Tiến Trình Cắt Dây Kích Nổ:</span>
                <span className="text-amber-400 font-mono">{cutSequence.length} / {targetSequence.length}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {targetSequence.map((_, idx) => {
                  const isDone = idx < cutSequence.length;
                  const isCurrent = idx === cutSequence.length;
                  const doneWireId = cutSequence[idx];
                  const wireConfig = doneWireId ? wiresList.find(w => w.id === doneWireId) : null;

                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                        isDone
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : isCurrent
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold">Bước {idx + 1}</div>
                      <div className="text-[11px] font-bold mt-0.5 flex items-center justify-center gap-1">
                        {isDone ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{wireConfig ? wireConfig.id : doneWireId}</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="text-slate-400">❓ Slot {idx + 1}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wire buttons list */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {wiresList.map((wire) => {
                const isCut = cutSequence.includes(wire.id);

                return (
                  <button
                    key={wire.id}
                    onClick={() => handleCutWire(wire.id)}
                    disabled={isCut || isSolved || isFailed || isExploded}
                    className={`group relative flex items-center justify-between px-4 py-3 bg-gradient-to-r ${wire.color} border ${wire.borderColor} rounded-2xl shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      isCut ? 'grayscale border-dashed' : 'hover:brightness-125 hover:scale-[1.01]'
                    }`}
                  >
                    {/* Wire graphics */}
                    <div className="flex items-center gap-3">
                      <div className={`w-3.5 h-3.5 rounded-full bg-slate-950 border-2 ${wire.borderColor} flex items-center justify-center`}>
                        {isCut && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                      </div>
                      <span className={`font-bold text-sm tracking-wide ${isCut ? 'line-through opacity-70' : ''}`}>
                        {wire.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl text-xs font-mono text-slate-200 border border-slate-700">
                      {isCut ? (
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          ✂️ ĐÃ CẮT
                        </span>
                      ) : (
                        <>
                          <Scissors className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                          <span>Cắt Dây này</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Keypad CIPHER Interface */
          <>
            {/* PIN Display */}
            <div className="flex justify-center items-center gap-2.5 py-2">
              {Array.from({ length: cipherSolution.length }).map((_, idx) => (
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
                      disabled={pinInput.length !== cipherSolution.length}
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
          <div className="text-center text-xs font-bold text-red-400 flex items-center justify-center gap-1.5 animate-shake p-2.5 bg-red-950/50 rounded-xl border border-red-500/40">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* EXPLOSION FAIL STATE DIALOG */}
        {isExploded && (
          <div className="p-4 bg-gradient-to-b from-red-900/90 to-red-950 border-2 border-red-500 rounded-2xl text-center space-y-3 shadow-2xl animate-bounce-once">
            <div className="flex items-center justify-center gap-2 text-red-400 font-black text-base uppercase tracking-wider">
              <Flame className="w-6 h-6 text-amber-500 animate-bounce" />
              <span>🔥 BOM C4 ĐÃ NỔ TUNG!</span>
            </div>
            <p className="text-xs text-red-100 leading-relaxed font-semibold">
              Bạn đã cắt sai thứ tự dây ngắt mạch! Lượt chơi tiếp theo sẽ tự động RANDOM thứ tự dây mới!
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/80 uppercase tracking-wider"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử Lại Từ Đầu ({initialTime}s)</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 bg-slate-900 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* TIMEOUT FAIL STATE DIALOG (NON-EXPLOSION) */}
        {isFailed && !isExploded && (
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
            <div className="text-emerald-300 font-bold text-sm">XUẤT SẮC! THÁO NGÒI NỔ HOÀN TẤT</div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {rewardText}
            </p>
          </div>
        )}
      </div>

      {/* BOMB DEFUSAL MANUAL OVERLAY MODAL */}
      {showDefusalManual && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl p-5 text-slate-100 space-y-4 max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setShowDefusalManual(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3">
              <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-black text-amber-300 uppercase tracking-wide">
                  📖 SỔ HƯỚNG DẪN GỠ BOM C4 (BẢN TỰ ĐỘNG RANDOM)
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Tài liệu quy tắc tháo gỡ vật nổ sở cảnh sát Tokyo
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30 space-y-2">
                <div className="text-amber-400 font-bold flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Thứ Tự Haiku Cho Lượt Này:</span>
                  </span>
                  <span className="text-[10px] font-mono text-red-400">Đã xem: {manualViewsCount}/{maxManualViews} Lần</span>
                </div>
                <blockquote className="italic text-amber-100 bg-amber-950/30 p-3 rounded-xl border border-amber-500/20 text-[11px] font-serif leading-relaxed space-y-1">
                  {randomWireSequence.map((wireId, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="font-sans font-bold text-amber-400 text-[10px]">{idx + 1}.</span>
                      <span>{WIRE_INFO[wireId]?.verse}</span>
                    </div>
                  ))}
                </blockquote>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-amber-300 text-xs flex items-center justify-between">
                  <span>⚡ Quy Tắc Cắt Dây Lượt Hiện Tại:</span>
                </h4>
                <div className="space-y-2 text-[11px]">
                  {randomWireSequence.map((wireId, idx) => {
                    const info = WIRE_INFO[wireId];
                    if (!info) return null;
                    return (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                        <span className={`px-2 py-0.5 font-black rounded-lg text-[10px] shrink-0 mt-0.5 ${info.stepBadgeClass}`}>
                          Bước {idx + 1}
                        </span>
                        <div>
                          <strong className="text-white">{info.label}:</strong> {info.verse} — {info.effect}.
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-xl text-[11px] text-red-300 font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>LƯU Ý: Bạn đã xem {manualViewsCount}/{maxManualViews} lần. Hãy GHI NHỚ thứ tự này vì sau khi đóng, bạn sẽ không thể mở lại Sổ Hướng Dẫn nữa!</span>
              </div>
            </div>

            <button
              onClick={() => setShowDefusalManual(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-colors uppercase tracking-wider"
            >
              Đã Nhớ Quy Tắc — Bắt Đầu Cắt Dây
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


