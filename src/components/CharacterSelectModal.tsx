import React from 'react';
import { DETECTIVE_CHARACTERS, DetectiveCharacter } from '../data/charactersData';
import { UserCheck, X, Zap, Shield, Sparkles, CheckCircle2, Lock, Coins } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface CharacterSelectModalProps {
  selectedCharacter: DetectiveCharacter;
  conanCoins: number;
  unlockedCharacterIds: string[];
  onSelectCharacter: (char: DetectiveCharacter) => void;
  onUnlockCharacter: (char: DetectiveCharacter) => void;
  onClose: () => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  selectedCharacter,
  conanCoins,
  unlockedCharacterIds,
  onSelectCharacter,
  onUnlockCharacter,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-red-500/60 rounded-3xl shadow-2xl p-4 sm:p-6 text-slate-100 flex flex-col gap-4 max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Coin Balance */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 pr-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/20 border border-red-500/40 rounded-2xl text-red-400 shrink-0">
              <UserCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                CỬA HÀNG NHÂN VẬT PHÁ ÁN
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Dùng Xu Conan kiếm được sau mỗi vụ án để mở khóa nhân vật mới
              </p>
            </div>
          </div>

          {/* Conan Coins Balance Badge */}
          <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-500/50 px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold text-amber-300 shadow-md">
            <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{conanCoins} Xu Conan</span>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
          {DETECTIVE_CHARACTERS.map((char) => {
            const isSelected = selectedCharacter.id === char.id;
            const isUnlocked = unlockedCharacterIds.includes(char.id) || char.price === 0;
            const canAfford = conanCoins >= char.price;

            return (
              <div
                key={char.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectCharacter(char);
                    conanAudio.playEpiphany();
                    conanVoice.speak('CONAN', `Đã chọn nhân vật phá án ${char.name}!`);
                  }
                }}
                className={`group relative p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between active:scale-[0.98] ${
                  isSelected
                    ? 'bg-red-950/50 border-red-500 shadow-xl shadow-red-950/50 ring-2 ring-red-500'
                    : isUnlocked
                    ? 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 cursor-pointer'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-90'
                }`}
              >
                {/* Active or Locked Badge */}
                <div className="absolute top-3 right-3">
                  {isSelected ? (
                    <div className="px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>ĐANG CHỌN</span>
                    </div>
                  ) : !isUnlocked ? (
                    <div className="px-2.5 py-0.5 bg-slate-950 border border-amber-500/40 text-amber-400 font-mono font-bold text-[10px] rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>{char.price} Xu</span>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl border-2 ${char.borderColor} overflow-hidden bg-slate-950 shrink-0 flex items-center justify-center font-bold text-sm text-slate-300 shadow-md relative`}>
                      <img
                        src={char.avatarUrl}
                        alt={char.name}
                        className={`w-full h-full object-cover ${!isUnlocked ? 'grayscale brightness-75' : ''}`}
                        onError={(e) => {
                          e.currentTarget.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${char.avatarSeed}`;
                        }}
                      />
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                          <Lock className="w-5 h-5 text-amber-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white leading-tight">
                        {char.name}
                      </h3>
                      <p className={`text-[11px] font-semibold ${char.accentColor}`}>
                        {char.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] italic text-slate-400 bg-slate-900/80 p-2 rounded-xl border border-slate-800 line-clamp-2">
                    "{char.quote}"
                  </p>
                </div>

                {/* Special Ability Box & Unlock Trigger */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{char.bonusTitle}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-normal">
                    {char.bonusDesc}
                  </p>

                  {!isUnlocked && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canAfford) {
                          onUnlockCharacter(char);
                          conanAudio.playEpiphany();
                          conanVoice.speak('CONAN', `Chúc mừng! Bạn đã mở khóa thành công nhân vật ${char.name}!`);
                        } else {
                          conanAudio.playDramaticShock();
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>
                        {canAfford ? `Mở Khóa (${char.price} Xu Conan)` : `Thiếu ${char.price - conanCoins} Xu (Cần ${char.price} Xu)`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Summary Footer & Confirm Button */}
        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300 text-center sm:text-left">
            Đang đóng vai: <strong className="text-red-400 font-bold">{selectedCharacter.name}</strong> ({selectedCharacter.title})
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-colors uppercase tracking-wider"
          >
            Đóng Cửa Hàng
          </button>
        </div>
      </div>
    </div>
  );
};
