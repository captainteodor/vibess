// /lib/services/PhotoService.ts
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  Firestore,
  DocumentData,
  doc,
  getDoc,
  setDoc,
  orderBy,
  DocumentSnapshot, 
  updateDoc
} from 'firebase/firestore';
import { PhotoModel, fromFirestoreData } from '../models/PhotoModel';
import { UserModel, fromFirestoreUserData } from '../models/UserModel'; // Import UserModel

/**
 * PhotoService class responsible for interacting with Firestore to fetch and update photo data.
 */
export class PhotoService {
  private db: Firestore;

  constructor(firestoreInstance: Firestore) {
    this.db = firestoreInstance;
  }

  /**
   * Fetches photos for a specific user.
   *
   * @param userEmail - The email of the user to fetch photos for.
   * @returns A promise that resolves to an array of PhotoModel objects.
   */
  public async getPhotosByUser(userEmail: string): Promise<PhotoModel[]> {
    try {
      const photoCollectionRef = collection(this.db, 'photos');
      const photoQuery = query(photoCollectionRef, where('userEmail', '==', userEmail));
      const photoSnapshot = await getDocs(photoQuery);

      const photos: PhotoModel[] = [];
      photoSnapshot.forEach((doc) => {
        const photoData = doc.data();
        const photo = fromFirestoreData(photoData, doc.id);
        if (photo) {
          photos.push(photo);
        }
      });

      return photos;
    } catch (error) {
      console.error('Error fetching photos by user email:', error);
      throw error;
    }
  }

  /**
   * Fetches active photos prioritizing those with fewer votes and shuffling the results.
   *
   * @param lastVisible - The last visible document snapshot from the previous query (for pagination).
   * @param pageSize - The number of photos to fetch per page.
   * @returns A promise that resolves to an object containing an array of PhotoModel objects and the last visible document.
   */
  public async getActivePhotos(
    lastVisible: DocumentSnapshot | null = null,
    pageSize: number = 10
  ): Promise<{ photos: PhotoModel[], lastVisible: DocumentSnapshot | null }> {
    try {
      const photoCollectionRef = collection(this.db, 'photos');
      let activeQuery = query(
        photoCollectionRef,
        where('status', '==', 'Active'),
        orderBy('voteCount.totalVotes', 'asc'), // Prioritize photos with fewer votes
        limit(pageSize)
      );
  
      // If we have a last visible document, start after it for the next page
      if (lastVisible) {
        activeQuery = query(
          photoCollectionRef,
          where('status', '==', 'Active'),
          orderBy('voteCount.totalVotes', 'asc'),
          startAfter(lastVisible),
          limit(pageSize)
        );
      }
  
      const photoSnapshot = await getDocs(activeQuery);
      const photos: PhotoModel[] = [];
      let newLastVisible: DocumentSnapshot | null = null;
  
      photoSnapshot.forEach((doc) => {
        const photoData = doc.data();
        const photo = fromFirestoreData(photoData, doc.id);
        if (photo) {
          photos.push(photo);
        }
      });
  
      // Set the last visible document for pagination
      if (!photoSnapshot.empty) {
        newLastVisible = photoSnapshot.docs[photoSnapshot.docs.length - 1];
      }
  
      return { photos, lastVisible: newLastVisible };
    } catch (error) {
      console.error('Error fetching active photos with pagination:', error);
      throw error;
    }
  }
  
