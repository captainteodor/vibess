export interface TraitModel {
    trait: string; // Name of the trait (e.g., 'Confidence', 'Empathy')
    influenceWeight: number; // Influence weight indicating the importance of the trait
  }
  
  export interface RelationshipGoalModel {
    id: string; // Unique identifier for the relationship goal
    name: string; // Name of the relationship goal (e.g., 'Long-Term', 'Short-Term')
    relatedTraits: TraitModel[]; // Traits most relevant to achieving this goal
    description: string; // A description of the relationship goal
  }
  
  export interface ArchetypeModel {
    id: string; // Unique identifier for the archetype
    name: string; // Name of the archetype (e.g., 'Adventurer', 'Creative Visionary')
    traits: TraitModel[]; // Traits associated with the archetype
    visualCues: string[]; // Visual cues that represent the archetype's traits
    relationshipGoals: RelationshipGoalModel[]; // Relationship goals relevant to the archetype
    description: string; // Description of the archetype
  }
  