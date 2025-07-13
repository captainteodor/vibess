// constants/votingConstants.ts
import { VotingCriteria } from '../types/index';

export const VOTING_CONSTANTS = {
    CREDIT_INCREMENT: 1,
    CREDIT_DECREMENT: 1,
    BATCH_SIZE: 10,
    DEBOUNCE_DELAY: 300,
    MAX_RETRIES: 3,
    MIN_VOTE_VALUE: 1,
    MAX_VOTE_VALUE: 4,
    MODAL_ANIMATION_DURATION: 300,
} as const;

export const PHOTO_CONSTANTS = {
    BATCH_SIZE: 10,
    PREFETCH_THRESHOLD: 3,
    CACHE_SIZE: 20,
} as const;
export const TRAITS = [
  { 
    id: VotingCriteria.CONFIDENT, 
    label: "Confident", 
    emoji: "🌞", 
    gradientColors: ['#FFB74D', '#FFA726'] as string[]
  },
  { 
    id: VotingCriteria.NICE_PERSONALITY, 
    label: "Nice Personality", 
    emoji: "💖", 
    gradientColors: ['#FF80AB', '#FF4081'] as string[]
  },
  { 
    id: VotingCriteria.ATTRACTIVE, 
    label: "Attractive", 
    emoji: "✨", 
    gradientColors: ['#9575CD', '#7E57C2'] as string[]
  },
] as const;

export type Trait = {
  id: VotingCriteria;
  label: string;
  emoji: string;
  gradientColors: string[];
};
console.log('TRAITS:', TRAITS);


export const RATINGS = [
    { value: 4, label: "Very" },
    { value: 3, label: "Yes" },
    { value: 2, label: "Somewhat" },
    { value: 1, label: "No" },
] as const;
export const negativeFeedbackTags = [
    'Distracting Background',
    'Poor Lighting',
    'Blurry Image',
    'Inappropriate Content',
    'Poor Quality',
    'Bad Composition',
    'Unflattering Angle',
    'Too Much Editing',
    'Not Clear Subject',
    'Other',
] as const;
  export const feedbackTags = ['Helpful', 'Clear', 'Accurate', 'Concise'] as const;