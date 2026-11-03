import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Coins, 
  ShoppingBag, 
  UserCheck, 
  Music, 
  Zap, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Volume2,
  Wrench,
  Flame
} from 'lucide-react';
import { ShopItem, CustomItemPrices, UserProfile } from '../types';
import { SHOP_ITEMS } from '../data/shopData';
import { DETECTIVE_CHARACTERS, DetectiveCharacter } from '../data/charactersData';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface AdminControlPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  conanCoins: number;
  customPrices: CustomItemPrices;
  unlockedCharacterIds: string[];
  purchasedItemIds: string[];
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
  onUpdateCoins: (newAmount: number) => void;
  onUpdateCustomPriceItem: (itemId: string, newPrice: number) => void;
  onUpdateCustomPriceCharacter: (charId: string, newPrice: number) => void;
  onUnlockAllCharacters: () => void;
  onUnlockAllItems: () => void;
  onResetToDefaultPrices: () => void;
  onOpenMusicManager?: () => void;
}

export const AdminControlPanelModal: React.FC<AdminControlPanelModalProps> = ({
  isOpen,
  onClose,
  conanCoins,
  customPrices,
  unlockedCharacterIds,
  purchasedItemIds,
  onUpdateProfile,
  onUpdateCoins,
  onUpdateCustomPriceItem,
  onUpdateCustomPriceCharacter,
  onUnlockAllCharacters,
  onUnlockAllItems,
  onResetToDefaultPrices,
  onOpenMusicManager,
}) => {
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'CHARACTERS' | 'COINS' | 'MUSIC'>('ITEMS');
  const [addCoinsInput, setAddCoinsInput] = useState<string>('1000');
  const [customAudioGain, setCustomAudioGain] = useState<number>(100);
  const [saveToast, setSaveToast] = useState<string>('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleRevokeAdmin = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ isAdmin: false });
    }
    conanAudio.playClueFound();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 to-slate-950 border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-400">
              <ShieldCheck className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center gap-1">
                <span>⚡ BẢNG ĐIỀU KHIỂN QUYỀN ADMIN</span>
              </div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Trung Tâm Quản Trị Hệ Thống Game
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onUpdateProfile && (
              <button
                onClick={handleRevokeAdmin}
                className="px-3 py-1.5 bg-red-950/90 hover:bg-red-900 text-red-300 border border-red-500/60 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                title="Đóng & Khóa lại quyền Admin"
              >
                <span>🔒 Đóng Quyền Admin</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-amber-500/40 rounded-xl font-mono text-xs font-bold text-amber-300">
              🪙 {conanCoins} Xu
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none">
          {[
            { key: 'ITEMS', label: '🛍️ Giá Vật Phẩm Shop', icon: ShoppingBag },
            { key: 'CHARACTERS', label: '🕵️‍♂️ Giá Nhân Vật (Kaito Kid)', icon: UserCheck },
            { key: 'COINS', label: '🪙 Thêm Xu & Cheat Fast Unlock', icon: Coins },
            { key: 'MUSIC', label: '🎵 Âm Thanh & Nhạc Nền', icon: Music },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Save Toast Banner */}
        {saveToast && (
          <div className="bg-emerald-600 text-white font-bold text-xs p-2.5 text-center shadow-lg animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Main Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SHOP ITEM PRICES */}
          {activeTab === 'ITEMS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Chỉnh Sửa Giá Xu Toàn Bộ Vật Phẩm Trong Cửa Hàng
                  </h3>
                  <p className="text-xs text-slate-400">
                    Giá sửa đổi sẽ áp dụng ngay lập tức trong Cửa Hàng Bảo Bối.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onResetToDefaultPrices();
                    conanAudio.playEpiphany();
                    showToast('Đã khôi phục toàn bộ giá mặc định ban đầu!');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Gốc
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SHOP_ITEMS.map(item => {
                  const currentPrice = customPrices.shopItems[item.id] ?? item.price;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-amber-400 font-mono">
                          ⚡ {item.bonusDescription}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400 font-mono">🪙</span>
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                            onUpdateCustomPriceItem(item.id, val);
                          }}
                          className="w-20 bg-slate-900 border border-amber-500/50 text-amber-300 font-mono font-bold text-xs rounded-xl p-2 text-center focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => {
                            onUpdateCustomPriceItem(item.id, 0);
                            showToast(`Đã set miễn phí (0 Xu) cho "${item.name}"!`);
                          }}
                          className="px-2 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold rounded-lg hover:bg-emerald-900"
                          title="Đặt thành Miễn phí (0 Xu)"
                        >
                          Miễn Phí
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CHARACTER PRICES */}
          {activeTab === 'CHARACTERS' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Chỉnh Sửa Giá Xu Nhân Vật (Ví dụ: Kaito Kid = 500 Xu Conan)
                </h3>
                <p className="text-xs text-slate-400">
                  Điều chỉnh số Xu Conan cần thiết để mở khóa từng thám tử.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DETECTIVE_CHARACTERS.map(char => {
                  const currentPrice = customPrices.characters[char.id] ?? char.price;
                  return (
                    <div
                      key={char.id}
                      className={`p-3.5 bg-slate-950 border rounded-2xl flex items-center justify-between gap-3 ${
                        char.id === 'CHAR_KAITO_KID' ? 'border-sky-500/80 bg-sky-950/20' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={char.avatarUrl}
                          alt={char.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{char.name}</div>
                          <div className={`text-[10px] ${char.accentColor}`}>{char.title}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400 font-mono">🪙</span>
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) => {
                            const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                            onUpdateCustomPriceCharacter(char.id, val);
                          }}
                          className="w-20 bg-slate-900 border border-amber-500/50 text-amber-300 font-mono font-bold text-xs rounded-xl p-2 text-center focus:outline-none focus:border-amber-400"
                        />
                        {char.id === 'CHAR_KAITO_KID' && (
                          <button
                            onClick={() => {
                              onUpdateCustomPriceCharacter('CHAR_KAITO_KID', 500);
                              conanAudio.playEpiphany();
                              showToast('Đã set giá Kaito Kid = 500 Xu Conan!');
                            }}
                            className="px-2 py-1 bg-sky-950 border border-sky-500 text-sky-300 text-[10px] font-bold rounded-lg hover:bg-sky-900"
                          >
                            Set 500 Xu
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: COINS & UNLOCK TOOLS */}
          {activeTab === 'COINS' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  <span>Cộng Hoặc Tùy Chỉnh Số Xu Conan</span>
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    value={addCoinsInput}
                    onChange={(e) => setAddCoinsInput(e.target.value)}
                    placeholder="Nhập số Xu..."
                    className="bg-slate-900 border border-slate-800 text-white font-mono font-bold text-sm rounded-xl px-3 py-2.5 w-36 focus:border-amber-400 focus:outline-none"
                  />

                  <button
                    onClick={() => {
                      const amount = parseInt(addCoinsInput, 10) || 0;
                      onUpdateCoins(conanCoins + amount);
                      conanAudio.playEpiphany();
                      showToast(`Đã cộng thêm +${amount} Xu Conan!`);
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" /> Cộng Thêm Xu
                  </button>

                  <button
                    onClick={() => {
                      onUpdateCoins(999999);
                      conanAudio.playEpiphany();
                      conanVoice.speak('CONAN', 'Xu Conan đã được nạp tối đa 999,999 Xu!');
                      showToast('Đã nạp 999,999 Xu Conan Đại Phú Gia!');
                    }}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Flame className="w-4 h-4" /> Max 999,999 Xu
                  </button>
                </div>
              </div>

              {/* Fast Unlock Tools */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Công Cụ Mở Khóa Nhanh (Cheat Controls)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onUnlockAllCharacters();
                      conanAudio.playEpiphany();
                      showToast('Đã mở khóa toàn bộ nhân vật thám tử!');
                    }}
                    className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <UserCheck className="w-5 h-5 text-sky-400 shrink-0" />
                    <div className="text-left">
                      <div>Mở Khóa Toàn Bộ Nhân Vật</div>
                      <div className="text-[10px] text-slate-400 font-normal">Sở hữu Kaito Kid, Heiji, Shinichi, Amuro, Haibara...</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onUnlockAllItems();
                      conanAudio.playEpiphany();
                      showToast('Đã mở khóa toàn bộ vật phẩm trong Shop!');
                    }}
                    className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-3 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5 text-amber-400 shrink-0" />
                    <div className="text-left">
                      <div>Mở Khóa Toàn Bộ Vật Phẩm Shop</div>
                      <div className="text-[10px] text-slate-400 font-normal">Sở hữu APTX-4869, Kềm Titanium, Bút UV...</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MUSIC & AUDIO */}
          {activeTab === 'MUSIC' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Music className="w-5 h-5 text-indigo-400" />
                    <span>Cấu Hình Âm Thanh & Thay Đổi Nhạc Admin</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Chọn bản nhạc nền phá án hoặc tải lên tệp nhạc MP3 / URL cá nhân.
                  </p>
                </div>

                {onOpenMusicManager && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMusicManager();
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Music className="w-4 h-4" />
                    <span>Mở Trình Quản Lý Nhạc (MP3 / URL)</span>
                  </button>
                )}
              </div>

              {/* Preset Track Selector */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  🎵 Bản Nhạc Nền Presets Anime Conan Movie 29:
                </div>

                <div className="space-y-2">
                  {[
                    {
                      type: 'THEME' as const,
                      title: 'Main Theme Saxophone Jazz-Funk',
                      desc: 'Giai điệu phá án kèn saxophone huyền thoại',
                    },
                    {
                      type: 'SUSPENSE' as const,
                      title: 'Tokyo Suspense & Mystery Tension',
                      desc: 'Nhạc nền cello bí ẩn tại hiện trường vụ án',
                    },
                    {
                      type: 'DEDUCTION' as const,
                      title: 'Sleeping Kogoro Climax Fanfare',
                      desc: 'Khúc nhạc khải hoàn khi vạch trần thủ phạm',
                    },
                  ].map(track => (
                    <div
                      key={track.type}
                      onClick={() => {
                        conanAudio.playBgm(track.type, true);
                        showToast(`Đã chuyển nhạc nền sang: "${track.title}"`);
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        conanAudio.getCurrentBgm() === track.type
                          ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{track.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{track.desc}</div>
                      </div>
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                      Âm Lượng Master Audio Gain
                    </span>
                    <span className="font-mono font-bold text-indigo-400">{customAudioGain}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={customAudioGain}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCustomAudioGain(val);
                      conanAudio.setVolume(val / 100);
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            ⚡ Admin Privilege Active · 'pong đẹp trai'
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
          >
            Lưu & Thoát Bảng Admin
          </button>
        </div>
      </div>
    </div>
  );
};
