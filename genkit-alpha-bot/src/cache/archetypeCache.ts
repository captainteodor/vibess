// cache/archetypeCache.ts

import { Archetype } from '../data/models/Archetype';
import { CACHE_DURATION } from '../constants/settings';

// Define the structure of the cache
type ArchetypeCacheData = {
  data: Archetype[] | null;
  timestamp: number;
};

// Initialize the cache with default values
let archetypeCache: ArchetypeCacheData = { data: null, timestamp: 0 };

/**
 * Retrieves cached archetypes if the cache is still valid.
 * @returns Cached archetypes or null if the cache has expired or is empty.
 */
export const getCachedArchetypes = (): Archetype[] | null => {
  const now = Date.now();
  if (archetypeCache.data && (now - archetypeCache.timestamp) < CACHE_DURATION) {
    console.log('Using cached archetypes.');
    return archetypeCache.data;
  }
  console.log('Archetype cache is empty or expired.');
  return null;
};

/**
 * Sets the archetype cache with new data.
 * @param archetypes - The list of archetypes to cache.
 */
export const setCachedArchetypes = (archetypes: Archetype[]): void => {
  archetypeCache = {
    data: archetypes,
    timestamp: Date.now(),
  };
  console.log('Archetype cache updated.');
};

/**
 * Clears the archetype cache.
 */
export const clearArchetypeCache = (): void => {
  archetypeCache = { data: null, timestamp: 0 };
  console.log('Archetype cache cleared.');
};
