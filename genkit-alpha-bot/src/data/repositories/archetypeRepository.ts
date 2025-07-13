// data/repositories/archetypeRepository.ts

import { getDocs, getDoc, doc, collection } from 'firebase/firestore';
import { getFirebaseFirestore } from '../../config/firebase';
import { Archetype } from '../models/Archetype';
import { getCachedArchetypes, setCachedArchetypes } from '../../cache/archetypeCache';

/**
 * Fetches all archetypes from Firestore with caching.
 * @returns An array of Archetype objects.
 */
export const fetchArchetypes = async (): Promise<Archetype[]> => {
  const cachedArchetypes = getCachedArchetypes();
  if (cachedArchetypes) return cachedArchetypes;

  const firestore = getFirebaseFirestore();
  const snapshot = await getDocs(collection(firestore, 'archetypes'));
  const archetypes: Archetype[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Archetype));

  setCachedArchetypes(archetypes);
  return archetypes;
};

/**
 * Fetches a specific archetype by its ID.
 * @param archetypeId - The ID of the archetype to retrieve.
 * @returns An Archetype object or null if not found.
 */
export const fetchArchetypeById = async (archetypeId: string): Promise<Archetype | null> => {
  try {
    const firestore = getFirebaseFirestore();
    const archetypeDocRef = doc(firestore, 'archetypes', archetypeId);
    const archetypeDoc = await getDoc(archetypeDocRef);

    if (!archetypeDoc.exists()) {
      console.warn(`Archetype with ID ${archetypeId} not found.`);
      return null;
    }

    return {
      id: archetypeDoc.id,
      ...archetypeDoc.data(),
    } as Archetype;
  } catch (error) {
    console.error(`Error fetching archetype by ID ${archetypeId}:`, error);
    return null;
  }
};
