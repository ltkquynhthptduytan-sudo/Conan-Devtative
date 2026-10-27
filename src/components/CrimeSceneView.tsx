import React, { useState } from 'react';
import { Hotspot, EvidenceItem, CaseData } from '../types';
import { Search, Sparkles, CheckCircle2, AlertTriangle, Key, Timer, MapPin, Clock } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';
import { getCrimeSceneImage } from '../assets/images';

interface CrimeSceneViewProps {
  currentCase: CaseData;
  hotspots: Hotspot[];
  evidenceList: EvidenceItem[];
  activeGlassesMode: boolean;
  onCollectEvidence: (evidenceId: string) => void;
  onOpenPuzzle: () => void;
  isPixelBWMode?: boolean;
}

export const CrimeSceneView: React.FC<CrimeSceneViewProps> = ({
  currentCase,
  hotspots,
  evidenceList,
  activeGlassesMode,
  onCollectEvidence,
  onOpenPuzzle,
  isPixelBWMode = true,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);

  const crimeSceneImage = getCrimeSceneImage(currentCase.id, currentCase.crimeSceneImage);

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setIsInspecting(true);
    conanAudio.playClueFound();

    // Context-sensitive Conan voice lines for each unique crime scene
    if (hotspot.id === 'HOTSPOT_BODY') {
      conanVoice.speak('CONAN', 'Nạn nhân là ông Tachibana Kenjiro! Khóe môi có bọt sủi nhỏ và mùi hạnh nhân... Đúng là ngộ độc Kali Xyanua rồi!');
    } else if (hotspot.id === 'HOTSPOT_CARAFE') {
      conanVoice.speak('CONAN', 'Bình rượu Brandy pha lê vỡ vụn trên sàn có mùi hạnh nhân nồng nặc của chất độc cực mạnh!');
    } else if (hotspot.id === 'HOTSPOT_DOOR_LATCH') {
      conanVoice.speak('CONAN', 'Lạ thật đấy... Tại sao trên then cài cửa bằng đồng lại có một vết xước ma sát kim loại rất nhỏ và sợi tơ li ti thế này?');
    } else if (hotspot.id === 'HOTSPOT_WINDOW_BALCONY') {
      conanVoice.speak('CONAN', 'Kính định vị phát hiện vết nước hình trụ đọng ngoài ban công... Đây chính là dấu vết của khối nước đá tan chảy!');
    } else if (hotspot.id === 'HOTSPOT_COAT_RACK') {
      conanVoice.speak('CONAN', 'Trong túi áo khoác của thư ký Tatsumi có chiếc bút máy mạ vàng... Khoan đã, nắp bút có vết bột trắng khả nghi!');
    } else if (hotspot.id === 'HOTSPOT_DESK_SAFE') {
      conanVoice.speak('CONAN', 'Sau bức tranh là một chiếc két sắt kỹ thuật số đang đếm ngược! Chúng ta phải nhanh chóng giải mật mã!');
    } else if (hotspot.id === 'HOTSPOT_BOMB_CASING') {
      conanVoice.speak('CONAN', 'Quả bom C4 đang đếm ngược tích tắc! Kíp nổ được nối với 4 sợi dây màu phức tạp... Mau tìm cách vô hiệu hóa ngòi nổ!');
    } else if (hotspot.id === 'HOTSPOT_CIPHER_NOTE') {
      conanVoice.speak('CONAN', 'Bức thư hoa hồng đen thách thức cảnh sát Tokyo! Bài thơ Haiku này ẩn chứa bí mật về màu sắc ngòi nổ!');
    } else if (hotspot.id === 'HOTSPOT_CLOCK_GEARS') {
      conanVoice.speak('CONAN', 'Bánh răng khổng lồ của tháp đang quay nhịp nhàng... Nhưng phía sau lại có một bộ thu sóng vô tuyến điều khiển từ xa!');
    } else if (hotspot.id === 'HOTSPOT_TOOLKIT') {
      conanVoice.speak('CONAN', 'Bộ kìm kỹ thuật bọc cao su chịu nhiệt dính vụn vỏ nhựa màu xanh lam... Đây là manh mối mang tính quyết định!');
    } else if (hotspot.id === 'HOTSPOT_MINAMOTO_BODY') {
      conanVoice.speak('CONAN', 'Bác Minamoto đã ngã gục ngay khi nhấp ngụm trà đầu tiên! Độc chất xyanua đã phát tác cực kỳ nhanh chóng!');
    } else if (hotspot.id === 'HOTSPOT_CHAWAN_CUP') {
      conanVoice.speak('CONAN', 'Dưới đáy chén trà gốm Raku có một lớp màng sáp ong mỏng trong suốt! Độc chất không nằm ở ấm trà chung mà được bọc sáp trong chén riêng!');
    } else if (hotspot.id === 'HOTSPOT_WIND_CHIME') {
      conanVoice.speak('CONAN', 'Chiếc chuông gió ngoài hiên phát ra tiếng kêu trầm đục lạ thường... Trong quả lắc có một viên hồng ngọc đỏ thẫm! Là Huyết Nguyệt!');
    } else if (hotspot.id === 'HOTSPOT_FUSE_BOX') {
      conanVoice.speak('CONAN', 'Bảng cầu chì bị ngắt bằng rơ-le kích hoạt sóng ngắn hồng ngoại! Hung thủ đã cố tình dập điện tạo bóng tối 30 giây!');
    } else if (hotspot.id === 'HOTSPOT_SHINDO_FAN') {
      conanVoice.speak('CONAN', 'Trong nan quạt của anh Shindo có giấu tờ giấy nợ cờ bạc 200 triệu Yên và đầu phát tín hiệu hồng ngoại siêu nhỏ!');
    } else {
      conanVoice.speak('CONAN', `Phát hiện điểm khả nghi: ${hotspot.title}. Hãy kiểm tra cẩn thận!`);
    }
  };

  const isPuzzleTriggerHotspot = (hotspotId: string) => {
    return hotspotId === 'HOTSPOT_DESK_SAFE' || hotspotId === 'HOTSPOT_BOMB_CASING';
  };

  const handleConfirmCollect = () => {
    if (!selectedHotspot) return;
    
    if (isPuzzleTriggerHotspot(selectedHotspot.id)) {
      setIsInspecting(false);
      onOpenPuzzle();
      return;
    }

    if (selectedHotspot.evidenceIdGranted) {
      onCollectEvidence(selectedHotspot.evidenceIdGranted);
      conanAudio.playEpiphany();
    }
    setIsInspecting(false);
  };

  const discoveredCount = hotspots.filter(h => {
    if (!h.evidenceIdGranted) return false;
    const ev = evidenceList.find(e => e.id === h.evidenceIdGranted);
    return ev && ev.collected;
  }).length;

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] bg-slate-950 p-2 sm:p-4 md:p-6 flex flex-col pb-28 lg:pb-8">
      {/* Top Banner / Case HUD */}
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg">
        <div className="flex-1 min-w-[200px]">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-red-400 font-mono font-bold tracking-wider">
            <span className="px-1.5 py-0.5 bg-red-950/60 border border-red-500/40 rounded">
              VỤ ÁN #{currentCase.caseNumber}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-none">{currentCase.crimeLocation}</span>
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
              {currentCase.timeOfDeath}
            </span>
          </div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide mt-1 flex items-center gap-2">
            <span>{currentCase.title}</span>
          </h1>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          {/* Quick Puzzle button */}
          <button
            onClick={onOpenPuzzle}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Mở giải đố khẩn cấp thời gian thực"
          >
            <Timer className="w-4 h-4 text-amber-400 animate-spin-slow shrink-0" />
            <span>Giải Đố <span className="hidden sm:inline">Thời Gian Thực</span></span>
          </button>

          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-[10px] sm:text-xs text-slate-400">Tiến độ</div>
              <div className="font-mono text-xs sm:text-sm font-bold text-red-400">
                {discoveredCount}/{hotspots.length}
              </div>
            </div>
            <div className="w-16 sm:w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${hotspots.length > 0 ? (discoveredCount / hotspots.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Crime Scene Interactive Canvas */}
      <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black min-h-[300px] sm:min-h-[440px] md:min-h-[520px] aspect-[4/3] sm:aspect-video md:aspect-auto select-none">
        {/* Crime scene background image */}
        <img
          src={crimeSceneImage}
          alt={`Hiện trường ${currentCase.title}`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            const fallback = currentCase.crimeSceneImage?.replace('/src/assets/', '/assets/') || '/assets/images/crime_scene_mansion_1792666677757.jpg';
            if (target.src !== fallback) {
              target.src = fallback;
            }
          }}
          className={`w-full h-full object-cover transition-all duration-700 select-none ${
            isPixelBWMode ? 'pixel-monochrome pixelated contrast-200 brightness-110' : ''
          } ${
            activeGlassesMode ? 'brightness-75 contrast-125 saturate-150 filter hue-rotate-15' : ''
          }`}
        />

        {/* Retro Pixel Scanlines Overlay for Monochrome Noir feel */}
        {isPixelBWMode && (
          <div className="absolute inset-0 pixel-scanlines pointer-events-none opacity-50 z-10" />
        )}

        {/* Ambient Darkened Gradient at edges for detective noir feel */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none mix-blend-multiply opacity-60" />

        {/* Luminol / Tracking Glasses Filter Overlay */}
        {activeGlassesMode && (
          <div className="absolute inset-0 bg-blue-950/30 mix-blend-screen pointer-events-none flex flex-col justify-between p-3 sm:p-4">
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-cyan-400 bg-slate-950/85 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-cyan-500/40 w-fit backdrop-blur-sm">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>KÍNH LUMINOL & CẢM BIẾN NHIỆT BẬT</span>
              </span>
            </div>
            <div className="text-right text-[10px] font-mono text-cyan-300 bg-slate-950/85 px-2.5 py-1 rounded border border-cyan-500/40 w-fit self-end backdrop-blur-sm">
              HIỂN THỊ DẤU VẾT HÓA CHẤT & BẰNG CHỨNG
            </div>
          </div>
        )}

        {/* Hotspot Markers (Touch Target: Min 44px x 44px) */}
        {hotspots.map((hotspot) => {
          const isCollected = hotspot.evidenceIdGranted
            ? evidenceList.find(e => e.id === hotspot.evidenceIdGranted)?.collected
            : false;

          return (
            <button
              key={hotspot.id}
              onClick={() => handleHotspotClick(hotspot)}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none cursor-pointer p-2 touch-manipulation"
              title={hotspot.title}
            >
              {/* Outer pulsing ring with 44px min touch hitbox */}
              <div
                className={`w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  isCollected
                    ? 'bg-emerald-500/40 border-2 border-emerald-400 shadow-md shadow-emerald-500/30'
                    : 'bg-red-600/60 border-2 border-red-500 shadow-lg shadow-red-600/80 animate-bounce'
                }`}
              >
                {isCollected ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-300" />
                ) : (
                  <Search className="w-5 h-5 sm:w-4 sm:h-4 text-white" />
                )}
              </div>

              {/* Tooltip on hover/focus */}
              <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 whitespace-nowrap px-2.5 py-1 bg-slate-900/95 text-[11px] text-white rounded-lg shadow-xl border border-slate-700 pointer-events-none z-30 backdrop-blur-sm">
                <div className="font-bold text-red-400">{hotspot.title}</div>
                <div className="text-[10px] text-slate-300">
                  {isCollected ? '✓ Đã thu thập' : 'Nhấp để khảo sát'}
                </div>
              </div>
            </button>
          );
        })}

        {/* Crime tape visual bar on bottom */}
        <div className="absolute bottom-0 inset-x-0 bg-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs tracking-widest py-1 sm:py-1.5 px-3 flex justify-between select-none opacity-90 shadow-md">
          <span>POLICE LINE</span>
          <span className="hidden sm:inline">SỞ CẢNH SÁT METROPOLITAN TOKYO - KHU VỰC PHONG TỎA</span>
          <span>KEEP OUT</span>
        </div>
      </div>

      {/* Inspection Modal */}
      {isInspecting && selectedHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-600/20 rounded-xl border border-red-500/30">
                  <Search className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedHotspot.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">Khảo sát chi tiết hiện trường</p>
                </div>
              </div>
              <button
                onClick={() => setIsInspecting(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg"
              >
                ✕
              </button>
            </div>

            <div className="my-5 p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedHotspot.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/30">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{selectedHotspot.promptToInspect}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmCollect}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-950/40 cursor-pointer"
              >
                {isPuzzleTriggerHotspot(selectedHotspot.id) ? (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Bắt Đầu Giải Mã Thời Gian Thực!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu Vào Sổ Tang Chứng</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setIsInspecting(false)}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
