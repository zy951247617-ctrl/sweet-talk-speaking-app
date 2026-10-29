/**
 * Speech recognition and synthesis utilities for Sweet Talk!
 * Follows PRD specifications for CEFR A1 elementary practice.
 */

export const NORMAL_AUDIO_RATE = 0.9;
export const SLOW_AUDIO_RATE = 0.7;

// Check if Web Speech API is supported
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
}

// Check if browser is an in-app browser (e.g. KakaoTalk, Instagram, Line)
export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /KAKAOTALK|Instagram|Line|FBAN|FBAV/i.test(ua);
}

// Text-to-speech using window.speechSynthesis
export function speakText(
  text: string,
  rate: number = NORMAL_AUDIO_RATE,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError('SpeechSynthesis not available');
    return () => {};
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Prefer a natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en-US') && !v.name.includes('Google') && (v.name.includes('Natural') || v.name.includes('Jenny') || v.name.includes('Samantha'))) ||
                  voices.find(v => v.lang.startsWith('en-US')) ||
                  voices.find(v => v.lang.startsWith('en'));
  if (enVoice) {
    utterance.voice = enVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

export function cancelSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Text normalizer for keyword verification
 * 1. Lowercases text
 * 2. Removes punctuation
 * 3. Normalizes digits: "2" -> "two"
 * 4. Normalizes colloquial words: "thanks" -> "thank"
 */
export function normalizeSpokenText(text: string): string[] {
  if (!text) return [];

  // Replace digit "2" with "two"
  let cleaned = text.toLowerCase().replace(/\b2\b/g, 'two');

  // Remove punctuation except spaces
  cleaned = cleaned.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ');

  // Split into tokens
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  // Map tokens for equivalent words (e.g. thanks -> thank)
  return tokens.map(token => {
    if (token === 'thanks') return 'thank';
    return token;
  });
}

/**
 * Check if the learner communicated all designated keywords.
 * Rule: Whole-word match. All keywords present = success!
 */
export function evaluateKeywords(
  spokenText: string,
  targetKeywords: string[]
): {
  isSuccess: boolean;
  missingKeywords: string[];
  recognizedTokens: string[];
} {
  const recognizedTokens = normalizeSpokenText(spokenText);
  const tokenSet = new Set(recognizedTokens);

  const missingKeywords: string[] = [];

  for (const keyword of targetKeywords) {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (!tokenSet.has(normalizedKeyword)) {
      missingKeywords.push(normalizedKeyword);
    }
  }

  const isSuccess = missingKeywords.length === 0;

  return {
    isSuccess,
    missingKeywords,
    recognizedTokens,
  };
}

/**
 * Check if all keywords are present but a polite/small word was omitted
 * (e.g. omitted "please" or "an")
 */
export function checkHasSmallWordMissing(spokenText: string, targetSentence: string): boolean {
  const normSpoken = normalizeSpokenText(spokenText);
  const normTarget = normalizeSpokenText(targetSentence);

  const spokenSet = new Set(normSpoken);
  const targetWords = normTarget;

  // Check if target contains "please" or "an" but spoken does not
  if (targetWords.includes('please') && !spokenSet.has('please')) return true;
  if (targetWords.includes('an') && !spokenSet.has('an')) return true;
  if (targetWords.includes('a') && !spokenSet.has('a')) return true;

  return false;
}
