import React, { useState } from 'react';
import { GadgetType } from '../types';
import { Disc, Watch, Eye, Zap, Radio, X, Volume2, Lightbulb } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface GadgetToolbarProps {
  activeGlassesMode: boolean;
  onToggleGlasses: () => void;
  onUseStunDart?: () => void;
  hintsRemaining?: number;
  onOpenHintModal?: () => void;
}

export const GadgetToolbar: React.FC<GadgetToolbarProps> = ({
  activeGlassesMode,
  onToggleGlasses,
  onUseStunDart,
  hintsRemaining = 3,
  onOpenHintModal,
}) => {
  const [activeModal, setActiveModal] = useState<GadgetType | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<'KOGORO' | 'MEGURE' | 'SHINICHI' | 'CONAN'>('KOGORO');
  const [sneakerCharge, setSneakerCharge] = useState<number>(85);
  const [badgeTalking, setBadgeTalking] = useState<boolean>(false);

  const handleOpenGadget = (type: GadgetType) => {
    conanAudio.playBowtieDial();
    if (type === 'GLASSES') {
      onToggleGlasses();
      return;
    }
    setActiveModal(type);
  };

  const handleTestVoice = (voiceKey: 'KOGORO' | 'MEGURE' | 'SHINICHI' | 'CONAN') => {
    setSelectedVoice(voiceKey);
    conanAudio.playBowtieDial();
    if (voiceKey === 'KOGORO') {
      conanVoice.speak('SLEEPING_KOGORO', 'Hahaha! Ta là Thám tử lừng danh Mori Kogoro đây! Mọi bí ẩn hãy để ta giải quyết!');
    } else if (voiceKey === 'MEGURE') {
      conanVoice.speak('MEGURE', 'Mau phong tỏa toàn bộ hiện trường tầng 38! Không một ai được phép rời khỏi đây!');
    } else if (voiceKey === 'CONAN') {
      conanVoice.speak('CONAN', 'Ơ kìa... Chú Mori nhìn xem, vết xước kỳ lạ trên then cài cửa này là gì thế ạ?');
    } else {
      conanVoice.speak('CONAN', 'Chân tướng sự thật chỉ có một mà thôi!');
    }
  };

  const handleCallBadge = () => {
    setBadgeTalking(true);
    conanAudio.playEpiphany();
    conanVoice.speak('AGASA', 'Alo Conan hả? Bác Agasa và Haibara đang ở phòng thí nghiệm đây. Mẫu bột trắng trong bình rượu chính là hợp chất Kali Xyanua cực độc, hãy cẩn thận đừng chạm tay không nhé!');
  };

  return (
    <>
      {/* Floating Bottom Gadget Dock (Positioned above mobile bottom nav bar) */}
      <aside aria-label="Hộp bảo bối thám tử" className="fixed bottom-16 lg:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl max-w-[95vw] overflow-x-auto scrollbar-none">
        {/* Hint button */}
        {onOpenHintModal && (
          <button
            onClick={onOpenHintModal}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all active:scale-95 border shrink-0 cursor-pointer ${
              hintsRemaining > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 opacity-80'
            }`}
            title="Gợi ý từ Conan & Tiến sĩ Agasa (Tối đa 3 lượt)"
          >
            <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Gợi Ý ({hintsRemaining}/3)</span>
          </button>
        )}

        {/* Voice Bowtie */}
        <button
          onClick={() => handleOpenGadget('BOWTIE')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all active:scale-95 border border-red-500/30 shrink-0 cursor-pointer"
          title="Nơ thay đổi giọng nói"
        >
          <Disc className="w-4 h-4 text-red-400" />
          <span className="hidden sm:inline">Nơ Đổi Giọng</span>
        </button>

        {/* Stun Gun Watch */}
        <button
          onClick={() => handleOpenGadget('STUN_WATCH')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-all active:scale-95 border border-blue-500/30 shrink-0 cursor-pointer"
          title="Đồng hồ bắn thuốc mê"
        >
          <Watch className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">Đồng Hồ Gây Mê</span>
        </button>

        {/* Tracking Glasses */}
        <button
          onClick={() => handleOpenGadget('GLASSES')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all active:scale-95 border shrink-0 cursor-pointer ${
            activeGlassesMode
              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-lg shadow-amber-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
          }`}
          title="Kính định vị & Quét tia tử ngoại Luminol"
        >
          <Eye className="w-4 h-4" />
          <span>{activeGlassesMode ? 'Kính BẬT' : 'Kính Định Vị'}</span>
        </button>

        {/* Super Sneakers */}
        <button
          onClick={() => handleOpenGadget('SNEAKERS')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 transition-all active:scale-95 border border-amber-500/30 shrink-0 cursor-pointer"
          title="Giày tăng lực siêu mạnh"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Giày Tăng Lực</span>
        </button>

        {/* Detective Boys Badge */}
        <button
          onClick={() => handleOpenGadget('BADGE')}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-all active:scale-95 border border-emerald-500/30 shrink-0 cursor-pointer"
          title="Huy hiệu thám tử nhí"
        >
          <Radio className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Huy Hiệu Bộ Đàm</span>
        </button>
      </aside>

      {/* Bowtie Modal */}
      {activeModal === 'BOWTIE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-600/20 rounded-xl border border-red-500/40">
                  <Disc className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Nơ Thay Đổi Giọng Nói</h3>
                  <p className="text-xs text-slate-400">Sáng chế của Tiến sĩ Hiroshi Agasa</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Xoay núm tần số ở mặt sau chiếc nơ màu đỏ để mô phỏng chính xác sóng âm và cao độ thanh quản của bất kỳ ai!
            </p>

            <div className="space-y-2 mb-6">
              {[
                { key: 'KOGORO', label: 'Thám Tử Mori Kogoro (Giọng trầm, uy lực)', desc: 'Dùng khi phá án lúc chú Mori ngủ gật' },
                { key: 'MEGURE', label: 'Thanh Tra Megure (Hùng hồn, mệnh lệnh)', desc: 'Dùng ra lệnh cho cảnh sát' },
                { key: 'SHINICHI', label: 'Kudo Shinichi (Tự tin, sắc bén)', desc: 'Giọng thật qua điện thoại' },
                { key: 'CONAN', label: 'Edogawa Conan (Ngây thơ, gợi mở)', desc: 'Giả vờ hỏi câu hỏi ngô nghê' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => handleTestVoice(item.key as typeof selectedVoice)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    selectedVoice === item.key
                      ? 'bg-red-950/40 border-red-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-red-400">{item.label}</div>
                    <div className="text-[11px] text-slate-400">{item.desc}</div>
                  </div>
                  <Volume2 className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 text-xs font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all"
            >
              Cài Đặt Tần Số Hoàn Tất
            </button>
          </div>
        </div>
      )}

      {/* Stun-Gun Watch Modal */}
      {activeModal === 'STUN_WATCH' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-blue-500/40 rounded-2xl shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/40">
                  <Watch className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Đồng Hồ Bắn Thuốc Mê</h3>
                  <p className="text-xs text-slate-400">Ống ngắm hồng ngoại & Kim gây mê tức thì</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewfinder crosshairs UI */}
            <div className="relative w-full h-48 rounded-xl bg-slate-950 border border-blue-500/50 flex items-center justify-center overflow-hidden mb-4">
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="absolute w-24 h-24 border-2 border-blue-400/80 rounded-full animate-ping opacity-25" />
              <div className="w-20 h-20 border-2 border-blue-400 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-blue-500/40" />
              <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-blue-500/40" />
              <span className="absolute bottom-2 right-3 font-mono text-[10px] text-blue-400 tracking-wider">
                MỤC TIÊU: KHÓA CHẶT
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Bật nắp đồng hồ, nhắm tâm ngắm vào sau gáy chú Mori Kogoro để kích hoạt màn suy luận ngủ gật trứ danh!
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  conanAudio.playStunDart();
                  if (onUseStunDart) onUseStunDart();
                  setActiveModal(null);
                }}
                className="flex-1 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all"
              >
                Bắn Kim Thuốc Mê!
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                Hạ Nắp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sneakers Modal */}
      {activeModal === 'SNEAKERS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-600/20 rounded-xl border border-amber-500/40">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Giày Tăng Lực Điện Từ</h3>
                  <p className="text-xs text-slate-400">Kích thích huyệt đạo bàn chân & Lực sút siêu thanh</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-xs text-slate-300 mb-2">
                <span>Điện Áp Kích Hoạt</span>
                <span className="font-mono text-amber-400 font-bold">{sneakerCharge}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={sneakerCharge}
                onChange={(e) => setSneakerCharge(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <button
              onClick={() => {
                conanAudio.playObjectionSlam();
                conanVoice.speak('CONAN', 'Lên nào! Cú sút bóng tăng lực sấm sét!');
                setActiveModal(null);
              }}
              className="w-full py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-all"
            >
              Kích Hoạt Xung Điện!
            </button>
          </div>
        </div>
      )}

      {/* Detective Boys Badge Modal */}
      {activeModal === 'BADGE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600/20 rounded-xl border border-emerald-500/40">
                  <Radio className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Huy Hiệu Thám Tử Nhí</h3>
                  <p className="text-xs text-slate-400">Bộ đàm sóng ngắn mã hóa độc quyền</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 mb-4">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Kênh Tần Số: Phòng Nghiên Cứu Tiến Sĩ Agasa</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {badgeTalking
                  ? 'Tiến sĩ Agasa: "Conan, cẩn thận! Hợp chất Xyanua bốc hơi rất nhanh trong phòng ấm, chú ý vết cặn ở vành ly pha lê!"'
                  : 'Bấm nút gọi để liên lạc với Bác Agasa và Haibara để nhận phân tích pháp y độc chất khẩn cấp.'}
              </p>
            </div>

            <button
              onClick={handleCallBadge}
              className="w-full py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all"
            >
              Bật Bộ Đàm Gọi Tiến Sĩ Agasa
            </button>
          </div>
        </div>
      )}
    </>
  );
};
