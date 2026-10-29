// Sweet Talk Speaking App Types
export interface DialogueTurn {
  turnNumber: number;
  partnerPromptEn: string;
  partnerPromptKo: string;
  targetSentenceEn: string;
  targetSentenceKo: string;
  keywords: string[];
  equivalentKeywords?: Record<string, string>;
  scoopBadge: string;
}

export interface TurnAttempt {
  turnNumber: number;
  spokenAttemptsCount: number;
  attemptsHistory: {
    recognizedText: string;
    isSuccess: boolean;
    timestamp: number;
  }[];
  isSuccess: boolean;
  isSkipped: boolean;
  currentFeedback: string;
  recognizedText: string;
}
