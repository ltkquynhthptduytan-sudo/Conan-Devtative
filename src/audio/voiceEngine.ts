/**
 * Full Character Voice Engine using Web Speech API
 * Provides custom character vocal characteristics for Conan, Mori, Megure, and suspects.
 */

export interface CharacterVoiceProfile {
  characterName: string;
  pitch: number;
  rate: number;
  lang: string;
  prefixEffect?: string;
}

export const CHARACTER_PROFILES: Record<string, CharacterVoiceProfile> = {
  CONAN: {
    characterName: 'Edogawa Conan',
    pitch: 1.4,
    rate: 1.05,
    lang: 'vi-VN',
  },
  SLEEPING_KOGORO: {
    characterName: 'Mori Kogoro (Ngủ Gật)',
    pitch: 0.8,
    rate: 0.88,
    lang: 'vi-VN',
  },
  KOGORO_NORMAL: {
    characterName: 'Mori Kogoro',
    pitch: 0.85,
    rate: 1.0,
    lang: 'vi-VN',
  },
  MEGURE: {
    characterName: 'Thanh tra Megure',
    pitch: 0.72,
    rate: 0.9,
    lang: 'vi-VN',
  },
  RAN: {
    characterName: 'Mori Ran',
    pitch: 1.3,
    rate: 1.0,
    lang: 'vi-VN',
  },
  AGASA: {
    characterName: 'Tiến sĩ Agasa',
    pitch: 0.95,
    rate: 0.92,
    lang: 'vi-VN',
  },
  SUSPECT_TATSUMI: {
    characterName: 'Tatsumi Ryuichi',
    pitch: 1.05,
    rate: 1.12,
    lang: 'vi-VN',
  },
  SUSPECT_AYANE: {
    characterName: 'Fujiwara Ayane',
    pitch: 1.2,
    rate: 0.92,
    lang: 'vi-VN',
  },
  SUSPECT_KENZO: {
    characterName: 'Kuroda Kenzo',
    pitch: 0.78,
    rate: 0.95,
    lang: 'vi-VN',
  },
};

class ConanVoiceEngine {
  private isVoiceEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private onSpeakingChangeCallbacks: Set<(isSpeaking: boolean, speakerName: string, text: string) => void> = new Set();
  private currentSpeaker: string = '';
  private currentText: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }
  }

  public subscribe(cb: (isSpeaking: boolean, speakerName: string, text: string) => void) {
    this.onSpeakingChangeCallbacks.add(cb);
    return () => {
      this.onSpeakingChangeCallbacks.delete(cb);
    };
  }

  private notify(isSpeaking: boolean) {
    this.onSpeakingChangeCallbacks.forEach(cb => cb(isSpeaking, this.currentSpeaker, this.currentText));
  }

  public toggleVoice(): boolean {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled) {
      this.stop();
    }
    return this.isVoiceEnabled;
  }

  public isEnabled(): boolean {
    return this.isVoiceEnabled;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.notify(false);
    }
  }

  public speak(characterKey: string, text: string, onEnd?: () => void) {
    if (!this.isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const profile = CHARACTER_PROFILES[characterKey] || CHARACTER_PROFILES.CONAN;
    this.currentSpeaker = profile.characterName;
    this.currentText = text;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;
    utterance.lang = profile.lang;

    // Try finding matching voice (Vietnamese preferred, or fallback)
    if (this.availableVoices.length > 0) {
      const viVoice = this.availableVoices.find(v => v.lang.startsWith('vi') || v.lang.includes('VIE'));
      if (viVoice) {
        utterance.voice = viVoice;
      }
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.notify(false);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const conanVoice = new ConanVoiceEngine();
