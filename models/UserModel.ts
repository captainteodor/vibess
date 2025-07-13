import { Timestamp, Firestore } from 'firebase/firestore';

// Define the structure for the user model
export interface UserModel {
  email: string; // User's email (Firestore document ID)
  credits: number; // User's credits
  name?: string; // Optional: User's name
  profilePictureURL?: string; // Optional: User's profile picture
  createdAt?: Date; // Optional: Timestamp of when the user was created
}

// Function to create UserModel from Firestore data
export const fromFirestoreUserData = (data: any, docID: string): UserModel | null => {
  if (data && data.email && data.credits !== undefined) {
    let createdAt: Date | undefined;

    if (data.createdAt instanceof Timestamp) {
      createdAt = data.createdAt.toDate();
    }

    return {
      email: docID, // Assuming the document ID is the user's email
      credits: data.credits,
      name: data.name || '',
      profilePictureURL: data.profilePictureURL || '',
      createdAt: createdAt || undefined,
    };
  } else {
    console.error(`Invalid user data for document with ID ${docID}`);
    return null;
  }
};
