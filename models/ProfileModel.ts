import { ArchetypeModel, RelationshipGoalModel } from './ArchetypeModel';

export interface ProfilePhotos {
  primaryPhotoId: string;       // Firestore document ID for the primary photo
  candidPhotoIds: string[];     // Firestore document IDs for candid photos
  primaryPhotoURL?: string;     // Retrieved URL for the primary photo
  candidPhotoURLs?: string[];   // Retrieved URLs for the candid photos
}

export interface AppearancePhysical {
  bodyType: string;
  lifestyleActivities: string[];
}

export interface ConfidenceAndPositivity {
  confidenceLevel: number; // Typically between 1 to 5 or similar range
  positiveTraits: string[];
}

export interface SocialProofAndTestimonials {
  testimonial: string;
  compliments: string[];
}

export interface VoteCount {
  totalVotes: number;
  confident: number;
  nicePersonality: number;
  attractive: number;
}

export interface SumTraits {
  confident: number;
  nicePersonality: number;
  attractive: number;
}

export interface ProfileModel {
  id: string;
  userId: string; // User ID associated with this profile
  selectedArchetypes: ArchetypeModel[]; // List of selected archetypes
  selectedRelationshipGoals: RelationshipGoalModel[]; // Relationship goals chosen by the user
  profilePhotos: ProfilePhotos; // User's selected photos
  appearancePhysical: AppearancePhysical; // Physical appearance details
  confidenceAndPositivity: ConfidenceAndPositivity; // Confidence and positive traits
  personalityValues: {
    coreValues: string[];
    humorImportance: number;
    intellectualImportance: number;
  };
  communicationStyles: string[];
  bio: string; // Bio entered by the user
  socialProofAndTestimonials: SocialProofAndTestimonials; // Social proof and testimonials
  visualGuidelinesDescriptions?: Record<string, string>;
  status?: 'Active' | 'Inactive';
  voteCount?: VoteCount; // Add voteCount property
  sumTraits?: SumTraits; // Add sumTraits property
}

// Export `RelationshipGoalModel` to resolve the issue in `AppDataContext.tsx`
export type { RelationshipGoalModel };
