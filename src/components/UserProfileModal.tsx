import React, { useState } from 'react';
import { 
  X, 
  User, 
  ShieldCheck, 
  Award, 
  Coins, 
  CheckCircle2, 
  Key, 
  Edit3, 
  Sparkles, 
  Sliders, 
  Zap, 
  Calendar,
  Lock,
  Unlock
} from 'lucide-react';
import { UserProfile } from '../types';
import { DETECTIVE_CHARACTERS } from '../data/charactersData';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  conanCoins: number;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAdminPanel: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  conanCoins,
  onUpdateProfile,
  onOpenAdminPanel,
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>(userProfile.username);
  const [adminCodeInput, setAdminCodeInput] = useState<string>('');
  const [codeFeedbackMsg, setCodeFeedbackMsg] = useState<{ isSuccess: boolean; msg: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveUsername = () => {
    if (usernameInput.trim()) {
      onUpdateProfile({ username: usernameInput.trim() });
      setIsEditingName(false);
      conanAudio.playClueFound();
    }
  };

  const handleVerifyAdminCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = adminCodeInput.trim().toLowerCase();
    
    if (cleanCode === 'adminpong' || cleanCode === 'pong đẹp trai') {
      onUpdateProfile({ isAdmin: true });
      setCodeFeedbackMsg({
        isSuccess: true,
        msg: '✓ XÁC NHẬN MẬT KHẨU ADMIN CHÍNH XÁC! QUYỀN ADMIN ĐÃ ĐƯỢC KÍCH HOẠT VĨNH VIỄN!',
      });
      conanAudio.playEpiphany();
      conanVoice.speak('CONAN', 'Chúc mừng! Quyền Admin đã được xác thực thành công!');
      setAdminCodeInput('');
      setTimeout(() => {
        onOpenAdminPanel();
      }, 1000);
    } else {
      conanAudio.playDramaticShock();
      setCodeFeedbackMsg({
        isSuccess: false,
        msg: '✗ MẬT KHẨU ADMIN KHÔNG CHÍNH XÁC. VUI LÒNG KIỂM TRA LẠI!',
      });
    }
  };

  const getRankBadgeColor = (casesSolved: number) => {
    if (casesSolved >= 3) return 'bg-purple-950/80 text-purple-300 border-purple-500';
    if (casesSolved >= 1) return 'bg-amber-950/80 text-amber-300 border-amber-500';
    return 'bg-blue-950/80 text-blue-300 border-blue-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/20 border border-red-500/40 rounded-2xl text-red-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold">
                HỒ SƠ TÀI KHOẢN THÁM TỬ · BEIKA DATA
              </div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Hồ Sơ & Thống Kê Cá Nhân
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Profile Card */}
          <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl border-2 border-red-500/80 overflow-hidden bg-slate-900 shadow-xl shrink-0">
                <img
                  src={userProfile.avatarUrl || DETECTIVE_CHARACTERS[0].avatarUrl}
                  alt={userProfile.username}
                  className="w-full h-full object-cover"
                />
              </div>
              {userProfile.isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-lg border border-amber-300" title="Tài Khoản Quyền Admin">
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="bg-slate-900 border border-red-500 text-white text-xs px-2.5 py-1 rounded-lg focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg"
                    >
                      Lưu
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-black text-white">{userProfile.username}</h3>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Đổi tên thám tử"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {userProfile.isAdmin && (
                  <span className="px-2.5 py-0.5 bg-amber-500/20 border border-amber-400/50 text-amber-300 font-mono text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-amber-400" /> ADMIN PONG
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`px-2.5 py-0.5 border text-xs font-extrabold rounded-lg ${getRankBadgeColor(userProfile.casesSolvedCount)}`}>
                  🏆 {userProfile.rankTitle}
                </span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Ngày tham gia: {userProfile.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Avatar Picker Presets */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Chọn Ảnh Đại Diện Thám Tử:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {DETECTIVE_CHARACTERS.map(char => (
                <button
                  key={char.id}
                  onClick={() => {
                    onUpdateProfile({ avatarUrl: char.avatarUrl });
                    conanAudio.playClueFound();
                  }}
                  className={`w-11 h-11 rounded-xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    userProfile.avatarUrl === char.avatarUrl
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105'
                      : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
                  }`}
                  title={`Dùng avatar ${char.name}`}
                >
                  <img src={char.avatarUrl} alt={char.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Gameplay Statistics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Số Xu Conan Hiện Có</span>
              </div>
              <div className="text-lg font-black text-amber-400 font-mono">
                🪙 {conanCoins} Xu
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Số Vụ Án Đã Phá Giải</span>
              </div>
              <div className="text-lg font-black text-purple-300 font-mono">
                📂 {userProfile.casesSolvedCount} Vụ Án
              </div>
            </div>
          </div>

          {/* Admin Rights Trigger & Panel Access */}
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Quyền Admin Quản Lý Hệ Thống
                </h4>
              </div>

              {userProfile.isAdmin ? (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> Đã Kích Hoạt Admin
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Yêu Cầu Mã Xác Thực
                </span>
              )}
            </div>

            {userProfile.isAdmin ? (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tài khoản của bạn đã được xác thực quyền Admin. Bạn có thể tự do điều chỉnh giá cả vật phẩm, giá nhân vật, nhạc nền và số lượng Xu Conan!
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminPanel();
                    }}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Sliders className="w-4 h-4" />
                    <span>MỞ BẢNG QUẢN TRỊ ADMIN</span>
                  </button>

                  <button
                    onClick={() => {
                      onUpdateProfile({ isAdmin: false });
                      conanAudio.playClueFound();
                    }}
                    className="px-4 py-2.5 bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-300 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    title="Đóng & Khóa lại quyền Admin"
                  >
                    <Lock className="w-4 h-4 text-red-400" />
                    <span>Đóng Quyền Admin</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifyAdminCode} className="space-y-3">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Nhập mật khẩu xác thực Admin để mở khóa toàn bộ công cụ quản trị:
                </p>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={adminCodeInput}
                    onChange={(e) => setAdminCodeInput(e.target.value)}
                    placeholder="Nhập mật khẩu Admin..."
                    className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 focus:border-amber-400 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    Kích Hoạt
                  </button>
                </div>

                {codeFeedbackMsg && (
                  <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    codeFeedbackMsg.isSuccess
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                      : 'bg-red-950/50 border-red-500/50 text-red-300'
                  }`}>
                    {codeFeedbackMsg.msg}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
