export interface Archetype {
    id: string;
    name: string;
    description: string;
    relationshipGoals: {
      [key: string]: {
        preCalculatedScore: number;
      };
    };
    traits: string[];
  }
  