  /**
   * Shuffles an array in place and returns the shuffled array.
   *
   * @param array - The array to shuffle.
   * @returns The shuffled array.
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public async updatePhotoStatus(photoId: string, newStatus: string): Promise<void> {
    try {
      const photoDocRef = doc(this.db, 'photos', photoId);
      await updateDoc(photoDocRef, { status: newStatus });
      console.log(`Photo status updated to ${newStatus}`);
    } catch (error) {
      console.error(`Error updating photo status for ${photoId}:`, error);
      throw error;
    }
  }


  /**
   * Fetches a specific photo by its ID.
   *
   * @param photoId - The ID of the photo to fetch.
   * @returns A promise that resolves to a PhotoModel object or null if not found.
   */
  public async getPhotoById(photoId: string): Promise<PhotoModel | null> {
    try {
      const photoCollectionRef = collection(this.db, 'photos');
      const photoDocRef = doc(photoCollectionRef, photoId);
      const photoDocSnapshot = await getDoc(photoDocRef);

      if (photoDocSnapshot.exists()) {
        const photoData = photoDocSnapshot.data();
        return fromFirestoreData(photoData, photoDocSnapshot.id);
      } else {
        console.warn(`Photo with ID ${photoId} not found.`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching photo by ID ${photoId}:`, error);
      throw error;
    }
  }

  /**
   * Fetches photos excluding those uploaded by the specified user.
   *
   * @param userEmail - The email of the user whose photos should be excluded.
   * @returns A promise that resolves to an array of PhotoModel objects.
   */
  public async getFilteredPhotos(userEmail: string): Promise<PhotoModel[]> {
    try {
      const photoCollectionRef = collection(this.db, 'photos');
      const photoQuery = query(
        photoCollectionRef,
        where('status', '==', 'Active'),
        where('userEmail', '!=', userEmail)
      );
      const photoSnapshot = await getDocs(photoQuery);

      const photos: PhotoModel[] = [];
      photoSnapshot.forEach((doc) => {
        const photoData = doc.data();
        const photo = fromFirestoreData(photoData, doc.id);
        if (photo) {
          photos.push(photo);
        }
      });

      return photos;
    } catch (error) {
      console.error('Error fetching filtered photos:', error);
      throw error;
    }
  }

  /**
   * Fetches IDs of photos that the user has already voted on.
   *
   * @param userEmail - The email of the user whose voted photos should be fetched.
   * @returns A promise that resolves to an array of photo IDs.
   */
  public async getUserVotedPhotos(userEmail: string): Promise<string[]> {
    try {
      const votesCollection = collection(this.db, 'votes', userEmail, 'photosVoted');
      const votedSnapshot = await getDocs(votesCollection);

      return votedSnapshot.docs.map(doc => doc.id);
    } catch (error) {
      console.error('Error fetching user voted photos:', error);
      return [];
    }
  }

  /**
   * Submits a user's vote and feedback for a specific photo.
   *
   * @param photoId - The ID of the photo being voted on.
   * @param userEmail - The email of the user submitting the vote.
   * @param traits - An object containing the user's votes for different criteria.
   * @param feedbackTags - An array of feedback tags provided by the user.
   * @returns A promise that resolves when the vote and feedback are successfully submitted.
   */
  public async submitUserVote(
    photoId: string,
    userEmail: string,
    traits: { attractive: number; nicePersonality: number; confident: number; },
    feedbackTags: string[]
  ): Promise<void> {
    try {
      // 1. Save the user's vote under the photo's votes subcollection
      const photoVoteRef = doc(this.db, 'photos', photoId, 'votes', userEmail);
      await setDoc(photoVoteRef, {
        traits,
        feedbackTags,
        timestamp: new Date()
      }, { merge: true }); // Use merge to avoid overwriting
  
      // 2. Save the user's vote under the user's votes subcollection
      const userVoteRef = doc(this.db, 'users', userEmail, 'votes', photoId);
      await setDoc(userVoteRef, {
        photoId,
        traits,
        feedbackTags,
        timestamp: new Date()
      }, { merge: true }); // Use merge to avoid overwriting
  
      console.log(`Votes and feedback submitted successfully for photo ID: ${photoId}`);
    } catch (error) {
      console.error('Error submitting votes and feedback:', error);
      throw error;
    }
  }
  
  

   /**
   * Fetch user credits by email.
   * @param userEmail - The email of the user.
   * @returns A promise that resolves to the user's credits.
   */
   public async getUserCredits(userEmail: string): Promise<{ credits: number } | null> {
    try {
      const userDocRef = doc(this.db, 'users', userEmail);  // Assuming your users are stored in the 'users' collection
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return { credits: userData?.credits || 0 };
      } else {
        console.warn(`User document for ${userEmail} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user credits:', error);
      throw error;
    }
  }

  /**
   * Fetch user credits by email.
   * @param userEmail - The email of the user.
   * @returns A promise that resolves to the UserModel.
   */
  public async getUserByEmail(userEmail: string): Promise<UserModel | null> {
    try {
      const userDocRef = doc(this.db, 'users', userEmail);  // Assuming your users are stored in the 'users' collection
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return fromFirestoreUserData(userData, userDoc.id);
      } else {
        console.warn(`User document for ${userEmail} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  
  }

}







