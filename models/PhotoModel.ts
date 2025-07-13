// /lib/models/PhotoModel.ts

import { Timestamp } from 'firebase/firestore';

// Define the structure of a vote
export interface Vote {
  userEmail: string;
  feedbackTags: string[];
  timestamp: Date; // Firestore Timestamp converted to JavaScript Date
  traits: {
    attractive: number;
    nicePersonality: number;
    confident: number;
  };
}

// Define the structure for the photo model
export interface PhotoModel {
  id: string; // Unique identifier
  photoName: string;
  photoGender: string;
  photoAgeRange: string;
  targetGender: string;
  targetAgeRange: string;
  imageURL: string;
  userEmail: string;
  status: string; // Status (inactive, active, completed)
  sumTraits: {
    attractive: number;
    nicePersonality: number;
    confident: number;
  };
  voteCount: {
    attractive: number;
    nicePersonality: number;
    confident: number;
    totalVotes: number; // Extract total votes from voteCount
  };
  feedbackTags?: string[]; // Array of feedback comments, optional
  votes?: Vote[]; // Array of votes associated with the photo, optional
  timestamp: Date; // Firestore Timestamp converted to JavaScript Date
}

// Method to create PhotoModel from Firestore data
export const fromFirestoreData = (data: any, docID: string): PhotoModel | null => {
  if (
    data.photoName &&
    data.photoGender &&
    data.photoAgeRange &&
    data.targetGender &&
    data.targetAgeRange &&
    data.imageURL &&
    data.userEmail &&
    data.status &&
    data.timestamp // Ensure timestamp is present
  ) {
    let timestamp: Date;

    if (data.timestamp instanceof Timestamp) {
      // If the timestamp is a Firestore Timestamp object, convert it to a JavaScript Date
      timestamp = data.timestamp.toDate();
    } else if (typeof data.timestamp === 'number') {
      // If the timestamp is a floating-point number, split into seconds and nanoseconds
      const seconds = Math.floor(data.timestamp);
      const nanoseconds = Math.round((data.timestamp - seconds) * 1e9);
      timestamp = new Timestamp(seconds, nanoseconds).toDate();
    } else if (data.timestamp._seconds && data.timestamp._nanoseconds) {
      // If the timestamp is in _seconds and _nanoseconds format
      timestamp = new Timestamp(data.timestamp._seconds, data.timestamp._nanoseconds).toDate();
    } else {
      console.error(`Invalid timestamp format in document with ID ${docID}`);
      return null;
    }

    // Extract total votes from the voteCount subobject
    const voteCount = data.voteCount || { attractive: 0, nicePersonality: 0, confident: 0, totalVotes: 0 };
    const sumTraits = data.sumTraits || { attractive: 0, nicePersonality: 0, confident: 0 };
    const feedbackTags = data.feedbackTags || [];

    // Map the votes array if it exists
    const votes: Vote[] = data.votes
      ? Object.keys(data.votes).map((key) => ({
          userEmail: data.votes[key].userEmail,
          feedbackTags: data.votes[key].feedbackTags || [],
          timestamp: data.votes[key].timestamp instanceof Date
            ? data.votes[key].timestamp
            : new Date(data.votes[key].timestamp.seconds * 1000),
          traits: data.votes[key].traits || { attractive: 0, nicePersonality: 0, confident: 0 },
        }))
      : [];

    // Return the PhotoModel object
    return {
      id: docID,
      photoName: data.photoName,
      photoGender: data.photoGender,
      photoAgeRange: data.photoAgeRange,
      targetGender: data.targetGender,
      targetAgeRange: data.targetAgeRange,
      imageURL: data.imageURL,
      userEmail: data.userEmail,
      status: data.status,
      sumTraits: sumTraits,
      voteCount: voteCount,
      feedbackTags: feedbackTags,
      votes: votes,
      timestamp: timestamp,
    };
  } else {
    console.error(`Error: Missing or invalid field in document with ID ${docID}`);
    return null;
  }
};
