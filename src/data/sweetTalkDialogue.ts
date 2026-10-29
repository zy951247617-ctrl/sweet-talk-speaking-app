import { DialogueTurn } from '../types.ts';

export const SWEET_TALK_TURNS: DialogueTurn[] = [
  {
    turnNumber: 1,
    partnerPromptEn: 'Hi! What would you like?',
    partnerPromptKo: '안녕하세요! 무엇을 드릴까요?',
    targetSentenceEn: 'An ice cream, please.',
    targetSentenceKo: '아이스크림 하나 주세요.',
    keywords: ['ice', 'cream'],
    scoopBadge: 'First Scoop! 🍦',
  },
  {
    turnNumber: 2,
    partnerPromptEn: 'What flavor would you like?',
    partnerPromptKo: '어떤 맛으로 드릴까요?',
    targetSentenceEn: 'Chocolate, please.',
    targetSentenceKo: '초콜릿 맛으로 주세요.',
    keywords: ['chocolate'],
    scoopBadge: 'Flavor Choice! 🍫',
  },
  {
    turnNumber: 3,
    partnerPromptEn: 'A cup or a cone?',
    partnerPromptKo: '컵으로 드릴까요, 콘으로 드릴까요?',
    targetSentenceEn: 'A cone, please.',
    targetSentenceKo: '콘으로 주세요.',
    keywords: ['cone'],
    scoopBadge: 'Cone Choice! 🍦',
  },
  {
    turnNumber: 4,
    partnerPromptEn: 'One scoop or two?',
    partnerPromptKo: '한 스쿱으로 드릴까요, 두 스쿱으로 드릴까요?',
    targetSentenceEn: 'Two scoops, please.',
    targetSentenceKo: '두 스쿱 주세요.',
    keywords: ['two', 'scoops'],
    scoopBadge: 'Two Scoops! 🍨',
  },
  {
    turnNumber: 5,
    partnerPromptEn: 'Anything else?',
    partnerPromptKo: '더 필요한 것이 있나요?',
    targetSentenceEn: 'No, thank you.',
    targetSentenceKo: '아니요, 괜찮아요. 감사합니다.',
    keywords: ['no', 'thank'],
    equivalentKeywords: {
      thanks: 'thank',
    },
    scoopBadge: 'Sweet Finish! ✨',
  },
];
