/**
 * Custom Music & Audio Manager
 * Supports:
 * 1. User uploaded custom audio files (MP3, WAV, OGG, M4A)
 * 2. Online Audio URLs
 * 3. Pre-curated audio presets
 */

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  sourceType: 'UPLOAD' | 'URL' | 'PRESET_SYNTH';
  url?: string;
  synthType?: 'THEME' | 'SUSPENSE' | 'DEDUCTION';
}

class CustomMusicManager {
  private audioEl: HTMLAudioElement | null = null;
  private currentTrack: TrackItem | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.8;
  private isLoop: boolean = true;
  private userTracks: TrackItem[] = [];
  private listeners: Set<(state: { isPlaying: boolean; track: TrackItem | null; volume: number }) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.loop = true;
      this.audioEl.volume = this.volume;

      this.audioEl.onplay = () => {
        this.isPlaying = true;
        this.notify();
      };
      this.audioEl.onpause = () => {
        this.isPlaying = false;
        this.notify();
      };
      this.audioEl.onended = () => {
        if (!this.isLoop) {
          this.isPlaying = false;
          this.notify();
        }
      };
      this.audioEl.onerror = () => {
        console.warn('Audio element error playing custom track');
        this.isPlaying = false;
        this.notify();
      };
    }
  }

  public subscribe(cb: (state: { isPlaying: boolean; track: TrackItem | null; volume: number }) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb({
      isPlaying: this.isPlaying,
      track: this.currentTrack,
      volume: this.volume,
    }));
  }

  public getCurrentTrack(): TrackItem | null {
    return this.currentTrack;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    this.notify();
  }

  public toggleLoop(): boolean {
    this.isLoop = !this.isLoop;
    if (this.audioEl) {
      this.audioEl.loop = this.isLoop;
    }
    return this.isLoop;
  }

  public isLoopEnabled(): boolean {
    return this.isLoop;
  }

  public async playCustomTrack(track: TrackItem): Promise<boolean> {
    this.currentTrack = track;

    if (this.audioEl && track.url) {
      try {
        this.audioEl.src = track.url;
        this.audioEl.currentTime = 0;
        await this.audioEl.play();
        this.isPlaying = true;
        this.notify();
        return true;
      } catch (err) {
        console.warn('Failed to autoplay custom audio:', err);
        this.isPlaying = false;
        this.notify();
        return false;
      }
    }
    return false;
  }

  public play() {
    if (this.audioEl && this.audioEl.src) {
      this.audioEl.play().catch(e => console.warn(e));
    }
  }

  public pause() {
    if (this.audioEl) {
      this.audioEl.pause();
    }
  }

  public stop() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    this.isPlaying = false;
    this.currentTrack = null;
    this.notify();
  }

  public addUploadedFile(file: File): TrackItem {
    const objectUrl = URL.createObjectURL(file);
    const track: TrackItem = {
      id: 'upload_' + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Nhạc của bạn',
      sourceType: 'UPLOAD',
      url: objectUrl,
    };
    this.userTracks.unshift(track);
    return track;
  }

  public addUrlTrack(url: string, title?: string): TrackItem {
    const track: TrackItem = {
      id: 'url_' + Date.now(),
      title: title || 'Nhạc Trực Tuyến (URL)',
      artist: 'Web Audio Stream',
      sourceType: 'URL',
      url,
    };
    this.userTracks.unshift(track);
    return track;
  }

  public getUserTracks(): TrackItem[] {
    return this.userTracks;
  }
}

export const customMusic = new CustomMusicManager();
