import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  Mic,
  RotateCcw,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertCircle,
  Ear,
  Smile,
  ShieldCheck,
  Home,
} from 'lucide-react';
import { SWEET_TALK_TURNS } from '../data/sweetTalkDialogue.ts';
import { TurnAttempt } from '../types.ts';
import {
  speakText,
  cancelSpeech,
  evaluateKeywords,
  checkHasSmallWordMissing,
  isSpeechRecognitionSupported,
  isInAppBrowser,
  NORMAL_AUDIO_RATE,
  SLOW_AUDIO_RATE,
} from '../utils/speech.ts';
import CocoAvatar from './CocoAvatar.tsx';

type ScreenState = 'start' | 'practice' | 'result';

const NO_SPEECH_FEEDBACK =
  "Let's try again! I couldn't hear you. (다시 해 봐요! 목소리가 들리지 않았어요.)";

export default function SweetTalkApp() {
  const [screen, setScreen] = useState<ScreenState>('start');
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [micState, setMicState] = useState<'ready' | 'listening' | 'done'>('ready');
  const [recognizedText, setRecognizedText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [browserNotice, setBrowserNotice] = useState<string | null>(null);

  // Per-turn attempt tracking
  const [turnAttempts, setTurnAttempts] = useState<Record<number, TurnAttempt>>({});

  // Active recognition session tracking & cleanup
  const recognitionRef = useRef<any>(null);
  const timeoutTimerRef = useRef<any>(null);
  const sessionCounterRef = useRef<number>(0);
  const latestTranscriptRef = useRef<string>('');

  const currentTurn = SWEET_TALK_TURNS[currentTurnIndex];

  // Helper to completely abort any ongoing recognition & cancel timeouts
  const stopAndResetRecognition = useCallback(() => {
    // Increment session counter to invalidate any pending async callbacks
    sessionCounterRef.current += 1;

    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (e) {
        // Safe ignore
      }
      recognitionRef.current = null;
    }
  }, []);

  // Check browser compatibility on mount (NO mic permissions requested here!)
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      setBrowserNotice(
        '이 브라우저는 음성 인식을 지원하지 않습니다. 원활한 학습을 위해 Chrome(크롬) 브라우저를 이용해 주세요.'
      );
    } else if (isInAppBrowser()) {
      setBrowserNotice(
        '인앱 브라우저(카카오톡, 인스타그램 등)에서는 마이크 권한이 차단될 수 있습니다. 오른쪽 상단 메뉴에서 Chrome으로 열어주세요.'
      );
    }
  }, []);

  // Comprehensive cleanup on unmount, turn transition, or screen change
  useEffect(() => {
    return () => {
      cancelSpeech();
      stopAndResetRecognition();
    };
  }, [currentTurnIndex, screen, stopAndResetRecognition]);

  // When changing turns, reset local interaction states
  useEffect(() => {
    stopAndResetRecognition();
    setMicState('ready');
    setRecognizedText('');
    setFeedbackText('');
    setIsPlayingAudio(false);
    latestTranscriptRef.current = '';
  }, [currentTurnIndex, stopAndResetRecognition]);

  // Play Coco's partner question
  const handlePlayPartnerPrompt = () => {
    if (isPlayingAudio || micState === 'listening') return;
    setIsPlayingAudio(true);
    speakText(
      currentTurn.partnerPromptEn,
      NORMAL_AUDIO_RATE,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  // Play target sentence (Normal 0.9x or Slow 0.7x)
  const handlePlayTarget = (rate: number) => {
    if (isPlayingAudio || micState === 'listening') return;
    setIsPlayingAudio(true);
    speakText(
      currentTurn.targetSentenceEn,
      rate,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  // Evaluate the spoken answer against PRD Section 6 & 7 rules
  const processSpokenAnswer = async (spokenText: string) => {
    const trimmed = spokenText.trim();

    // If completely empty, treat as no-speech without penalty
    if (!trimmed) {
      setMicState('ready');
      setFeedbackText(NO_SPEECH_FEEDBACK);
      return;
    }

    setMicState('done');
    const { isSuccess, missingKeywords } = evaluateKeywords(trimmed, currentTurn.keywords);
    const smallWordMissing = isSuccess
      ? checkHasSmallWordMissing(trimmed, currentTurn.targetSentenceEn)
      : false;

    // Get previous attempts for this turn
    const prevTurnAttempt = turnAttempts[currentTurn.turnNumber] || {
      turnNumber: currentTurn.turnNumber,
      spokenAttemptsCount: 0,
      attemptsHistory: [],
      isSuccess: false,
      isSkipped: false,
      currentFeedback: '',
      recognizedText: '',
    };

    // Increment count ONLY for non-empty attempts missing key words or completing order
    const newSpokenCount = prevTurnAttempt.spokenAttemptsCount + 1;
    const failureStage = isSuccess ? 0 : Math.min(newSpokenCount, 3);

    setIsEvaluating(true);

    try {
      const res = await fetch('/api/sweettalk/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turnNumber: currentTurn.turnNumber,
          targetSentence: currentTurn.targetSentenceEn,
          recognizedText: trimmed,
          missingKeyword: missingKeywords[0] || '',
          attemptStage: failureStage,
          isSuccess,
          hasSmallWordMissing: smallWordMissing,
        }),
      });

      const data = await res.json();
      const feedback = data.feedback || 'Nice try! (좋은 시도예요!) Keep going! (계속해 봐요!)';
      setFeedbackText(feedback);

      // Record valid spoken attempt in session state
      setTurnAttempts(prev => ({
        ...prev,
        [currentTurn.turnNumber]: {
          turnNumber: currentTurn.turnNumber,
          spokenAttemptsCount: newSpokenCount,
          attemptsHistory: [
            ...prevTurnAttempt.attemptsHistory,
            { recognizedText: trimmed, isSuccess, timestamp: Date.now() },
          ],
          isSuccess: isSuccess || prevTurnAttempt.isSuccess,
          isSkipped: false,
          currentFeedback: feedback,
          recognizedText: trimmed,
        },
      }));
    } catch (e) {
      // Deterministic Section 7 fallback table
      const fallback = isSuccess
        ? 'Nice speaking! (잘 말했어요!) I understood your order. (주문을 알아들었어요.)'
        : "Nice try! (좋은 시도예요!) You can say, '" + currentTurn.targetSentenceEn + "'.";
      setFeedbackText(fallback);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Start Speech Recognition with 8s maximum timeout and robust lifecycle
  const handleStartListening = () => {
    if (isPlayingAudio) return;

    if (!isSpeechRecognitionSupported()) {
      setFeedbackText(
        'Speech recognition is not supported in this browser. Please open in Chrome. (음성 인식을 지원하지 않는 브라우저입니다. Chrome으로 열어주세요.)'
      );
      return;
    }

    // Stop any previous instance first
    stopAndResetRecognition();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const currentSession = sessionCounterRef.current;
    latestTranscriptRef.current = '';

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      setMicState('listening');
      setRecognizedText('');
      setFeedbackText('');

      // 8-second maximum listening timeout
      timeoutTimerRef.current = setTimeout(() => {
        if (sessionCounterRef.current !== currentSession) return;

        // If no speech was captured before timeout:
        const captured = latestTranscriptRef.current.trim();
        stopAndResetRecognition();

        if (captured) {
          processSpokenAnswer(captured);
        } else {
          // Requirement 3: abort recognition, exit Listening, re-enable audio, show exact message
          setMicState('ready');
          setFeedbackText(NO_SPEECH_FEEDBACK);
        }
      }, 8000);

      recognition.onresult = (event: any) => {
        if (sessionCounterRef.current !== currentSession) return;

        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim();
        if (currentText) {
          latestTranscriptRef.current = currentText;
          setRecognizedText(currentText);
        }

        if (finalTranscript.trim()) {
          // Final transcript achieved: clean up timer and evaluate
          stopAndResetRecognition();
          processSpokenAnswer(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        if (sessionCounterRef.current !== currentSession) return;
        console.warn('SpeechRecognition error:', event.error);

        const captured = latestTranscriptRef.current.trim();
        stopAndResetRecognition();

        // Always exit listening on error
        setMicState('ready');

        if (event.error === 'not-allowed') {
          setFeedbackText(
            'Microphone access was denied. Please allow microphone permissions in browser settings. (마이크 권한이 차단되었습니다. 브라우저 설정에서 마이크를 허용해 주세요.)'
          );
        } else if (captured) {
          processSpokenAnswer(captured);
        } else {
          // Silence or error without speech: no penalty, show friendly retry
          setFeedbackText(NO_SPEECH_FEEDBACK);
        }
      };

      recognition.onend = () => {
        if (sessionCounterRef.current !== currentSession) return;

        const captured = latestTranscriptRef.current.trim();
        stopAndResetRecognition();

        if (captured) {
          processSpokenAnswer(captured);
        } else {
          // Always exit listening if finished without speech
          setMicState('ready');
          setFeedbackText(NO_SPEECH_FEEDBACK);
        }
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      stopAndResetRecognition();
      setMicState('ready');
      setFeedbackText(
        'Could not access microphone. Please tap again to retry. (마이크 연결에 실패했습니다. 다시 눌러 주세요.)'
      );
    }
  };

  // Manual "Tap here to finish" control
  const handleStopListening = () => {
    const captured = latestTranscriptRef.current.trim() || recognizedText.trim();
    stopAndResetRecognition();

    if (captured) {
      processSpokenAnswer(captured);
    } else {
      // Requirement 4: manual stopping without speech must NOT count as a failed attempt
      setMicState('ready');
      setFeedbackText(NO_SPEECH_FEEDBACK);
    }
  };

  // Turn navigation
  const handleNextTurn = () => {
    cancelSpeech();
    stopAndResetRecognition();
    if (currentTurnIndex < SWEET_TALK_TURNS.length - 1) {
      setCurrentTurnIndex(prev => prev + 1);
    } else {
      setScreen('result');
    }
  };

  const handleSkipTurn = () => {
    cancelSpeech();
    stopAndResetRecognition();
    const prevTurnAttempt = turnAttempts[currentTurn.turnNumber];
    if (!prevTurnAttempt || prevTurnAttempt.attemptsHistory.length === 0) {
      setTurnAttempts(prev => ({
        ...prev,
        [currentTurn.turnNumber]: {
          turnNumber: currentTurn.turnNumber,
          spokenAttemptsCount: 0,
          attemptsHistory: [],
          isSuccess: false,
          isSkipped: true,
          currentFeedback: 'Skipped (건너뜀)',
          recognizedText: '',
        },
      }));
    }

    if (currentTurnIndex < SWEET_TALK_TURNS.length - 1) {
      setCurrentTurnIndex(prev => prev + 1);
    } else {
      setScreen('result');
    }
  };

  const handleTryAgain = () => {
    cancelSpeech();
    stopAndResetRecognition();
    setMicState('ready');
    setRecognizedText('');
    setFeedbackText('');
    latestTranscriptRef.current = '';
  };

  const handlePracticeAgain = () => {
    cancelSpeech();
    stopAndResetRecognition();
    setTurnAttempts({});
    setCurrentTurnIndex(0);
    setScreen('practice');
  };

  const handleBackToStart = () => {
    cancelSpeech();
    stopAndResetRecognition();
    setTurnAttempts({});
    setCurrentTurnIndex(0);
    setScreen('start');
  };

  // Calculate participation stars according to Section 6 PRD rules:
  // ★: Reached result screen (completed visit)
  // ★★: Made at least one non-empty spoken attempt on ALL 5 turns
  // ★★★: Made spoken attempt on all 5 turns AND voluntarily made an additional spoken attempt on at least 1 turn
  const calculateStars = (): { stars: number; title: string; subtitle: string } => {
    const totalTurns = SWEET_TALK_TURNS.length;
    let spokeAllTurns = true;
    let hasExtraAttempt = false;

    for (let i = 1; i <= totalTurns; i++) {
      const attempt = turnAttempts[i];
      if (!attempt || attempt.attemptsHistory.length === 0) {
        spokeAllTurns = false;
      } else {
        if (attempt.attemptsHistory.length >= 2) {
          hasExtraAttempt = true;
        }
      }
    }

    if (spokeAllTurns && hasExtraAttempt) {
      return {
        stars: 3,
        title: 'You spoke in every turn and practiced again!',
        subtitle: '모든 문장을 말하고 다시 연습했어요! 대단해요!',
      };
    } else if (spokeAllTurns) {
      return {
        stars: 2,
        title: 'You spoke in every turn!',
        subtitle: '모든 문장에서 씩씩하게 말했어요! 멋져요!',
      };
    } else {
      return {
        stars: 1,
        title: 'You finished your visit!',
        subtitle: '아이스크림 주문 연습을 마쳤어요! 잘했어요!',
      };
    }
  };

  // Highlight keywords in target sentence for CEFR A1 visual clarity
  const renderHighlightedTarget = (sentence: string) => {
    if (sentence === 'An ice cream, please.') {
      return (
        <>
          An{' '}
          <span className="text-pink-600 font-extrabold underline decoration-pink-400 decoration-4 underline-offset-4">
            ice cream
          </span>
          , please.
        </>
      );
    }
    if (sentence === 'Chocolate, please.') {
      return (
        <>
          <span className="text-pink-600 font-extrabold underline decoration-pink-400 decoration-4 underline-offset-4">
            Chocolate
          </span>
          , please.
        </>
      );
    }
    if (sentence === 'A cone, please.') {
      return (
        <>
          A{' '}
          <span className="text-pink-600 font-extrabold underline decoration-pink-400 decoration-4 underline-offset-4">
            cone
          </span>
          , please.
        </>
      );
    }
    if (sentence === 'Two scoops, please.') {
      return (
        <>
          <span className="text-pink-600 font-extrabold underline decoration-pink-400 decoration-4 underline-offset-4">
            Two scoops
          </span>
          , please.
        </>
      );
    }
    if (sentence === 'No, thank you.') {
      return (
        <>
          <span className="text-pink-600 font-extrabold underline decoration-pink-400 decoration-4 underline-offset-4">
            No, thank
          </span>{' '}
          you.
        </>
      );
    }
    return sentence;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#FFFBF5] text-[#3E2723] min-h-[92vh] flex flex-col justify-between shadow-2xl rounded-3xl overflow-hidden border border-[#F3E7DC] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* ------------------------------------------------------------------ */}
      {/* SCREEN 1: START SCREEN */}
      {/* ------------------------------------------------------------------ */}
      {screen === 'start' && (
        <div className="p-6 flex flex-col justify-between flex-1 animate-fadeIn">
          {/* Top Header */}
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6EADB] text-[#795548] text-xs font-bold tracking-wide uppercase shadow-sm">
              <span>🍦</span> LEVEL 1 ROLEPLAY <span>🟢</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#3E2723] mt-2 tracking-tight flex items-center justify-center gap-1.5">
              Sweet Talk! <span className="text-[#FFB300]">✨</span>
            </h1>
            <p className="text-sm font-semibold text-[#8D6E63] mt-0.5">
              Ice Cream Shop <span className="text-xs font-normal">(아이스크림 가게)</span>
            </p>

            {/* Coco Illustration Hero (Original storybook SVG, no interface text) */}
            <div className="relative mt-4 mx-auto w-full max-w-[340px]">
              <CocoAvatar size="hero" />
              <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-sm border border-pink-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                  😊
                </div>
                <div className="text-left text-xs leading-tight">
                  <p className="font-bold text-[#3E2723]">Hi! I'm Coco. What would you like?</p>
                  <p className="text-[#8D6E63] text-[11px]">안녕! 코코예요. 어떤 맛을 좋아하나요?</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Guide */}
          <div className="mt-4 text-center">
            <h2 className="text-lg font-extrabold text-[#3E2723]">
              Order an ice cream in 5 easy steps!
            </h2>
            <p className="text-xs text-[#8D6E63] mt-0.5">다섯 단계로 아이스크림 주문을 연습해요.</p>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-3 gap-2.5 mt-3">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#F3E7DC] flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <Volume2 size={20} />
                </div>
                <span className="text-xs font-bold text-[#3E2723]">1. Listen</span>
                <span className="text-[10px] text-[#8D6E63]">잘 듣고</span>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#F3E7DC] flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center mb-1">
                  <Mic size={20} />
                </div>
                <span className="text-xs font-bold text-[#3E2723]">2. Speak</span>
                <span className="text-[10px] text-[#8D6E63]">따라 말하고</span>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-[#F3E7DC] flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
                  <RotateCcw size={20} />
                </div>
                <span className="text-xs font-bold text-[#3E2723]">3. Repeat</span>
                <span className="text-[10px] text-[#8D6E63]">자유롭게!</span>
              </div>
            </div>

            {/* Encouragement Card */}
            <div className="mt-3 bg-[#FFF3E8] border border-[#FFE0C4] rounded-2xl p-2.5 text-center flex items-center justify-center gap-2">
              <span className="text-amber-600">🧡</span>
              <div className="text-left text-xs leading-snug">
                <p className="font-bold text-[#5D4037]">Take your time. You can try again!</p>
                <p className="text-[11px] text-[#8D6E63]">틀려도 괜찮아요! 언제든 다시 말해볼 수 있어요 🍦</p>
              </div>
            </div>
          </div>

          {/* Bottom Actions & Privacy Notice */}
          <div className="mt-4 pt-2 space-y-3">
            {browserNotice && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-[11px] text-amber-800 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>{browserNotice}</span>
              </div>
            )}

            <button
              onClick={() => setScreen('practice')}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#FF5B85] to-[#FF4081] hover:from-[#f04b77] hover:to-[#e73072] text-white font-extrabold rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 text-base transition-transform active:scale-[0.98]"
            >
              <span>Start Practice / 연습 시작하기</span>
              <ArrowRight size={20} />
            </button>

            {/* Required PRD Privacy Notice */}
            <div className="bg-white/80 rounded-xl p-2.5 border border-[#F3E7DC] text-[11px] text-[#8D6E63] flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <p className="font-semibold text-[#5D4037]">
                  Your voice is processed to turn it into text and not recorded or saved.
                </p>
                <p className="text-[10px] text-[#A1887F] mt-0.5">
                  앱은 음성 녹음을 저장하거나 별도로 업로드하지 않아요. 브라우저의 음성 인식 서비스가 음성을 처리할 수 있어요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SCREEN 2: PRACTICE SCREEN */}
      {/* ------------------------------------------------------------------ */}
      {screen === 'practice' && (
        <div className="p-5 flex flex-col justify-between flex-1 animate-fadeIn">
          {/* Top Progress Bar & Badge */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#8D6E63]">
              <div className="flex items-center gap-1.5">
                <span>🍦</span>
                <span>Step {currentTurn.turnNumber} of 5</span>
              </div>
              <span className="bg-[#FFF3E8] text-[#D84315] px-2.5 py-0.5 rounded-full border border-[#FFCCBC]">
                {currentTurn.scoopBadge}
              </span>
            </div>

            {/* 5-step Segmented Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5 mt-2">
              {SWEET_TALK_TURNS.map((t, idx) => (
                <div
                  key={t.turnNumber}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx < currentTurnIndex
                      ? 'bg-emerald-400'
                      : idx === currentTurnIndex
                      ? 'bg-pink-500 ring-2 ring-pink-300'
                      : 'bg-[#EFE6DC]'
                  }`}
                />
              ))}
            </div>

            {/* Partner Coco's Question Bubble */}
            <div className="mt-3 bg-white rounded-3xl p-3.5 shadow-sm border border-[#F3E7DC] flex items-start gap-3">
              <div className="relative shrink-0">
                <CocoAvatar size="md" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                  🏪
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#795548]">Coco (코코)</span>
                  <button
                    onClick={handlePlayPartnerPrompt}
                    disabled={isPlayingAudio || micState === 'listening'}
                    className="w-8 h-8 rounded-full bg-[#FFF3E8] hover:bg-[#FFE0C4] text-[#D84315] flex items-center justify-center transition-colors disabled:opacity-50"
                    title="Listen to Coco's question"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <p className="text-sm font-extrabold text-[#3E2723] mt-0.5">
                  "{currentTurn.partnerPromptEn}"
                </p>
                <p className="text-xs text-[#8D6E63]">{currentTurn.partnerPromptKo}</p>
              </div>
            </div>
          </div>

          {/* Middle: Student Target Sentence Card */}
          <div className="my-3 bg-white rounded-3xl p-5 shadow-sm border border-[#F3E7DC] text-center">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-pink-50 text-pink-600 text-xs font-bold mb-2">
              <span>🗣️</span> Your Turn to Say
            </div>

            {/* Target sentence (Planned size 30-36px as per PRD) */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3E2723] leading-snug tracking-tight">
              {renderHighlightedTarget(currentTurn.targetSentenceEn)}
            </h2>
            <p className="text-sm font-medium text-[#8D6E63] mt-1.5">
              {currentTurn.targetSentenceKo}
            </p>

            {/* Audio Controls: Listen (0.9x rate) & Slow (0.7x rate) */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => handlePlayTarget(NORMAL_AUDIO_RATE)}
                disabled={isPlayingAudio || micState === 'listening'}
                className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-xs rounded-full flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 disabled:opacity-40"
              >
                <Volume2 size={16} className="text-emerald-600" />
                <span>Listen / 듣기</span>
              </button>
              <button
                onClick={() => handlePlayTarget(SLOW_AUDIO_RATE)}
                disabled={isPlayingAudio || micState === 'listening'}
                className="px-4 py-2 bg-[#FFE0B2] hover:bg-[#FFCC80] text-[#E65100] font-extrabold text-xs rounded-full flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 disabled:opacity-40"
              >
                <span>🐾</span>
                <span>Slow / 천천히</span>
              </button>
            </div>
          </div>

          {/* Bottom Interactive Area: Mic, Heard Panel, Feedback, Actions */}
          <div className="space-y-3">
            {/* Mic State Tracker Bar */}
            <div className="bg-white/80 rounded-full px-4 py-1.5 border border-[#F3E7DC] flex items-center justify-between text-xs font-bold text-[#8D6E63] max-w-[280px] mx-auto shadow-sm">
              <span className={micState === 'ready' ? 'text-pink-600 font-extrabold' : ''}>
                Ready <span className="font-normal text-[10px]">(준비)</span>
              </span>
              <span>›</span>
              <span className={micState === 'listening' ? 'text-pink-600 font-extrabold animate-pulse' : ''}>
                Listening <span className="font-normal text-[10px]">(듣는 중)</span>
              </span>
              <span>›</span>
              <span className={micState === 'done' ? 'text-emerald-600 font-extrabold' : ''}>
                Done <span className="font-normal text-[10px]">(완료)</span>
              </span>
            </div>

            {/* Central Big Microphone Button */}
            <div className="flex flex-col items-center justify-center pt-1">
              {micState === 'listening' ? (
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleStopListening}
                    className="relative w-20 h-20 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xl shadow-pink-500/40 ring-4 ring-pink-300 ring-offset-2 animate-pulse transition-transform active:scale-95"
                    aria-label="Stop recording"
                  >
                    <Mic size={34} />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
                    </span>
                  </button>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-extrabold text-pink-600 flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                      Listening… / 듣고 있어요
                    </p>
                    <button
                      onClick={handleStopListening}
                      className="mt-1 text-[11px] font-bold text-[#8D6E63] hover:text-[#5D4037] underline cursor-pointer"
                    >
                      Tap here to finish (말하기 끝내기)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleStartListening}
                    disabled={isPlayingAudio}
                    className="w-18 h-18 rounded-full bg-gradient-to-tr from-[#FF5B85] to-[#FF80AB] hover:from-[#f04b77] hover:to-[#ff6ba0] text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition-transform active:scale-95 disabled:opacity-40"
                    aria-label="Tap to speak"
                  >
                    <Mic size={32} />
                  </button>
                  <p className="text-xs font-bold text-[#5D4037] mt-1.5 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {micState === 'done' ? 'Tap to Speak Again / 다시 말하기' : 'Tap to speak / 눌러서 말하기'}
                  </p>
                </div>
              )}
            </div>

            {/* "I heard / 이렇게 들었어요" Panel */}
            <div className="bg-white rounded-2xl p-3 border border-[#F3E7DC] shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-[#8D6E63] mb-1">
                <span className="flex items-center gap-1">
                  <Ear size={14} className="text-amber-600" />
                  I heard / 이렇게 들었어요
                </span>
                {recognizedText && (
                  <span className="text-[10px] text-emerald-600 font-semibold">Recognized</span>
                )}
              </div>
              <p
                className={`text-sm ${
                  recognizedText
                    ? 'font-bold text-[#3E2723]'
                    : 'italic text-[#A1887F] font-normal text-xs'
                }`}
              >
                {recognizedText || 'Your words will appear here. (말한 내용이 여기에 표시돼요.)'}
              </p>
            </div>

            {/* Coco's Supportive Feedback Box */}
            {feedbackText && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 shadow-sm flex items-start gap-2.5 animate-fadeIn">
                <div className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 text-sm mt-0.5">
                  <Smile size={16} />
                </div>
                <div className="text-xs leading-relaxed flex-1">
                  <p className="font-extrabold text-emerald-950 whitespace-pre-line">{feedbackText}</p>
                </div>
              </div>
            )}

            {/* Bottom Actions: Try Again, Next, Skip */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleTryAgain}
                className="py-3 px-2 bg-[#FFE0B2] hover:bg-[#FFCC80] text-[#5D4037] font-extrabold text-xs rounded-2xl shadow-sm flex flex-col items-center justify-center transition-transform active:scale-95"
              >
                <span>Try Again</span>
                <span className="text-[10px] font-normal">다시 말하기</span>
              </button>

              <button
                onClick={handleNextTurn}
                className="py-3 px-2 bg-gradient-to-r from-[#FF5B85] to-[#FF4081] hover:from-[#f04b77] hover:to-[#e73072] text-white font-extrabold text-xs rounded-2xl shadow-md shadow-pink-500/20 flex flex-col items-center justify-center transition-transform active:scale-95"
              >
                <span>Next</span>
                <span className="text-[10px] font-normal">다음</span>
              </button>

              <button
                onClick={handleSkipTurn}
                className="py-3 px-2 bg-[#FFF3E8] hover:bg-[#FFE0C4] text-[#8D6E63] font-extrabold text-xs rounded-2xl border border-[#F3E7DC] flex flex-col items-center justify-center transition-transform active:scale-95"
              >
                <span>Skip</span>
                <span className="text-[10px] font-normal">건너뛰기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SCREEN 3: RESULT SCREEN */}
      {/* ------------------------------------------------------------------ */}
      {screen === 'result' && (
        <div className="p-6 flex flex-col justify-between flex-1 animate-fadeIn overflow-y-auto">
          {/* Top Title & Coco Mascot */}
          <div className="text-center pt-2">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF3E8] text-[#D84315] text-xs font-bold">
              <span>🍨</span> Sweet Talk! Ice Cream Shop
            </div>

            {/* Coco Avatar (Clean SVG illustration, no embedded screenshot) */}
            <div className="mt-3 flex justify-center">
              <CocoAvatar size="lg" />
            </div>

            <h1 className="text-2xl font-extrabold text-[#3E2723] mt-2">
              You finished your visit!
            </h1>
            <p className="text-xs text-[#8D6E63]">주문 연습을 마쳤어요! 참 잘했어요 🍦</p>
          </div>

          {/* Middle: Participation Stars Box */}
          {(() => {
            const reward = calculateStars();
            return (
              <div className="mt-4 bg-white rounded-3xl p-5 shadow-sm border border-[#F3E7DC] text-center">
                {/* 3 Stars */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[1, 2, 3].map(num => (
                    <Star
                      key={num}
                      size={32}
                      className={
                        num <= reward.stars
                          ? 'text-[#FFA000] fill-[#FFB300] drop-shadow-sm'
                          : 'text-stone-200'
                      }
                    />
                  ))}
                </div>

                <h2 className="text-base font-extrabold text-[#3E2723]">{reward.title}</h2>
                <p className="text-xs text-[#8D6E63] mt-0.5">{reward.subtitle}</p>

                {/* Clear Korean clarification as required by Section 6 */}
                <div className="mt-3 bg-[#FFF3E8] rounded-xl p-2.5 text-[11px] text-[#8D6E63] flex items-center justify-center gap-1.5">
                  <span className="text-pink-500 font-bold">🤎</span>
                  <span>
                    점수가 아닌 스스로 말해본 용기와 참여를 칭찬하는 별이에요!
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Today's Sweet Words List (all 5 expressions reviewed) */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#3E2723] mb-2 px-1">
              <span className="flex items-center gap-1 text-sm font-extrabold">
                <span className="text-pink-500">🍦</span> Today's Sweet Words
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                5 / 5 expressions reviewed
              </span>
            </div>

            <div className="space-y-2">
              {SWEET_TALK_TURNS.map(turn => {
                const attempt = turnAttempts[turn.turnNumber];
                const wasPracticed = attempt && attempt.attemptsHistory.length > 0;
                const wasSkipped = attempt?.isSkipped;

                return (
                  <div
                    key={turn.turnNumber}
                    className="bg-white rounded-2xl p-3 border border-[#F3E7DC] shadow-sm flex items-center justify-between gap-2"
                  >
                    <button
                      onClick={() => speakText(turn.targetSentenceEn, NORMAL_AUDIO_RATE)}
                      className="w-9 h-9 rounded-full bg-[#FFF3E8] hover:bg-[#FFE0C4] text-[#D84315] flex items-center justify-center shrink-0 transition-colors"
                      title="Listen again"
                    >
                      <Volume2 size={16} />
                    </button>

                    <div className="flex-1 text-left">
                      <p className="text-xs font-extrabold text-[#3E2723]">
                        "{turn.targetSentenceEn}"
                      </p>
                      <p className="text-[11px] text-[#8D6E63]">{turn.targetSentenceKo}</p>
                    </div>

                    <div className="shrink-0">
                      {wasPracticed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          <CheckCircle2 size={12} />
                          연습 완료
                        </span>
                      ) : wasSkipped ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-semibold">
                          건너뜀
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 text-[10px] font-bold">
                          확인함
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="mt-5 space-y-2 pt-2">
            <div className="bg-[#FFF3E8] rounded-2xl p-3 text-center border border-[#FFE0C4]">
              <p className="text-xs font-bold text-[#5D4037]">Ready to order again?</p>
              <p className="text-[11px] text-[#8D6E63]">새로운 맛으로 한 번 더 방문해 볼까요?</p>
            </div>

            <button
              onClick={handlePracticeAgain}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FF5B85] to-[#FF4081] hover:from-[#f04b77] hover:to-[#e73072] text-white font-extrabold rounded-2xl shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 text-sm transition-transform active:scale-95"
            >
              <RotateCcw size={16} />
              <span>Practice Again / 다시 연습하기</span>
            </button>

            <button
              onClick={handleBackToStart}
              className="w-full py-3 px-4 bg-white hover:bg-stone-50 text-[#8D6E63] font-bold rounded-2xl border border-[#F3E7DC] flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <Home size={16} />
              <span>Back to Start / 처음으로</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
