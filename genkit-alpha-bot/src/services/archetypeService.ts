import { Archetype } from '../data/models/Archetype';
import { fetchArchetypes } from '../data/repositories/archetypeRepository';

export const getBestArchetypeMatches = async (userGoal: string): Promise<Archetype[]> => {
  const archetypes = await fetchArchetypes();
  const matches = archetypes
    .filter((archetype) => archetype.relationshipGoals[userGoal])
    .sort((a, b) => b.relationshipGoals[userGoal].preCalculatedScore - a.relationshipGoals[userGoal].preCalculatedScore);
  return matches;
};
