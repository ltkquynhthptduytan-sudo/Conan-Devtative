import React from 'react';
import { CaseData, DifficultyLevel } from '../types';
import { Play, Shield, Compass, BookOpen, Volume2, Sparkles, Music, Flame, Zap } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';
import { GAME_IMAGES } from '../assets/images';

interface TitleScreenProps {
  cases: CaseData[];
  selectedCase: CaseData;
  onSelectCase: (c: CaseData) => void;
  onStartGame: () => void;
  onOpenMusicManager: () => void;
  difficulty: DifficultyLevel;
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  isPixelBWMode?: boolean;
  customEvidenceCounts: Record<string, number>;
  onUpdateCustomCount: (caseId: string, count: number) => void;
  onOpenCustomizerModal: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  cases,
  selectedCase,
  onSelectCase,
  onStartGame,
  onOpenMusicManager,
  difficulty,
  onSelectDifficulty,
  isPixelBWMode = true,
  customEvidenceCounts,
  onUpdateCustomCount,
  onOpenCustomizerModal,
}) => {
  const heroImage = GAME_IMAGES.hero || '/assets/images/conan_deduction_hero_1792666677871.jpg';
  const selectedCaseCustomCount = customEvidenceCounts[selectedCase.id] ?? selectedCase.evidence.length;

  const handleStart = () => {
    conanAudio.playEpiphany();
    conanAudio.playBgm('THEME');
    const introMsg = difficulty === 'EASY'
      ? `Chế độ Tập Sự (${selectedCaseCustomCount} vật chứng)! Chân tướng sự thật chỉ có một!`
      : `Chế độ Thám Tử Kudo (${selectedCaseCustomCount} vật chứng)! Hãy cẩn trọng từng lập luận!`;
    conanVoice.speak('CONAN', introMsg);
    onStartGame();
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full bg-slate-950 flex flex-col justify-between overflow-hidden pb-28 lg:pb-12">
      {/* Background Hero Visual */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Edogawa Conan Thám Tử Lừng Danh"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== '/assets/images/conan_deduction_hero_1792666677871.jpg') {
              target.src = '/assets/images/conan_deduction_hero_1792666677871.jpg';
            }
          }}
          className={`w-full h-full object-cover object-center ${
            isPixelBWMode ? 'pixel-monochrome pixelated opacity-50 contrast-200' : 'opacity-40 mix-blend-screen'
          }`}
        />
        {isPixelBWMode && (
          <div className="absolute inset-0 pixel-scanlines pointer-events-none opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center items-center text-center">
        {/* Subtitle / Franchise kicker */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-red-500 uppercase mb-2 sm:mb-3">
          <span>DETECTIVE CONAN</span>
          <span>·</span>
          <span>BEIKA CRIME FILES</span>
          <span>·</span>
          <span>SỰ THẬT CHỈ CÓ MỘT</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white uppercase font-serif drop-shadow-2xl">
          THÁM TỬ CONAN
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 sm:mt-3 leading-relaxed font-sans px-2">
          Hóa thân thành <span className="text-red-400 font-semibold">Edogawa Conan</span>, bước vào hiện trường án mạng, sử dụng bảo bối Agasa, thẩm vấn nghi can và vạch trần chân tướng sự thật!
        </p>

        {/* Features Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-4 sm:my-6 max-w-3xl w-full text-left">
          <div className="p-2.5 sm:p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800">
            <Compass className="w-4 h-4 text-red-400 mb-1" />
            <div className="text-xs font-bold text-white">Khảo Sát 2D</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Tương tác hiện trường</div>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800">
            <Volume2 className="w-4 h-4 text-blue-400 mb-1" />
            <div className="text-xs font-bold text-white">Lồng Tiếng</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Giọng từng nhân vật</div>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800">
            <BookOpen className="w-4 h-4 text-emerald-400 mb-1" />
            <div className="text-xs font-bold text-white">Bằng Chứng</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Bác bỏ ngụy biện</div>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-800">
            <Shield className="w-4 h-4 text-amber-400 mb-1" />
            <div className="text-xs font-bold text-white">Bảo Bối Agasa</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Nơ đổi giọng & kính</div>
          </div>
        </div>

        {/* Case Selection Cards (3 Cases) */}
        <div className="w-full max-w-4xl text-left space-y-2.5 mb-5 sm:mb-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>1. Chọn Vụ Án Muốn Phá:</span>
            <span className="text-red-400">3 Vụ án hóc búa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
            {cases.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCase(c);
                    conanAudio.playClueFound();
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between active:scale-98 ${
                    isSelected
                      ? 'bg-red-950/40 border-red-500 shadow-xl shadow-red-950/40 ring-1 ring-red-500'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-red-400 mb-1">
                      <span>VỤ ÁN #{c.caseNumber}</span>
                      <span>{c.evidence.length} Vật chứng</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1.5 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {c.synopsis}
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                    📍 {c.crimeLocation.slice(0, 28)}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Level Selector */}
        <div className="w-full max-w-3xl text-left space-y-2 mb-6 sm:mb-8 bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>2. Chọn Mức Độ Thử Thách:</span>
            <span className="text-amber-400 font-bold text-[11px] sm:text-xs">
              {difficulty === 'EASY' ? 'Dễ (Thám Tử Tập Sự)' : 'Khó (Kudo Shinichi)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {/* Easy mode */}
            <button
              onClick={() => {
                onSelectDifficulty('EASY');
                conanAudio.playEpiphany();
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer active:scale-98 ${
                difficulty === 'EASY'
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap className={`w-4 h-4 ${difficulty === 'EASY' ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-white">MỨC ĐỘ DỄ (TẬP SỰ)</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed">
                • Vật chứng trọng tâm sẵn sàng.<br />
                • Cảm xúc nghi can hiển thị rõ.<br />
                • 60s giải đố mật mã.
              </p>
            </button>

            {/* Hard mode */}
            <button
              onClick={() => {
                onSelectDifficulty('HARD');
                conanAudio.playDramaticShock();
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer active:scale-98 ${
                difficulty === 'HARD'
                  ? 'bg-red-950/40 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame className={`w-4 h-4 ${difficulty === 'HARD' ? 'text-red-500' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-white">MỨC ĐỘ KHÓ (THÁM TỬ KUDO)</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed">
                • Manh mối gây nhiễu phức tạp.<br />
                • Nghi can "Poker Face" lạnh lùng.<br />
                • 40s giải đố mật mã gấp gáp.
              </p>
            </button>
          </div>
        </div>

        {/* Section 3: Evidence Count Customizer */}
        <div className="w-full max-w-3xl text-left space-y-2 mb-6 sm:mb-8 bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>3. Tùy Chỉnh Số Lượng Vật Chứng Cho Vụ Án:</span>
            <span className="text-red-400 font-bold font-mono text-xs">
              {selectedCaseCustomCount} / {selectedCase.evidence.length} Vật chứng
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">{selectedCase.title}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Thay đổi số lượng manh mối xuất hiện ở hiện trường (từ 2 đến {selectedCase.evidence.length} vật chứng).
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <button
                onClick={() => onUpdateCustomCount(selectedCase.id, Math.min(3, selectedCase.evidence.length))}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                  selectedCaseCustomCount === Math.min(3, selectedCase.evidence.length)
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                3 Nhanh
              </button>

              <button
                onClick={() => onUpdateCustomCount(selectedCase.id, Math.min(5, selectedCase.evidence.length))}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                  selectedCaseCustomCount === Math.min(5, selectedCase.evidence.length)
                    ? 'bg-amber-950 border-amber-500 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                5 Vừa
              </button>

              <button
                onClick={() => onUpdateCustomCount(selectedCase.id, selectedCase.evidence.length)}
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                  selectedCaseCustomCount === selectedCase.evidence.length
                    ? 'bg-red-950 border-red-500 text-red-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tối đa ({selectedCase.evidence.length})
              </button>

              <button
                onClick={onOpenCustomizerModal}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Tùy chỉnh chi tiết...
              </button>
            </div>
          </div>
        </div>

        {/* Audio Quick Play & Start Button Row */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenMusicManager}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-red-500 text-slate-200 hover:text-white font-bold text-xs rounded-xl shadow-xl transition-all cursor-pointer active:scale-95"
          >
            <Music className="w-4 h-4 text-red-400" />
            <span>Tải / Thay Nhạc Khác</span>
          </button>

          <button
            onClick={async () => {
              await conanAudio.resumeContext();
              conanAudio.playBgm('THEME', true);
              conanAudio.playEpiphany();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-slate-900/90 hover:bg-slate-800 border border-red-500/50 text-red-400 hover:text-white font-bold text-xs rounded-xl shadow-xl transition-all cursor-pointer active:scale-95"
          >
            <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Phát Nhạc Movie 29</span>
          </button>

          <button
            onClick={handleStart}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-2xl shadow-red-900/60 transition-all uppercase tracking-wider active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Bắt Đầu Phá Án ({difficulty === 'EASY' ? 'Dễ' : 'Khó'})</span>
          </button>
        </div>
      </div>

      {/* Footer Quote */}
      <footer className="relative z-10 py-3 px-4 border-t border-slate-800/80 bg-slate-950/80 text-center text-[11px] text-slate-500 font-mono">
        "Shinjitsu wa itsumo hitotsu!" — Chân tướng sự thật luôn chỉ có một!
      </footer>
    </div>
  );
};
