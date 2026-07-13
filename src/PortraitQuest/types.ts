export const FIELD_W = 390;
export const FIELD_H = 844;

export type Locale = 'zh' | 'en';
export type Localized = Record<Locale, string>;
export type StatKey = 'calm' | 'order' | 'trust' | 'truth';
export type Stats = Record<StatKey, number>;
export type PortraitState =
  | 'neutral'
  | 'confident'
  | 'worried'
  | 'defiant'
  | 'exhausted'
  | 'arrival'
  | 'resolved';

export type SceneKey = 'intro' | 'midpoint' | 'win' | 'lose';

export interface Choice {
  label: Localized;
  outcome: Localized;
  effects: Partial<Record<StatKey, number>>;
  portrait?: PortraitState;
  addFlags?: string[];
}

export interface EventCard {
  id: string;
  deskCode: string;
  title: Localized;
  body: Localized;
  choices: [Choice, Choice];
  minRound?: number;
  maxRound?: number;
  requiresAny?: string[];
  excludesAny?: string[];
}

export interface Ending {
  id: string;
  title: Localized;
  summary: Localized;
}

export interface ThemeCartridge {
  id: string;
  copy: Record<Locale, Record<string, string>>;
  statLabels: Record<StatKey, Localized>;
  events: EventCard[];
  discoveryFlags: string[];
  specialEndingFlags: [string, string];
  midpoint: Record<'investigate' | 'obey', { title: Localized; body: Localized }>;
  endings: Record<string, Ending>;
}

export interface IdentityPack {
  username: string;
  userId: string;
  sourceAvatar: string;
  avatarDescribe: string;
  sourceStyle: string;
  portraits: Record<PortraitState, string>;
  scenes: Partial<Record<SceneKey, string>>;
}

export interface FeedbackState {
  outcome: string;
  effects: Partial<Record<StatKey, number>>;
}
