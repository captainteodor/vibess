// data/repositories/userRepository.ts

import { getDoc, doc, setDoc } from 'firebase/firestore';
import { UserDetails } from '../models/UserDetails';
import { getFirebaseAuth, getFirebaseFirestore } from '../../config/firebase'; // Assumes Firebase authentication is configured

/**
 * Fetches the user details from Firestore based on the authenticated user's email.
 * @returns The UserDetails object or null if the user is not authenticated or the document does not exist.
 */
export const fetchUserDetails = async (): Promise<UserDetails | null> => {
  try {
    const auth = getFirebaseAuth();
    const firestore = getFirebaseFirestore();
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user found.');

    const userDocRef = doc(firestore, 'users', user.email!);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      console.warn('User document does not exist in Firestore.');
      return null;
    }

    return userDocSnapshot.data() as UserDetails;
  } catch (error) {
    console.error('Failed to retrieve user details:', error);
    return null;
  }
};

/**
 * Updates the user details in Firestore.
 * @param userDetails - The new user details to set.
 * @returns A promise that resolves when the update is complete.
 */
export const updateUserDetails = async (userDetails: Partial<UserDetails>): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    const firestore = getFirebaseFirestore();
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user found.');

    const userDocRef = doc(firestore, 'users', user.email!);
    await setDoc(userDocRef, userDetails, { merge: true });
    console.log(`User details updated for ${user.email}`);
  } catch (error) {
    console.error('Failed to update user details:', error);
    throw error;
  }
};
