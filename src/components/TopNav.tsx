import React from 'react';
import { GameScreen } from '../types';
import { Compass, BookOpen, Users, MapPin, Sparkles, Volume2, VolumeX, Mic, MicOff, Music, Home, Lightbulb, ShoppingBag, FlaskConical } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

import { DetectiveCharacter } from '../data/charactersData';
import { UserCheck } from 'lucide-react';

interface TopNavProps {
  currentScreen: GameScreen;
  setScreen: (screen: GameScreen) => void;
  evidenceCount: number;
  totalEvidence: number;
  hintsRemaining?: number;
  conanCoins?: number;
  selectedCharacter?: DetectiveCharacter;
  onOpenCharacterSelectModal?: () => void;
  onOpenShopModal?: () => void;
  onOpenForensicsLab?: () => void;
  onOpenDeduction: () => void;
  onOpenMusicManager: () => void;
  onOpenCustomizerModal?: () => void;
  onOpenHintModal?: () => void;
  canDeduce: boolean;
  isPixelBWMode?: boolean;
  onTogglePixelBWMode?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentScreen,
  setScreen,
  evidenceCount,
  totalEvidence,
  hintsRemaining = 3,
  conanCoins = 200,
  selectedCharacter,
  onOpenCharacterSelectModal,
  onOpenShopModal,
  onOpenForensicsLab,
  onOpenDeduction,
  onOpenMusicManager,
  onOpenCustomizerModal,
  onOpenHintModal,
  canDeduce,
  isPixelBWMode = true,
  onTogglePixelBWMode,
}) => {
  const [isMuted, setIsMuted] = React.useState(conanAudio.getIsMuted());
  const [isVoiceOn, setIsVoiceOn] = React.useState(conanVoice.isEnabled());

  const handleToggleAudio = async () => {
    await conanAudio.resumeContext();
    const muted = conanAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      conanAudio.playBgm(conanAudio.getCurrentBgm() || 'THEME', true);
      conanAudio.playEpiphany();
    }
  };

  const handleToggleVoice = () => {
    const voiceOn = conanVoice.toggleVoice();
    setIsVoiceOn(voiceOn);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
        {/* Zone 1: Wordmark & Home trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentScreen !== 'TITLE' && (
            <button
              onClick={() => setScreen('TITLE')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-all text-xs font-bold shrink-0 border border-slate-700 active:scale-95 cursor-pointer"
              title="Trở về trang chủ chọn vụ án"
            >
              <Home className="w-4 h-4 text-red-400 group-hover:text-white" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </button>
          )}

          <div 
            onClick={() => setScreen('TITLE')}
            className="flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 group"
            title="Trở về màn hình chính"
          >
            <span className="font-serif font-black tracking-wider text-base sm:text-lg md:text-xl text-red-500 group-hover:text-red-400 transition-colors">
              THÁM TỬ CONAN
            </span>
            <span className="hidden md:inline text-xs font-semibold uppercase tracking-widest text-slate-400">
              Hồ Sơ Beika
            </span>
          </div>
        </div>

        {/* Zone 2: Desktop navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => setScreen('TITLE')}
            className={`flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              currentScreen === 'TITLE' ? 'text-red-400 border-b-2 border-red-500 font-semibold' : ''
            }`}
          >
            <Home className="w-4 h-4 text-red-400" />
            <span>Trang Chủ</span>
          </button>

          <button
            onClick={() => setScreen('CRIME_SCENE')}
            className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              currentScreen === 'CRIME_SCENE' ? 'text-red-400 border-b-2 border-red-500 font-semibold' : ''
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Hiện Trường</span>
          </button>

          <button
            onClick={() => setScreen('EVIDENCE')}
            className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              currentScreen === 'EVIDENCE' ? 'text-red-400 border-b-2 border-red-500 font-semibold' : ''
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Sổ Tang Chứng</span>
            <span className="text-xs text-slate-400 font-mono">
              {evidenceCount}/{totalEvidence}
            </span>
          </button>

          <button
            onClick={() => setScreen('SUSPECTS')}
            className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              currentScreen === 'SUSPECTS' ? 'text-red-400 border-b-2 border-red-500 font-semibold' : ''
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Hồ Sơ Nghi Can</span>
          </button>

          <button
            onClick={() => setScreen('MAP')}
            className={`flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 cursor-pointer ${
              currentScreen === 'MAP' ? 'text-red-400 border-b-2 border-red-500 font-semibold' : ''
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Bản Đồ Beika</span>
          </button>
        </nav>

        {/* Zone 3: Primary action & sound controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {onOpenCharacterSelectModal && (
            <button
              onClick={onOpenCharacterSelectModal}
              title="Cửa hàng & Chọn Nhân Vật Phá Án"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-[11px] sm:text-xs font-bold border border-slate-700 cursor-pointer shrink-0"
            >
              <UserCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="hidden sm:inline">{selectedCharacter?.name || 'Đổi Nhân Vật'}</span>
              <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/40 rounded text-[10px] font-mono">
                🪙 {conanCoins}
              </span>
            </button>
          )}

          {onOpenShopModal && (
            <button
              onClick={onOpenShopModal}
              title="Cửa Hàng Bảo Bối & Trang Bị Vật Phẩm Thám Tử"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900/90 text-amber-300 border border-amber-500/50 transition-all text-[11px] sm:text-xs font-bold cursor-pointer shrink-0 active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Cửa Hàng</span>
            </button>
          )}

          {onOpenForensicsLab && (
            <button
              onClick={onOpenForensicsLab}
              title="Phòng Giám Định Pháp Y ADN & Vân Tay Tiến Sĩ Agasa"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900/90 text-purple-300 border border-purple-500/50 transition-all text-[11px] sm:text-xs font-bold cursor-pointer shrink-0 active:scale-95"
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="hidden sm:inline">Pháp Y ADN</span>
            </button>
          )}

          {onOpenHintModal && (
            <button
              onClick={onOpenHintModal}
              title="Gợi ý từ Conan & Tiến sĩ Agasa (Tối đa 3 lượt)"
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg border text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                hintsRemaining > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 active:scale-95'
                  : 'bg-slate-800 text-slate-400 border-slate-700 opacity-80'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span>Gợi Ý ({hintsRemaining}/3)</span>
            </button>
          )}


          {onOpenCustomizerModal && (
            <button
              onClick={onOpenCustomizerModal}
              title="Tùy chỉnh số lượng vật chứng vụ án"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800 text-red-400 hover:text-white hover:bg-slate-700 transition-colors text-[11px] sm:text-xs font-semibold cursor-pointer border border-slate-700"
            >
              <span>⚙️ {totalEvidence} VC</span>
            </button>
          )}

          <button
            onClick={onOpenMusicManager}
            title="Đổi nhạc nền / Tải nhạc MP3"
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-[11px] sm:text-xs font-semibold cursor-pointer"
          >
            <Music className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Đổi Nhạc</span>
          </button>

          <button
            onClick={handleToggleAudio}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={handleToggleVoice}
            title={isVoiceOn ? 'Lồng tiếng đang bật' : 'Lồng tiếng đang tắt'}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isVoiceOn ? <Mic className="w-4 h-4 text-blue-400" /> : <MicOff className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={onOpenDeduction}
            disabled={!canDeduce}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              canDeduce
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/40 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{canDeduce ? 'Phá Án!' : 'Thu Thập'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Dock (Visible on Mobile & Tablet < lg) */}
      <nav aria-label="Điều hướng game" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/90 lg:hidden flex justify-around items-center py-1.5 px-2 text-slate-300 shadow-2xl">
        <button
          onClick={() => setScreen('TITLE')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentScreen === 'TITLE' ? 'text-red-400 bg-red-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Trang Chủ</span>
        </button>

        <button
          onClick={() => setScreen('CRIME_SCENE')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentScreen === 'CRIME_SCENE' ? 'text-red-400 bg-red-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Hiện Trường</span>
        </button>

        <button
          onClick={() => setScreen('EVIDENCE')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-bold transition-all relative cursor-pointer ${
            currentScreen === 'EVIDENCE' ? 'text-red-400 bg-red-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Bằng Chứng</span>
          {evidenceCount > 0 && (
            <span className="absolute top-0.5 right-2 px-1.5 py-0.2 bg-red-600 text-white font-mono text-[9px] rounded-full font-bold">
              {evidenceCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setScreen('SUSPECTS')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentScreen === 'SUSPECTS' ? 'text-red-400 bg-red-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Nghi Can</span>
        </button>

        <button
          onClick={() => setScreen('MAP')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
            currentScreen === 'MAP' ? 'text-red-400 bg-red-950/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span>Bản Đồ</span>
        </button>
      </nav>
    </>
  );
};
