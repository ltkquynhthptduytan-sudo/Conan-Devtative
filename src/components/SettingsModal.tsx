import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  Key, 
  ShoppingBag, 
  Clock, 
  Coins, 
  UserCheck, 
  Music, 
  RotateCcw, 
  CheckCircle2, 
  Zap, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Lock, 
  Unlock,
  Sliders,
  Sparkles,
  Flame
} from 'lucide-react';
import { ShopItem, CustomItemPrices, UserProfile } from '../types';
import { SHOP_ITEMS } from '../data/shopData';
import { DETECTIVE_CHARACTERS } from '../data/charactersData';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  conanCoins: number;
  customPrices: CustomItemPrices;
  unlockedCharacterIds: string[];
  purchasedItemIds: string[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onUpdateCoins: (newAmount: number) => void;
  onUpdateCustomPriceItem: (itemId: string, newPrice: number) => void;
  onUpdateCustomPriceCharacter: (charId: string, newPrice: number) => void;
  onUpdateCustomItemBonusValue: (itemId: string, newBonusValue: number) => void;
  onUnlockAllCharacters: () => void;
  onUnlockAllItems: () => void;
  onResetToDefaultPrices: () => void;
  onOpenMusicManager?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  conanCoins,
  customPrices,
  unlockedCharacterIds,
  purchasedItemIds,
  onUpdateProfile,
  onUpdateCoins,
  onUpdateCustomPriceItem,
  onUpdateCustomPriceCharacter,
  onUpdateCustomItemBonusValue,
  onUnlockAllCharacters,
  onUnlockAllItems,
  onResetToDefaultPrices,
  onOpenMusicManager,
}) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SHOP_PRICES' | 'ITEM_TIMES' | 'CHARACTERS' | 'CHEATS' | 'MUSIC'>('GENERAL');
  const [adminPassInput, setAdminPassInput] = useState<string>('');
  const [passFeedback, setPassFeedback] = useState<{ isSuccess: boolean; msg: string } | null>(null);
  const [addCoinsInput, setAddCoinsInput] = useState<string>('1000');
  const [toastMsg, setToastMsg] = useState<string>('');

  const [isMuted, setIsMuted] = useState<boolean>(conanAudio.getIsMuted());
  const [isVoiceOn, setIsVoiceOn] = useState<boolean>(conanVoice.isEnabled());

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleVerifyPasscode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPass = adminPassInput.trim().toLowerCase();

    if (cleanPass === 'adminpong' || cleanPass === 'pong đẹp trai') {
      onUpdateProfile({ isAdmin: true });
      setPassFeedback({
        isSuccess: true,
        msg: '✓ XÁC NHẬN MẬT KHẨU ADMIN THÀNH CÔNG! QUYỀN ADMIN ĐÃ ĐƯỢC KÍCH HOẠT!',
      });
      conanAudio.playEpiphany();
      conanVoice.speak('CONAN', 'Mật khẩu Admin chính xác! Bảng quản trị Admin đã được mở khóa!');
      setAdminPassInput('');
      setActiveTab('SHOP_PRICES');
    } else {
      conanAudio.playDramaticShock();
      setPassFeedback({
        isSuccess: false,
        msg: '✗ MẬT KHẨU KHÔNG CHÍNH XÁC. VUI LÒNG KIỂM TRA LẠI!',
      });
    }
  };

  const handleToggleMute = () => {
    const muted = conanAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleVoice = () => {
    const voiceOn = conanVoice.toggleVoice();
    setIsVoiceOn(voiceOn);
  };

  const handleRevokeAdmin = () => {
    onUpdateProfile({ isAdmin: false });
    setActiveTab('GENERAL');
    conanAudio.playClueFound();
    showToast('Đã đóng quyền Admin thành công! Hệ thống đã được khóa lại.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-amber-950/60 to-slate-950 border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 border border-amber-500/50 rounded-2xl text-amber-400">
              <Settings className="w-7 h-7 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center gap-1">
                <span>⚙️ CÀI ĐẶT GAME & QUẢN TRỊ SYSTEM</span>
                {userProfile.isAdmin && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-500/30 text-amber-300 rounded text-[9px] border border-amber-400/50">
                    ADMIN ACTIVE
                  </span>
                )}
              </div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Bảng Cài Đặt & Quyền Admin
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userProfile.isAdmin && (
              <button
                onClick={handleRevokeAdmin}
                className="px-3 py-1.5 bg-red-950/90 hover:bg-red-900 text-red-300 border border-red-500/60 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                title="Đóng & Thoát quyền Admin"
              >
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Đóng Quyền Admin</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-amber-500/40 rounded-xl font-mono text-xs font-bold text-amber-300">
              🪙 {conanCoins} Xu
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('GENERAL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'GENERAL'
                ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>⚙️ Cài Đặt Chung</span>
          </button>

          {userProfile.isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('SHOP_PRICES')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'SHOP_PRICES'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'bg-slate-900 text-amber-300 hover:text-white border border-amber-500/40'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>🛍️ Giá Cửa Hàng</span>
              </button>

              <button
                onClick={() => setActiveTab('ITEM_TIMES')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'ITEM_TIMES'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'bg-slate-900 text-amber-300 hover:text-white border border-amber-500/40'
                }`}
              >
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>⏱️ Thời Gian Vật Phẩm</span>
              </button>

              <button
                onClick={() => setActiveTab('CHARACTERS')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'CHARACTERS'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'bg-slate-900 text-sky-300 hover:text-white border border-sky-500/40'
                }`}
              >
                <UserCheck className="w-4 h-4 text-sky-400" />
                <span>🕵️‍♂️ Giá Nhân Vật (Kaito Kid)</span>
              </button>

              <button
                onClick={() => setActiveTab('CHEATS')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'CHEATS'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'bg-slate-900 text-purple-300 hover:text-white border border-purple-500/40'
                }`}
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span>🪙 Nạp Xu & Cheat Unlock</span>
              </button>

              <button
                onClick={() => setActiveTab('MUSIC')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'MUSIC'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'bg-slate-900 text-indigo-300 hover:text-white border border-indigo-500/40'
                }`}
              >
                <Music className="w-4 h-4 text-indigo-400" />
                <span>🎵 Đổi Nhạc Game (Admin)</span>
              </button>
            </>
          ) : (
            <div className="px-3 py-2 text-xs text-amber-400 font-mono flex items-center gap-1 border border-amber-500/30 rounded-xl bg-amber-950/20">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Nhập Mật Khẩu Admin Để Mở Quyền Admin</span>
            </div>
          )}
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white font-bold text-xs p-2.5 text-center shadow-lg animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: GENERAL SETTINGS & ADMIN PASSCODE VERIFICATION */}
          {activeTab === 'GENERAL' && (
            <div className="space-y-5">
              {/* Audio Controls */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Cài Đặt Âm Thanh & Lồng Tiếng</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleToggleMute}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      isMuted
                        ? 'bg-red-950/40 border-red-500/50 text-red-300'
                        : 'bg-slate-900 border-slate-700 text-emerald-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      <span>Âm Nhạc & SFX</span>
                    </div>
                    <span>{isMuted ? 'ĐÃ TẮT' : 'ĐANG BẬT'}</span>
                  </button>

                  <button
                    onClick={handleToggleVoice}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                      !isVoiceOn
                        ? 'bg-slate-950 border-slate-800 text-slate-500'
                        : 'bg-slate-900 border-slate-700 text-sky-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isVoiceOn ? <Mic className="w-4 h-4 text-sky-400" /> : <MicOff className="w-4 h-4 text-slate-500" />}
                      <span>Lồng Tiếng Nhân Vật</span>
                    </div>
                    <span>{isVoiceOn ? 'ĐANG BẬT' : 'ĐÃ TẮT'}</span>
                  </button>
                </div>
              </div>

              {/* Admin Passcode Login Card */}
              <div className="p-5 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/60 rounded-2xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-amber-300 uppercase tracking-widest">
                        KÍCH HOẠT QUYỀN ADMIN
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Nhập mật khẩu Admin bảo mật để mở khóa công cụ chỉnh sửa giá cửa hàng & thời gian vật phẩm
                      </p>
                    </div>
                  </div>

                  {userProfile.isAdmin ? (
                    <span className="px-3 py-1 bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5">
                      <Unlock className="w-3.5 h-3.5" /> ĐÃ MỞ QUYỀN ADMIN
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-500 font-bold text-xs rounded-xl flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> CHƯA MỞ
                    </span>
                  )}
                </div>

                {userProfile.isAdmin ? (
                  <div className="p-3 bg-slate-900/80 border border-amber-500/30 rounded-xl space-y-2">
                    <p className="text-xs text-amber-200 font-medium">
                      ✓ Tài khoản của bạn đã được xác thực quyền Admin! Bạn có thể chuyển sang các tab bên trên để chỉnh sửa giá cửa hàng, thời gian vật phẩm, giá nhân vật Kaito Kid và cộng Xu Conan!
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => setActiveTab('SHOP_PRICES')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                      >
                        🛍️ Chỉnh Giá Cửa Hàng
                      </button>
                      <button
                        onClick={() => setActiveTab('ITEM_TIMES')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        ⏱️ Chỉnh Thời Gian Vật Phẩm
                      </button>
                      <button
                        onClick={handleRevokeAdmin}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 shadow-md"
                      >
                        <Lock className="w-3.5 h-3.5" /> Đóng Quyền Admin
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyPasscode} className="space-y-3 pt-1">
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={adminPassInput}
                        onChange={(e) => setAdminPassInput(e.target.value)}
                        placeholder="Nhập mật khẩu Admin..."
                        className="flex-1 bg-slate-900 border border-amber-500/50 text-white font-mono text-xs rounded-xl px-3.5 py-2.5 focus:border-amber-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md active:scale-95"
                      >
                        Kích Hoạt Admin
                      </button>
                    </div>

                    {passFeedback && (
                      <div className={`p-3 rounded-xl border text-xs leading-relaxed font-semibold ${
                        passFeedback.isSuccess
                          ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                          : 'bg-red-950/60 border-red-500/60 text-red-300'
                      }`}>
                        {passFeedback.msg}
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SHOP ITEM PRICES EDITING */}
          {activeTab === 'SHOP_PRICES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Chỉnh Sửa Giá Xu Toàn Bộ Vật Phẩm Cửa Hàng
                  </h3>
                  <p className="text-xs text-slate-400">
                    Thay đổi số Xu Conan cần thiết để mua từng bảo bối trong Cửa Hàng.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onResetToDefaultPrices();
                    conanAudio.playEpiphany();
                    showToast('Đã khôi phục toàn bộ giá cửa hàng gốc!');
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
                          className="px-2 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold rounded-lg hover:bg-emerald-900 cursor-pointer"
                        >
                          0 Xu
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ITEM BONUS TIME & METRIC EDITING */}
          {activeTab === 'ITEM_TIMES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Thay Đổi Thời Gian & Chỉ Số Vật Phẩm Gỡ Bom</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Chỉnh sửa số giây cộng thêm khi gỡ bom/giải câu đố cho từng bảo bối (Ví dụ: +0.5s, +2s, +5s, +10s).
                  </p>
                </div>

                <button
                  onClick={() => {
                    onResetToDefaultPrices();
                    conanAudio.playEpiphany();
                    showToast('Đã khôi phục thời gian cộng mặc định của các vật phẩm!');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Gốc
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SHOP_ITEMS.map(item => {
                  const currentBonusValue = customPrices.itemBonusValues?.[item.id] ?? item.bonusValue;

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <span className="px-2 py-0.5 bg-slate-900 text-slate-400 font-mono text-[10px] rounded border border-slate-800">
                          Mặc định: +{item.bonusValue}s
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="text-[11px] text-emerald-300 font-mono flex items-center gap-1">
                          ⚡ Thời gian cộng:
                          <strong className="text-amber-300 font-bold">+{currentBonusValue} giây</strong>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="60"
                            value={currentBonusValue}
                            onChange={(e) => {
                              const val = Math.max(0, parseFloat(e.target.value) || 0);
                              onUpdateCustomItemBonusValue(item.id, val);
                            }}
                            className="w-20 bg-slate-900 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs rounded-xl p-1.5 text-center focus:outline-none focus:border-emerald-400"
                          />
                          <span className="text-xs text-slate-400">giây</span>
                        </div>
                      </div>

                      {/* Quick preset buttons */}
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
                        {[0.5, 1.0, 2.0, 5.0, 10.0].map(val => (
                          <button
                            key={val}
                            onClick={() => {
                              onUpdateCustomItemBonusValue(item.id, val);
                              showToast(`Đã chỉnh "${item.name}" thành +${val}s thời gian!`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                              currentBonusValue === val
                                ? 'bg-emerald-600 text-white border-emerald-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            +{val}s
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CHARACTER PRICES EDITING */}
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
                            className="px-2.5 py-1 bg-sky-950 border border-sky-500 text-sky-300 text-[10px] font-bold rounded-lg hover:bg-sky-900 cursor-pointer"
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

          {/* TAB 5: CHEATS & COINS */}
          {activeTab === 'CHEATS' && (
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

          {/* TAB 6: MUSIC & AUDIO MANAGEMENT FOR ADMIN */}
          {activeTab === 'MUSIC' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-950 border border-indigo-500/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                      <Music className="w-5 h-5 text-indigo-400" />
                      <span>THAY ĐỔI NHẠC NỀN GAME (ADMIN CONTROL)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Đổi bản nhạc nền phát trong game hoặc mở trình tải tệp nhạc MP3 / URL theo ý muốn
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
              </div>

              {/* Preset Track Selector */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  🎵 Chọn Bản Nhạc Presets Conan Movie 29:
                </div>

                <div className="space-y-2">
                  {[
                    {
                      type: 'THEME' as const,
                      title: 'Main Theme Saxophone Jazz-Funk',
                      desc: 'Bản nhạc nền phá án kinh điển đầy sôi động',
                    },
                    {
                      type: 'SUSPENSE' as const,
                      title: 'Tokyo Suspense & Mystery Tension',
                      desc: 'Bản nhạc điều tra hiện trường vụ án kịch tính',
                    },
                    {
                      type: 'DEDUCTION' as const,
                      title: 'Sleeping Kogoro Climax Fanfare',
                      desc: 'Bản nhạc khải hoàn khi Conan bắn kim gây mê vạch trần thủ phạm',
                    },
                  ].map(track => (
                    <div
                      key={track.type}
                      onClick={() => {
                        conanAudio.playBgm(track.type, true);
                        showToast(`Đã đổi sang bản nhạc: "${track.title}"`);
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {userProfile.isAdmin ? '⚡ Quyền Admin Hoạt Động' : '⚙️ Cài Đặt Game Beika'}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
          >
            Lưu & Đóng Bảng Cài Đặt
          </button>
        </div>
      </div>
    </div>
  );
};
