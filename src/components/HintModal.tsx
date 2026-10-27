import React from 'react';
import { CaseData } from '../types';
import { Lightbulb, Sparkles, AlertCircle, CheckCircle2, X, Lock, HelpCircle } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: CaseData;
  hintsRemaining: number;
  revealedHintLevels: number;
  onUseHint: () => void;
  isPixelBWMode?: boolean;
}

export const getCaseHints = (caseId: string, caseNumber: number) => {
  if (caseId === 'CASE_01_LOCKED_ROOM' || caseNumber === 1) {
    return [
      {
        level: 1,
        title: 'Gợi ý 1: Manh Mối Hiện Trường & Thiết Bị',
        content: `• Bật Kính Định Vị (Luminol) để kiểm tra ban công tầng 38 và phát hiện vết nước đọng do khối đá tan chảy.\n• Soi kính phóng đại vào then cài cửa chính: có vết xước kim loại mỏng cùng sợi tơ mỏng li ti còn sót lại.\n• Mở két sắt ẩn sau bức tranh: nhập mật mã 2015 (dựa trên thời điểm đồng hồ dừng lại 20:15 và 4 cánh hoa tuyết)!`,
        voiceText: 'Bác Agasa và Conan gợi ý: Hãy dùng Kính Định Vị Luminol quét ban công và nhập mật mã 2015 mở két sắt!',
      },
      {
        level: 2,
        title: 'Gợi ý 2: Mâu Thuẫn Lời Khai & Thời Gian Ngoại Phạm',
        content: `• Thư ký Tatsumi Ryuichi khai nhận cuộc gọi nội bộ lúc 20:20 từ chủ tịch Tachibana.\n• Đối chiếu với Báo cáo pháp y: nạn nhân đã tử vong chính xác lúc 20:15 do Kali Xyanua!\n• Lời khai của Tatsumi lúc 20:20 hoàn toàn bịa đặt để tạo bằng chứng ngoại phạm giả!`,
        voiceText: 'Conan gợi ý: Báo cáo pháp y chứng minh nạn nhân qua đời từ 20:15, vậy ai là người gọi điện lúc 20:20?!',
      },
      {
        level: 3,
        title: 'Gợi ý 3: Mánh Khóa Phòng Kín & Bằng Chứng Tố Cáo Thủ Phạm',
        content: `• Thủ phạm chính là Tatsumi Ryuichi!\n• Mánh khóe phòng kín: Hắn dùng 4m sợi cước câu cá luồn qua then cài, buộc khối đá ngoài ban công. Khi đá tan, then sập lại khóa phòng từ bên trong!\n• Bằng chứng quyết định: Chiếc bút máy Montblanc giấu ống tiêm Kali Xyanua trong túi áo khoác của Tatsumi!`,
        voiceText: 'Chân tướng sự thật chỉ có một! Tatsumi giấu ống tiêm xyanua trong bút máy và gài bẫy sợi cước!',
      },
    ];
  }

  if (caseId === 'CASE_02_TOKYO_TOWER_BOMB' || caseNumber === 2) {
    return [
      {
        level: 1,
        title: 'Gợi ý 1: Manh Mối Quả Bom & Bảng Điều Khiển',
        content: `• Dùng Kính phóng đại kiểm tra bảng mạch đếm ngược của quả bom tại cabin thang máy Tháp Tokyo.\n• Ghép các mảnh thơ Haiku bị xé để dịch mật mã màu sắc dây kíp nổ!\n• Chú ý kiểm tra hộp dụng cụ kỹ thuật dính vụn nhựa màu xanh lam.`,
        voiceText: 'Conan gợi ý: Bài thơ Haiku ẩn chứa quy luật màu sắc dây kíp nổ quả bom C4!',
      },
      {
        level: 2,
        title: 'Gợi ý 2: Mâu Thuẫn Nghi Can & Xưởng Hóa Chất',
        content: `• Nghi can Kanzaki Koji khẳng định không chuẩn bị kíp nổ hay hóa chất C4 trong xưởng.\n• Nhưng báo cáo kỹ thuật cho thấy dây kíp nổ bọc nhựa xanh lam hoàn toàn trùng khớp với bộ kìm kỹ thuật của anh ta!`,
        voiceText: 'Conan gợi ý: Bộ kìm bọc cao su trong hộp dụng cụ dính nhựa kíp nổ trùng khớp với nghi can Kanzaki!',
      },
      {
        level: 3,
        title: 'Gợi ý 3: Mánh Khóa & Thủ Phạm Cài Bom',
        content: `• Thủ phạm cài bom chính là Kanzaki Koji!\n• Mánh khóe: Hắn lợi dụng thời gian bảo trì cabin thang máy để gài bộ nhận diện sóng ngắn điều khiển từ xa.\n• Bằng chứng quyết định: Dấu vân tay trên kìm bọc cao su và bản vẽ sơ đồ Tháp Tokyo!`,
        voiceText: 'Chân tướng sự thật chỉ có một! Kanzaki Koji lợi dụng ca bảo trì để gài quả bom!',
      },
    ];
  }

  if (caseId === 'CASE_03_TEA_HOUSE' || caseNumber === 3) {
    return [
      {
        level: 1,
        title: 'Gợi ý 1: Manh Mối Độc Chất & Hiện Trường Trà Đạo',
        content: `• Bật Kính Luminol soi vành chén trà gốm Raku – chú ý lớp sáp ong bọc độc xyanua mỏng dưới đáy chén!\n• Lắng nghe tiếng kêu khác thường từ chiếc chuông gió đồng treo ngoài hiên nhà trà.\n• Kiểm tra bảng cầu chì bị ngắt bằng rơ-le hồng ngoại sóng ngắn.`,
        voiceText: 'Conan gợi ý: Độc xyanua được tráng sáp ong dưới đáy chén trà gốm Raku!',
      },
      {
        level: 2,
        title: 'Gợi ý 2: Lời Khai Mâu Thuẫn & Nan Quạt Xếp',
        content: `• Nghi can Shindo Ren khai rằng không hề chạm tay vào bộ ấm chén trà đạo.\n• Tuy nhiên, vết sáp ong chống thấm trên nan quạt xếp và ngón tay của Shindo Ren mâu thuẫn hoàn toàn với lời khai!`,
        voiceText: 'Conan gợi ý: Nan quạt của Shindo Ren dính sáp ong và giấu đầu phát tín hiệu hồng ngoại!',
      },
      {
        level: 3,
        title: 'Gợi ý 3: Mánh Khóa Thắt Cổ & Thủ Phạm Nhà Trà',
        content: `• Thủ phạm là Shindo Ren!\n• Mánh khóe: Dập điện 30 giây bằng rơ-le hồng ngoại trên chiếc quạt. Độc xyanua được tráng sáp ong dưới đáy chén trà; khi rót nước sôi vào, sáp chảy ra giải phóng chất độc!\n• Bằng chứng quyết định: Viên hồng ngọc Huyết Nguyệt giấu trong quả lắc chuông gió đồng và tờ giấy nợ 200 triệu Yên!`,
        voiceText: 'Chân tướng sự thật chỉ có một! Shindo Ren đã giấu viên hồng ngọc Huyết Nguyệt trong chiếc chuông gió!',
      },
    ];
  }

  // Fallback for custom / dynamic cases
  return [
    {
      level: 1,
      title: 'Gợi ý 1: Khảo Sát Hiện Trường & Vật Chứng',
      content: 'Hãy dùng Kính Định Vị (Kính Luminol) kiểm tra từng điểm nóng trên hiện trường để thu thập ít nhất 3 vật chứng quan trọng.',
      voiceText: 'Bác Agasa gợi ý: Hãy tích cực thu thập đủ các vật chứng tại hiện trường!',
    },
    {
      level: 2,
      title: 'Gợi ý 2: Mâu Thuẫn Trong Sổ Tang Chứng',
      content: 'So sánh mâu thuẫn giữa Báo cáo Pháp y/Vật chứng chìa khóa với Lời khai mâu thuẫn của các nghi can trong Hồ Sơ Nghi Can.',
      voiceText: 'Conan gợi ý: Hãy xem kỹ mâu thuẫn trong lời khai nghi can!',
    },
    {
      level: 3,
      title: 'Gợi ý 3: Vật Chứng Quyết Định Phá Án',
      content: 'Vật chứng có biểu tượng chìa khóa chính là bằng chứng quyết định vạch mặt thủ phạm trong màn Phá Án Climax!',
      voiceText: 'Chân tướng sự thật chỉ có một! Chọn đúng vật chứng chìa khóa để phá án!',
    },
  ];
};

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  currentCase,
  hintsRemaining,
  revealedHintLevels,
  onUseHint,
  isPixelBWMode = false,
}) => {
  if (!isOpen) return null;

  const caseHints = getCaseHints(currentCase.id, currentCase.caseNumber);

  const handleRevealNextHint = () => {
    if (hintsRemaining <= 0) return;
    const nextLevel = revealedHintLevels + 1;
    const hintData = caseHints.find(h => h.level === nextLevel);

    conanAudio.playEpiphany();
    if (hintData) {
      conanVoice.speak('CONAN', hintData.voiceText);
    } else {
      conanVoice.speak('AGASA', 'Bác Agasa và Conan đã mở thêm gợi ý cho cháu!');
    }

    onUseHint();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-lg bg-slate-900 border rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 relative ${
        isPixelBWMode ? 'border-amber-400 font-mono' : 'border-amber-500/50'
      }`}>
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400">
              <Lightbulb className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Gợi Ý Conan & Tiến Sĩ Agasa
                </h3>
              </div>
              <p className="text-xs text-amber-400/90 font-semibold">
                Vụ án #{currentCase.caseNumber}: {currentCase.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Badge Banner */}
        <div className="my-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 font-semibold">Số lượt gợi ý còn lại:</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono font-bold text-sm">
            <span className={`px-2.5 py-0.5 rounded-md border ${
              hintsRemaining > 0 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                : 'bg-red-950/80 border-red-500/50 text-red-400'
            }`}>
              {hintsRemaining} / 3 Lượt
            </span>
          </div>
        </div>

        {/* Revealed Hints List */}
        <div className="space-y-3 my-4 max-h-[50vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
          {caseHints.map((hint) => {
            const isRevealed = hint.level <= revealedHintLevels;

            return (
              <div
                key={hint.level}
                className={`p-3.5 rounded-xl border transition-all ${
                  isRevealed
                    ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    {isRevealed ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className={isRevealed ? 'text-amber-300' : 'text-slate-500'}>
                      {hint.title}
                    </span>
                  </div>
                  {isRevealed && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      Đã mở
                    </span>
                  )}
                </div>

                {isRevealed ? (
                  <p className="text-xs leading-relaxed text-slate-200 whitespace-pre-line pl-6">
                    {hint.content}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic pl-6">
                    [Gợi ý mức {hint.level} chưa mở khóa - Bấm nút bên dưới để sử dụng 1 lượt gợi ý]
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button Area */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5">
          {hintsRemaining > 0 ? (
            <button
              onClick={handleRevealNextHint}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Dùng 1 Lượt Gợi Ý (Còn {hintsRemaining}/3)</span>
            </button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-950/40 border border-red-500/40 text-red-400 rounded-xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Đã hết 3/3 lượt gợi ý cho vụ án này!</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
