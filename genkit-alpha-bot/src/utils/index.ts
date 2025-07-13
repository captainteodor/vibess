import { Archetype, UserDetails } from '../types/types';

/**
 * Normalizes the user's goal input to a standardized format.
 * Converts variations of the goal to either 'short-term' or 'long-term'.
 * @param goal - The user's relationship goal.
 * @returns A normalized goal string.
 */
export const normalizeGoalInput = (goal: string): string => {
  const normalizedGoal = goal.toLowerCase();
  if (normalizedGoal.includes('short')) {
    return 'short-term';
  } else if (normalizedGoal.includes('long')) {
    return 'long-term';
  }
  throw new Error(`Invalid goal provided: ${goal}`);
};

/**
 * Retrieves the best matching archetype based on the user's goal.
 * @param goal - The normalized relationship goal (e.g., 'short-term', 'long-term').
 * @param archetypes - An array of Archetypes from Firestore.
 * @returns The best matching Archetype based on the user's relationship goal.
 * @throws Error if no matching archetype is found.
 */
export const getBestArchetypeMatch = (goal: string, archetypes: Archetype[]): Archetype => {
  const normalizedGoal = normalizeGoalInput(goal);

  // Filter archetypes that match the user's goal
  const matchingArchetypes = archetypes.filter((archetype) => 
    archetype.relationshipGoals?.[normalizedGoal]
  );

  if (matchingArchetypes.length === 0) {
    throw new Error(`No matching archetypes found for goal: ${goal}`);
  }

  // Select the archetype with the highest weight for the goal
  return matchingArchetypes.reduce((best, current) => {
    const bestWeight = best.relationshipGoals[normalizedGoal]?.weight || 0;
    const currentWeight = current.relationshipGoals[normalizedGoal]?.weight || 0;
    return currentWeight > bestWeight ? current : best;
  });
};

/**
 * Ensures that the provided input is a string.
 * If the input is an array, object, or other type, it attempts to extract a string from it.
 * @param input - The value to ensure as a string.
 * @returns A string if one can be extracted, otherwise null.
 */
export const ensureString = (input: unknown): string | null => {
  if (typeof input === 'string') {
    return input;
  }
  if (Array.isArray(input)) {
    return input.find((element) => typeof element === 'string') || null;
  }
  if (typeof input === 'object' && input !== null) {
    const obj = input as Record<string, unknown>;
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        return obj[key] as string;
      }
    }
  }
  return null;
};
