/**
 * Web Audio API based Synthesizer & Sound FX Engine for Detective Conan
 * Inspired by Katsuo Ono's iconic Detective Conan Movie soundtracks (Movie 29 Symphonic Jazz/Rock)
 */

class ConanSoundEngine {
  private ctx: AudioContext | null = null;
  private masterCompressor: DynamicsCompressorNode | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private currentBgmType: 'THEME' | 'SUSPENSE' | 'DEDUCTION' | null = null;
  private bgmTimeoutId: number | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private isUnlocked: boolean = false;
  private listenersAttached: boolean = false;

  constructor() {
    this.attachUnlockListeners();
  }

  private attachUnlockListeners() {
    if (typeof window === 'undefined' || this.listenersAttached) return;
    this.listenersAttached = true;

    const unlock = () => {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          this.isUnlocked = true;
          // If a BGM was requested before unlock, kickstart it now
          if (this.currentBgmType) {
            this.restartCurrentBgm();
          }
        }).catch(() => {});
      } else {
        this.isUnlocked = true;
      }
    };

    window.addEventListener('click', unlock, { once: false, passive: true });
    window.addEventListener('pointerdown', unlock, { once: false, passive: true });
    window.addEventListener('keydown', unlock, { once: false, passive: true });
  }

  public async resumeContext(): Promise<void> {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
        this.isUnlocked = true;
      } catch (e) {
        console.warn('AudioContext resume failed:', e);
      }
    } else {
      this.isUnlocked = true;
    }
  }

  public isAudioActive(): boolean {
    return !!this.ctx && this.ctx.state === 'running' && !this.isMuted;
  }

  public initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Compressor to give a rich, punchy broadcast sound without clipping
      this.masterCompressor = this.ctx.createDynamicsCompressor();
      this.masterCompressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
      this.masterCompressor.knee.setValueAtTime(12, this.ctx.currentTime);
      this.masterCompressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
      this.masterCompressor.release.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterCompressor.connect(this.ctx.destination);

      this.musicGainNode = this.ctx.createGain();
      this.sfxGainNode = this.ctx.createGain();

      this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.75, this.ctx.currentTime);
      this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.musicGainNode.connect(this.masterCompressor);
      this.sfxGainNode.connect(this.masterCompressor);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.musicGainNode && this.sfxGainNode) {
      const now = this.ctx.currentTime;
      this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.75, now);
      this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, now);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    if (!this.isMuted && !this.currentBgmType) {
      this.playBgm('THEME', true);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentBgm(): 'THEME' | 'SUSPENSE' | 'DEDUCTION' | null {
    return this.currentBgmType;
  }

  // --- Sound Effects ---

  public playEpiphany() {
    this.resumeContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    const t = this.ctx.currentTime;
    const freqs = [880, 1174.66, 1396.91, 1760, 2093, 2793.83];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.035);

      gain.gain.setValueAtTime(0.001, t + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.35, t + idx * 0.035 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.035 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);
      osc.start(t + idx * 0.035);
      osc.stop(t + idx * 0.035 + 0.4);
    });
  }

  public playDramaticShock() {
    this.resumeContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    const t = this.ctx.currentTime;
    const chord = [130.81, 155.56, 185.0, 246.94, 523.25];
    chord.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  }

  public playStunDart() {
    this.resumeContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.15);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.2);

    setTimeout(() => {
      if (!this.ctx || !this.sfxGainNode || this.isMuted) return;
      const thump = this.ctx.createOscillator();
      const thumpGain = this.ctx.createGain();
      thump.type = 'triangle';
      thump.frequency.setValueAtTime(100, this.ctx.currentTime);
      thump.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 0.35);
      thumpGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      thump.connect(thumpGain);
      thumpGain.connect(this.sfxGainNode);
      thump.start();
      thump.stop(this.ctx.currentTime + 0.4);
    }, 220);
  }

  public playBowtieDial() {
    this.resumeContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, t);
    osc.frequency.setValueAtTime(980, t + 0.05);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playClueFound() {
    this.resumeContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + i * 0.06);

      gain.gain.setValueAtTime(0.25, t + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGainNode!);
      osc.start(t + i * 0.06);
      osc.stop(t + i * 0.06 + 0.28);
    });
  }

  public playTick(isUrgent = false) {
    this.resumeContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(isUrgent ? 1350 : 900, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playObjectionSlam() {
    this.resumeContext();
    if (!this.ctx || !this.sfxGainNode || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.45);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    osc.start(t);
    osc.stop(t + 0.5);

    this.playEpiphany();
  }

  // --- Background Music Tracks ---

  public stopBgm() {
    if (this.bgmTimeoutId) {
      clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
    this.currentBgmType = null;
  }

  public async playBgm(type: 'THEME' | 'SUSPENSE' | 'DEDUCTION', forceRestart = false) {
    await this.resumeContext();
    if (this.currentBgmType === type && !forceRestart && this.bgmTimeoutId) return;

    this.stopBgm();
    this.currentBgmType = type;

    if (type === 'THEME') {
      this.startConanThemeLoop();
    } else if (type === 'SUSPENSE') {
      this.startSuspenseLoop();
    } else if (type === 'DEDUCTION') {
      this.startDeductionLoop();
    }
  }

  private restartCurrentBgm() {
    if (this.currentBgmType) {
      const type = this.currentBgmType;
      this.stopBgm();
      this.playBgm(type, true);
    }
  }

  // Helper synth drum kick
  private playKick(t: number) {
    if (!this.ctx || !this.musicGainNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(gain);
    gain.connect(this.musicGainNode);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Helper synth hi-hat/snare
  private playSnare(t: number) {
    if (!this.ctx || !this.musicGainNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(this.musicGainNode);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Detective Conan Main Theme Loop
   * Authentic D-minor sax/brass lead with iconic driving jazz-rock bass & drums
   */
  private startConanThemeLoop() {
    // Iconic Detective Conan Theme main motif:
    // D4, E4, F4, G4, A4, F4, D4, C#4, D4 | A4, Bb4, C5, D5, C5, Bb4, A4
    const melody: { note: number; duration: number }[] = [
      { note: 293.66, duration: 0.28 }, // D4
      { note: 329.63, duration: 0.28 }, // E4
      { note: 349.23, duration: 0.38 }, // F4
      { note: 392.00, duration: 0.28 }, // G4
      { note: 440.00, duration: 0.55 }, // A4
      { note: 349.23, duration: 0.28 }, // F4
      { note: 293.66, duration: 0.65 }, // D4
      { note: 277.18, duration: 0.38 }, // C#4
      { note: 293.66, duration: 0.85 }, // D4
      // Second phrase
      { note: 440.00, duration: 0.28 }, // A4
      { note: 466.16, duration: 0.28 }, // Bb4
      { note: 523.25, duration: 0.42 }, // C5
      { note: 587.33, duration: 0.55 }, // D5
      { note: 523.25, duration: 0.28 }, // C5
      { note: 466.16, duration: 0.28 }, // Bb4
      { note: 440.00, duration: 0.80 }, // A4
    ];

    const phraseDuration = 6.2; // seconds

    const scheduleLoop = () => {
      if (!this.ctx || !this.musicGainNode || this.isMuted || this.currentBgmType !== 'THEME') return;
      const startT = this.ctx.currentTime + 0.05;

      // Drum beat (Kick on 0, 1.0, 2.0, 3.0, 4.0, 5.0; Snare on 0.5, 1.5, 2.5...)
      for (let s = 0; s < 6; s++) {
        this.playKick(startT + s);
        this.playSnare(startT + s + 0.5);
      }

      // Funk Bass line (D2, D2, F2, G2, A2, Bb2, A2)
      const bassSeq = [
        { note: 146.83, t: 0 },
        { note: 146.83, t: 0.5 },
        { note: 174.61, t: 1.0 },
        { note: 196.00, t: 1.5 },
        { note: 220.00, t: 2.0 },
        { note: 146.83, t: 2.5 },
        { note: 138.59, t: 3.0 },
        { note: 146.83, t: 3.5 },
        { note: 220.00, t: 4.0 },
        { note: 233.08, t: 4.5 },
        { note: 261.63, t: 5.0 },
        { note: 220.00, t: 5.5 },
      ];

      bassSeq.forEach((b) => {
        if (!this.ctx) return;
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(b.note, startT + b.t);

        bGain.gain.setValueAtTime(0.001, startT + b.t);
        bGain.gain.exponentialRampToValueAtTime(0.35, startT + b.t + 0.03);
        bGain.gain.exponentialRampToValueAtTime(0.001, startT + b.t + 0.45);

        bOsc.connect(bGain);
        bGain.connect(this.musicGainNode!);
        bOsc.start(startT + b.t);
        bOsc.stop(startT + b.t + 0.48);
      });

      // Lead Melody (Saxophone / Brass emulation)
      let noteTime = startT;
      melody.forEach((item) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(item.note, noteTime);

        // Warm brass filter
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, noteTime);
        filter.Q.setValueAtTime(3.5, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.38, noteTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + item.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGainNode!);

        osc.start(noteTime);
        osc.stop(noteTime + item.duration + 0.05);

        noteTime += item.duration;
      });

      // Schedule next loop repetition precisely
      this.bgmTimeoutId = window.setTimeout(scheduleLoop, phraseDuration * 1000);
    };

    scheduleLoop();
  }

  /** Suspense Tension Ostinato (Movie 29 Mystery) */
  private startSuspenseLoop() {
    const loopDurationSec = 4.0;

    const scheduleSuspense = () => {
      if (!this.ctx || !this.musicGainNode || this.isMuted || this.currentBgmType !== 'SUSPENSE') return;
      const startT = this.ctx.currentTime + 0.05;

      // Dark pulsing cello bass notes
      [65.41, 77.78, 65.41, 92.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startT + idx * 0.9);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550, startT + idx * 0.9);

        gain.gain.setValueAtTime(0.001, startT + idx * 0.9);
        gain.gain.exponentialRampToValueAtTime(0.35, startT + idx * 0.9 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + idx * 0.9 + 0.85);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGainNode!);

        osc.start(startT + idx * 0.9);
        osc.stop(startT + idx * 0.9 + 0.9);
      });

      // Ticking high mysterious bells
      for (let i = 0; i < 8; i++) {
        if (!this.ctx) return;
        const ping = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        ping.type = 'sine';
        ping.frequency.setValueAtTime(i % 2 === 0 ? 1318.51 : 1567.98, startT + i * 0.45);

        pingGain.gain.setValueAtTime(0.001, startT + i * 0.45);
        pingGain.gain.exponentialRampToValueAtTime(0.12, startT + i * 0.45 + 0.02);
        pingGain.gain.exponentialRampToValueAtTime(0.001, startT + i * 0.45 + 0.2);

        ping.connect(pingGain);
        pingGain.connect(this.musicGainNode!);
        ping.start(startT + i * 0.45);
        ping.stop(startT + i * 0.45 + 0.22);
      }

      this.bgmTimeoutId = window.setTimeout(scheduleSuspense, loopDurationSec * 1000);
    };

    scheduleSuspense();
  }

  /** Deduction Climax Theme: "Chân tướng chỉ có một!" */
  private startDeductionLoop() {
    const loopDurationSec = 4.8;

    const scheduleDeduction = () => {
      if (!this.ctx || !this.musicGainNode || this.isMuted || this.currentBgmType !== 'DEDUCTION') return;
      const startT = this.ctx.currentTime + 0.05;

      const chords = [
        { freqs: [233.08, 293.66, 349.23, 466.16], time: 0, dur: 0.95 },   // Bb major
        { freqs: [261.63, 329.63, 392.00, 523.25], time: 1.1, dur: 0.95 }, // C major
        { freqs: [293.66, 349.23, 440.00, 587.33], time: 2.3, dur: 2.1 }   // D minor heroic
      ];

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, startT + chord.time);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2400, startT + chord.time);

          gain.gain.setValueAtTime(0.001, startT + chord.time);
          gain.gain.exponentialRampToValueAtTime(0.25, startT + chord.time + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, startT + chord.time + chord.dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.musicGainNode!);

          osc.start(startT + chord.time);
          osc.stop(startT + chord.time + chord.dur + 0.05);
        });
      });

      this.bgmTimeoutId = window.setTimeout(scheduleDeduction, loopDurationSec * 1000);
    };

    scheduleDeduction();
  }
}

export const conanAudio = new ConanSoundEngine();
