// services/userService.ts

import { getDoc, doc, setDoc } from 'firebase/firestore';
import { UserDetails } from '../data/models/UserDetails';
import { getFirebaseAuth, getFirebaseFirestore } from '../config/firebase'; // Assume `auth` is set up for authentication

/**
 * Retrieves the user details from Firestore based on the authenticated user's email.
 * @returns The UserDetails object or throws an error if not found.
 */
export const fetchUserDetails = async (): Promise<UserDetails | null> => {
  try {
    const auth = getFirebaseAuth();
    const firestore = getFirebaseFirestore();
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user found.');

    const userDocRef = doc(firestore, 'users', user.email!);
    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) throw new Error('User document does not exist in Firestore.');

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
export const updateUserDetails = async (userDetails: UserDetails): Promise<void> => {
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
