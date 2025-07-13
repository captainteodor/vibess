// src/types/types.ts

export type Archetype = {
    id: string;
    name: string;
    description: string;
    traits: { traitId: string; weight: number; demographicAdjustment?: { ageUnder30?: number; ageOver30?: number } }[];
    visualCues: { name: string; category: string }[];
    relationshipGoals: { [key: string]: { weight: number; preCalculatedScore: number } };
  };
  
  export type UserDetails = {
    firstName?: string;
    age?: number;
    sex?: string;
    goal?: string;
    style?: string;
  };
  