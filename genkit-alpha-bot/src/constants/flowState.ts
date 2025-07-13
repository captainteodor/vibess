// /constants/flowState.ts

export enum FlowState {
  AWAITING_WELCOME = 'awaiting_welcome',
  AWAITING_ARCHETYPE = 'awaiting_archetype',
  AWAITING_SUGGESTIONS = 'awaiting_suggestions',
  AWAITING_DESCRIPTION = 'awaiting_description', // New state for describing selected archetypes
  AWAITING_PHOTOS = 'awaiting_photos',
  COMPLETED = 'completed',
  ERROR = 'error',
}
