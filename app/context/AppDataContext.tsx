// /context/AppDataContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
  ProfileModel,
  RelationshipGoalModel,
  AppearancePhysical,
  ConfidenceAndPositivity,
  SocialProofAndTestimonials,
  ProfilePhotos,
  VoteCount,
  SumTraits,
} from '../../lib/models/ProfileModel';
import { ArchetypeModel } from '../../lib/models/ArchetypeModel';

export type { ArchetypeModel, RelationshipGoalModel, ProfilePhotos, AppearancePhysical, ConfidenceAndPositivity, SocialProofAndTestimonials, VoteCount, SumTraits }; // Export additional types

// Define the structure of the global app state
export interface AppData {
  userId?: string;
  selectedArchetypes?: ArchetypeModel[];
  selectedRelationshipGoals?: RelationshipGoalModel[];
  profilePhotos?: ProfilePhotos;
  appearancePhysical?: AppearancePhysical;
  confidenceAndPositivity?: ConfidenceAndPositivity;
  communicationStyles?: string[];
  bio?: string;
  personalityValues?: ProfileModel['personalityValues'];
  socialProofAndTestimonials?: SocialProofAndTestimonials;
  profileDetails?: {
    communicationStyles: string[];
    bio: string;
  };
  relationshipGoal?: string | null;
  visualGuidelinesDescriptions?: Record<string, string>;
  status?: 'Active' | 'Inactive';
  voteCount?: VoteCount;
  sumTraits?: SumTraits;
}

// Create the AppData context with default values
const AppDataContext = createContext<{
  appData: AppData;
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
} | undefined>(undefined);

// Provider component to wrap the entire app and provide global state
export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [appData, setAppData] = useState<AppData>({
    selectedArchetypes: [],
    selectedRelationshipGoals: [],
    profilePhotos: { primaryPhotoId: '', candidPhotoIds: [] },
    appearancePhysical: { bodyType: '', lifestyleActivities: [] },
    confidenceAndPositivity: { confidenceLevel: 3, positiveTraits: [] },
    communicationStyles: [],
    bio: '',
    personalityValues: { coreValues: [], humorImportance: 50, intellectualImportance: 50 },
    socialProofAndTestimonials: { testimonial: '', compliments: [] },
    relationshipGoal: null,
    visualGuidelinesDescriptions: {},
    status: 'Inactive',
    voteCount: { totalVotes: 0, confident: 0, nicePersonality: 0, attractive: 0 },
    sumTraits: { confident: 0, nicePersonality: 0, attractive: 0 },
  });

  return (
    <AppDataContext.Provider value={{ appData, setAppData }}>
      {children}
    </AppDataContext.Provider>
  );
};

// Custom hook to access and manage the global app data
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

// Helper function to generate visual cue descriptions
export const generateVisualCueDescription = (cue: string, traits: { trait: string; influenceWeight: number }[]) => {
  return `The visual cue '${cue}' is emphasized based on the following traits: ${traits
    .map((t) => `${t.trait} (Weight: ${t.influenceWeight})`)
    .join(', ')}.`;
};