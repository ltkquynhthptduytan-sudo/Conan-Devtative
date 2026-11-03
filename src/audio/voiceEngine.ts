/**
 * Voice Engine Stub
 * Voice / speech synthesis features have been removed per user request.
 */

export interface CharacterVoiceProfile {
  characterName: string;
  pitch: number;
  rate: number;
  lang: string;
}

export const CHARACTER_PROFILES: Record<string, CharacterVoiceProfile> = {};

class ConanVoiceEngine {
  public subscribe(_cb: (isSpeaking: boolean, speakerName: string, text: string) => void): () => void {
    return () => {};
  }

  public toggleVoice(): boolean {
    return false;
  }

  public isEnabled(): boolean {
    return false;
  }

  public stop(): void {}

  public speak(_characterKey: string, _text: string, onEnd?: () => void): void {
    if (onEnd) {
      onEnd();
    }
  }
}

export const conanVoice = new ConanVoiceEngine();
