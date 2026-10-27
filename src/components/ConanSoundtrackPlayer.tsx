import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Mic, ChevronUp, ChevronDown, Play, Pause } from 'lucide-react';
import { conanAudio } from '../audio/conanSoundEngine';
import { conanVoice } from '../audio/voiceEngine';

import { customMusic } from '../audio/customMusicManager';

interface ConanSoundtrackPlayerProps {
  onOpenMusicManager: () => void;
}

export const ConanSoundtrackPlayer: React.FC<ConanSoundtrackPlayerProps> = ({
  onOpenMusicManager,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentBgm, setCurrentBgm] = useState<'THEME' | 'SUSPENSE' | 'DEDUCTION' | null>('THEME');
  const [customTrackTitle, setCustomTrackTitle] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(conanAudio.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(conanAudio.getIsMuted());
  const [speakerInfo, setSpeakerInfo] = useState<{ isSpeaking: boolean; speaker: string; text: string }>({
    isSpeaking: false,
    speaker: '',
    text: '',
  });

  useEffect(() => {
    const unsubVoice = conanVoice.subscribe((isSpeaking, speaker, text) => {
      setSpeakerInfo({ isSpeaking, speaker, text });
    });
    const unsubMusic = customMusic.subscribe((state) => {
      setCustomTrackTitle(state.track?.title || null);
      if (state.track) {
        setIsPlaying(state.isPlaying);
      }
    });
    return () => {
      unsubVoice();
      unsubMusic();
    };
  }, []);

  const handleTogglePlayPause = async () => {
    await conanAudio.resumeContext();
    if (isPlaying) {
      conanAudio.stopBgm();
      setIsPlaying(false);
    } else {
      const track = currentBgm || 'THEME';
      await conanAudio.playBgm(track, true);
      setIsPlaying(true);
      if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  const handlePlayTrack = async (track: 'THEME' | 'SUSPENSE' | 'DEDUCTION') => {
    setCurrentBgm(track);
    setIsPlaying(true);
    await conanAudio.playBgm(track, true);
    if (isMuted) {
      conanAudio.toggleMute();
      setIsMuted(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    conanAudio.setVolume(val);
    if (isMuted && val > 0) {
      conanAudio.toggleMute();
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    const m = conanAudio.toggleMute();
    setIsMuted(m);
    if (!m && !isPlaying) {
      setIsPlaying(true);
      conanAudio.playBgm(currentBgm || 'THEME', true);
    }
  };

  return (
    <div className="fixed bottom-16 right-2 sm:bottom-4 sm:right-4 z-30 max-w-[280px] sm:max-w-sm">
      {/* Speaking floating subtitle bubble */}
      {speakerInfo.isSpeaking && (
        <div className="mb-2 p-3 bg-red-950/95 backdrop-blur-md border border-red-500/50 rounded-2xl shadow-2xl text-xs animate-slide-up flex items-start gap-2.5">
          <div className="p-1.5 bg-red-600 rounded-lg shrink-0 mt-0.5">
            <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-red-400 font-mono text-[10px] uppercase">
              {speakerInfo.speaker} đang nói:
            </div>
            <p className="text-slate-100 text-[11px] leading-tight line-clamp-2 italic">
              "{speakerInfo.text}"
            </p>
          </div>
        </div>
      )}

      {/* Docked Player */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-2.5 text-slate-100">
        <div className="flex items-center justify-between gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlayPause}
            className={`p-1.5 rounded-lg text-white font-bold transition-all ${
              isPlaying && !isMuted ? 'bg-red-600 hover:bg-red-500' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc Movie 29'}
          >
            {isPlaying && !isMuted ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs font-semibold hover:text-white transition-colors"
          >
            <div className="p-1 bg-red-600/20 text-red-400 rounded-md">
              <Music className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-xs max-w-[120px] truncate">
              {customTrackTitle ? customTrackTitle : currentBgm === 'THEME' ? 'Movie 29 Theme' : currentBgm === 'SUSPENSE' ? 'Tension Theme' : 'Deduction Climax'}
            </span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          {/* Equalizer animation */}
          {isPlaying && !isMuted && (
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-1 bg-red-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-3" />
              <span className="w-1 bg-red-400 rounded-full animate-[pulse_0.35s_ease-in-out_infinite] h-2" />
              <span className="w-1 bg-red-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3.5" />
              <span className="w-1 bg-red-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-2" />
            </div>
          )}

          <button
            onClick={handleToggleMute}
            className="p-1 text-slate-400 hover:text-white rounded"
            title={isMuted ? 'Bật âm' : 'Tắt âm'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Expanded Controls */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-mono">CHỌN BẢN NHẠC MOVIE 29:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => handlePlayTrack('THEME')}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    currentBgm === 'THEME' && isPlaying && !isMuted
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Theme Chính
                </button>
                <button
                  onClick={() => handlePlayTrack('SUSPENSE')}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    currentBgm === 'SUSPENSE' && isPlaying && !isMuted
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Hồi Hộp
                </button>
                <button
                  onClick={() => handlePlayTrack('DEDUCTION')}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    currentBgm === 'DEDUCTION' && isPlaying && !isMuted
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Phá Án
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Âm lượng nhạc</span>
                <span className="font-mono font-bold text-slate-200">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={onOpenMusicManager}
                className="w-full py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-400 hover:text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Tải Nhạc Của Bạn / Thay Nhạc Khác</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
