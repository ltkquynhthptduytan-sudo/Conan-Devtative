import React, { useState, useRef } from 'react';
import { customMusic, TrackItem } from '../audio/customMusicManager';
import { conanAudio } from '../audio/conanSoundEngine';
import { 
  Upload, 
  Music, 
  Link as LinkIcon, 
  Play, 
  Pause, 
  Volume2, 
  Repeat, 
  X, 
  CheckCircle2, 
  Sparkles,
  Disc,
  Radio
} from 'lucide-react';

interface MusicManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicManagerModal: React.FC<MusicManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'UPLOAD' | 'URL' | 'PRESETS'>('UPLOAD');
  const [urlInput, setUrlInput] = useState<string>('');
  const [urlTitle, setUrlTitle] = useState<string>('');
  const [uploadedTracks, setUploadedTracks] = useState<TrackItem[]>(customMusic.getUserTracks());
  const [activeTrack, setActiveTrack] = useState<TrackItem | null>(customMusic.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(customMusic.getIsPlaying());
  const [isLoop, setIsLoop] = useState<boolean>(customMusic.isLoopEnabled());
  const [volume, setVolume] = useState<number>(customMusic.getVolume());
  const [audioMode, setAudioMode] = useState<'CUSTOM' | 'SYNTH'>(
    customMusic.getCurrentTrack() ? 'CUSTOM' : 'SYNTH'
  );
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const newTrack = customMusic.addUploadedFile(file);
      setUploadedTracks([...customMusic.getUserTracks()]);
      conanAudio.stopBgm();
      customMusic.playCustomTrack(newTrack);
      setActiveTrack(newTrack);
      setIsPlaying(true);
      setAudioMode('CUSTOM');
      setUploadSuccessMsg(`Đã tải thành công: "${file.name}" và đang phát!`);
      setTimeout(() => setUploadSuccessMsg(''), 4000);
    }
  };

  const handlePlayUrl = () => {
    if (!urlInput.trim()) return;
    const newTrack = customMusic.addUrlTrack(urlInput.trim(), urlTitle.trim() || undefined);
    setUploadedTracks([...customMusic.getUserTracks()]);
    conanAudio.stopBgm();
    customMusic.playCustomTrack(newTrack);
    setActiveTrack(newTrack);
    setIsPlaying(true);
    setAudioMode('CUSTOM');
    setUrlInput('');
    setUrlTitle('');
    setUploadSuccessMsg('Đang phát nhạc từ đường dẫn URL!');
    setTimeout(() => setUploadSuccessMsg(''), 4000);
  };

  const handleSelectTrack = (track: TrackItem) => {
    conanAudio.stopBgm();
    customMusic.playCustomTrack(track);
    setActiveTrack(track);
    setIsPlaying(true);
    setAudioMode('CUSTOM');
  };

  const handleSelectPresetSynth = (type: 'THEME' | 'SUSPENSE' | 'DEDUCTION') => {
    customMusic.stop();
    setActiveTrack(null);
    conanAudio.playBgm(type, true);
    setIsPlaying(true);
    setAudioMode('SYNTH');
  };

  const handleTogglePlayPause = () => {
    if (audioMode === 'CUSTOM') {
      if (isPlaying) {
        customMusic.pause();
        setIsPlaying(false);
      } else {
        if (activeTrack) {
          customMusic.play();
          setIsPlaying(true);
        }
      }
    } else {
      if (isPlaying) {
        conanAudio.stopBgm();
        setIsPlaying(false);
      } else {
        conanAudio.playBgm('THEME', true);
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    customMusic.setVolume(val);
    conanAudio.setVolume(val);
  };

  const handleToggleLoop = () => {
    const loop = customMusic.toggleLoop();
    setIsLoop(loop);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/20 rounded-xl border border-red-500/30 text-red-400">
              <Disc className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">
                Thay Đổi Nhạc Nền Game (Conan BGM)
              </h2>
              <p className="text-xs text-slate-400">
                Tải lên bài hát yêu thích (MP3/WAV) hoặc dán link nhạc theo ý muốn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Playing Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30 shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                ĐANG PHÁT {audioMode === 'CUSTOM' ? '· NHẠC TÙY CHỌN' : '· BẢN NHẠC GỐC'}
              </div>
              <div className="text-sm font-bold text-white truncate">
                {audioMode === 'CUSTOM' && activeTrack
                  ? activeTrack.title
                  : audioMode === 'SYNTH'
                  ? 'Bản Nhạc Movie 29 (Web Audio Orchestra)'
                  : 'Chưa có bài hát nào'}
              </div>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTogglePlayPause}
              className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg transition-all active:scale-95"
              title={isPlaying ? 'Tạm dừng' : 'Phát tiếp'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={handleToggleLoop}
              className={`p-2.5 rounded-xl border transition-all ${
                isLoop
                  ? 'bg-red-950/60 border-red-500 text-red-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title={isLoop ? 'Lặp lại liên tục: BẬT' : 'Lặp lại: TẮT'}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Success Message Banner */}
          {uploadSuccessMsg && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{uploadSuccessMsg}</span>
            </div>
          )}

          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('UPLOAD')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'UPLOAD'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tải Tệp Nhạc Lên</span>
            </button>

            <button
              onClick={() => setActiveTab('URL')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'URL'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Dán Link Nhạc MP3</span>
            </button>

            <button
              onClick={() => setActiveTab('PRESETS')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'PRESETS'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Bản Nhạc Có Sẵn</span>
            </button>
          </div>

          {/* TAB 1: Upload File */}
          {activeTab === 'UPLOAD' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-700 hover:border-red-500 rounded-3xl bg-slate-950/60 hover:bg-slate-950 transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-600/10 group-hover:bg-red-600/20 text-red-400 flex items-center justify-center mb-3 transition-colors">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  Chọn tệp nhạc từ máy tính / điện thoại
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Hỗ trợ định dạng: MP3, WAV, M4A, OGG, FLAC
                </p>
                <span className="mt-4 px-4 py-2 bg-slate-800 group-hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors">
                  Tải Lên & Phát Ngay
                </span>
              </div>

              {/* Uploaded tracks list */}
              {uploadedTracks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Danh Sách Nhạc Bạn Đã Thêm:
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadedTracks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => handleSelectTrack(t)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          activeTrack?.id === t.id && audioMode === 'CUSTOM'
                            ? 'bg-red-950/40 border-red-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Music className="w-4 h-4 text-red-400 shrink-0" />
                          <div className="truncate text-xs font-medium">{t.title}</div>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0">
                          {t.sourceType === 'UPLOAD' ? 'Tệp tải lên' : 'URL Link'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: URL Link */}
          {activeTab === 'URL' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Đường dẫn âm thanh trực tuyến (Direct URL MP3/Stream):
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/audio/conan_theme.mp3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Tên bài hát (tùy chọn):
                  </label>
                  <input
                    type="text"
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                    placeholder="Nhạc Phim Conan Movie 29..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  onClick={handlePlayUrl}
                  disabled={!urlInput.trim()}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs rounded-xl transition-all shadow-lg active:scale-98"
                >
                  Phát Nhạc Từ URL Này
                </button>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                💡 <span className="font-semibold text-slate-300">Gợi ý:</span> Bạn có thể dán link trực tiếp tệp .mp3 hoặc luồng phát radio trực tuyến để nhạc tự động phát trong suốt quá trình phá án!
              </div>
            </div>
          )}

          {/* TAB 3: Presets */}
          {activeTab === 'PRESETS' && (
            <div className="space-y-3">
              {[
                {
                  type: 'THEME' as const,
                  title: 'Detective Conan Movie 29 Main Theme',
                  desc: 'Giai điệu kèn Saxophone & nhịp điệu Jazz-Funk trứ danh của Katsuo Ono',
                },
                {
                  type: 'SUSPENSE' as const,
                  title: 'Tokyo Suspense & Mystery Tension',
                  desc: 'Nhạc nền cello trầm ấm và tiếng chuông bí ẩn trong đêm bão tuyết',
                },
                {
                  type: 'DEDUCTION' as const,
                  title: 'Sleeping Kogoro Climax Fanfare',
                  desc: 'Khúc khải hoàn hào hùng khi Conan vạch trần chân tướng duy nhất',
                },
              ].map(preset => (
                <div
                  key={preset.type}
                  onClick={() => handleSelectPresetSynth(preset.type)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    audioMode === 'SYNTH' && conanAudio.getCurrentBgm() === preset.type
                      ? 'bg-red-950/40 border-red-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{preset.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{preset.desc}</div>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 ml-3" />
                </div>
              ))}
            </div>
          )}

          {/* Volume Slider */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <span>Âm lượng nhạc nền</span>
              </span>
              <span className="font-mono text-white font-bold">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-red-500 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Đóng & Tiếp Tục Phá Án
          </button>
        </div>
      </div>
    </div>
  );
};
