export type AspectRatio = '9:16' | '1:1' | '16:9';

export type LayoutMode = 'single' | 'split' | 'pip' | 'fit-blur';

export type CaptionStyle = 'hormozi' | 'mrbeast' | 'neon' | 'minimal' | 'pop';

export interface TranscriptWord {
  id: string;
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
  speaker?: string;
  highlighted?: boolean;
  emoji?: string;
}

export interface ViralityMetrics {
  overall: number; // 0-100
  hookStrength: number;
  engagementScore: number;
  flowScore: number;
  trendScore: number;
  explanation: string;
}

export interface VideoClip {
  id: string;
  title: string;
  hookQuote: string;
  duration: number; // in seconds
  startTime: number;
  endTime: number;
  aspectRatio: AspectRatio;
  layout: LayoutMode;
  captionStyle: CaptionStyle;
  virality: ViralityMetrics;
  transcript: TranscriptWord[];
  hashtags: string[];
  thumbnail: string;
  speaker1: {
    name: string;
    role: string;
    avatar?: string;
  };
  speaker2?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export interface VideoProject {
  id: string;
  title: string;
  sourceUrl: string;
  duration: number;
  thumbnail: string;
  createdAt: string;
  clipsCount: number;
  clips: VideoClip[];
}

export interface ClippingPreferences {
  clipLength: 'auto' | 'short' | 'standard' | 'long';
  topicPrompt: string;
  language: string;
  captionPreset: CaptionStyle;
  autoReframe: AspectRatio;
  splitScreen: boolean;
  autoEmojis: boolean;
  highlightKeywords: boolean;
}
