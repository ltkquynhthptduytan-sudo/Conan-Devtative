export type GameScreen = 
  | 'TITLE'
  | 'CRIME_SCENE'
  | 'EVIDENCE'
  | 'SUSPECTS'
  | 'INTERROGATION'
  | 'MAP'
  | 'PUZZLE'
  | 'DEDUCTION_CLIMAX'
  | 'CASE_SOLVED';

export type DifficultyLevel = 'EASY' | 'HARD';

export type GadgetType = 
  | 'BOWTIE' 
  | 'STUN_WATCH' 
  | 'GLASSES' 
  | 'SNEAKERS' 
  | 'BADGE';

export type ShopItemTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'LEGENDARY';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  iconName: string;
  tier: ShopItemTier;
  bonusType: 'BOMB_TIME' | 'PUZZLE_TIME' | 'HINT_BONUS' | 'FREEZE_TIMER' | 'FORENSIC_BOOST';
  bonusValue: number;
  bonusDescription: string;
  compatibleCharacterId?: string;
}

export interface ForensicSample {
  id: string;
  evidenceId: string;
  sampleName: string;
  sampleType: 'FINGERPRINT' | 'DNA' | 'CHEMICAL' | 'BLOOD';
  discoveredLocation: string;
  analyzed: boolean;
  analysisReport?: string;
  matchedSuspectId?: string;
  matchedSuspectName?: string;
}

export type EquippedItemsMap = Record<string, string[]>; // characterId -> itemIds

export interface EvidenceItem {
  id: string;
  title: string;
  category: 'Khám nghiệm y khoa' | 'Thủ đoạn cơ học' | 'Thời gian & Ngoại phạm' | 'Manh mối số' | 'Hóa chất & Vật phẩm';
  description: string;
  detailedAnalysis: string;
  discoveredLocation: string;
  isKeyEvidence: boolean;
  isDistractor?: boolean; // Vật chứng gây nhiễu
  distractorExplanation?: string; // Conan giải thích vì sao là vật chứng nhiễu
  contradictsSuspectId?: string;
  contradictionReason?: string;
  iconName: string;
  collected: boolean;
  secretNotes?: string;
  difficulty?: 'EASY' | 'HARD'; // If HARD, only appears in Hard mode as deeper/distractor clues
}

export interface StatementItem {
  id: string;
  text: string;
  isContradictory: boolean;
  refutingEvidenceId?: string;
  refutationExplanation?: string;
  conanVoiceline?: string;
}

export interface Suspect {
  id: string;
  name: string;
  furigana: string;
  age: number;
  occupation: string;
  relationshipToVictim: string;
  avatarSeed: string;
  alibi: string;
  motive: string;
  nervousnessLevel: number; // 0 to 100
  hardNervousnessLevel?: number; // In hard mode, culprit holds poker face
  isCulprit: boolean;
  statements: StatementItem[];
  timeline: { time: string; action: string; verified: boolean }[];
  personality: string;
  initialVoiceLine: string;
  breakdownVoiceLine: string;
  weaknessHint: string;
}

export interface Hotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  description: string;
  sceneIndex?: number; // 0: Main Scene, 1: Sub-Scene 2, 2: Sub-Scene 3
  requiresGadget?: 'GLASSES' | 'MAGNIFIER';
  evidenceIdGranted?: string;
  isDiscovered: boolean;
  promptToInspect: string;
  difficulty?: 'EASY' | 'HARD';
}

export interface MapLocation {
  id: string;
  name: string;
  subtitle: string;
  coordinates: { x: number; y: number };
  description: string;
  characterPresent: string;
  dialoguePreview: string;
  isUnlocked: boolean;
}

export interface SubScene {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface CaseData {
  id: string;
  caseNumber: number;
  title: string;
  victimName: string;
  timeOfDeath: string;
  crimeLocation: string;
  crimeSceneImage: string;
  subScenes?: SubScene[]; // 2 cảnh góc phụ bổ sung cho hiện trường
  synopsis: string;
  lockedRoomTrick: string;
  decisiveEvidenceId: string;
  culpritId: string;
  realTimePuzzle: {
    title: string;
    description: string;
    timeLimitSeconds: number;
    hardTimeLimitSeconds?: number;
    type: 'CIPHER' | 'WIRES' | 'TIMELINE';
    solution: string | string[];
    hint: string;
    hardHint?: string;
    penaltySeconds: number;
    evidenceIdGranted?: string;
    rewardText?: string;
  };
  hotspots: Hotspot[];
  evidence: EvidenceItem[];
  suspects: Suspect[];
  deductionSteps: {
    question: string;
    options: { text: string; isCorrect: boolean; feedback: string }[];
  }[];
}
