// src/config/firebase.ts

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'your-fallback-api-key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your-fallback-auth-domain',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-fallback-project-id',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your-fallback-storage-bucket',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your-fallback-messaging-sender-id',
  appId: process.env.FIREBASE_APP_ID || 'your-fallback-app-id',
};

// Initialize Firebase App
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// Lazy-initialized services
let auth: Auth;
let database: Database;
let firestore: Firestore;
let storage: FirebaseStorage;

export const getFirebaseAuth = () => {
  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
};

export const getFirebaseDatabase = () => {
  if (!database) {
    database = getDatabase(firebaseApp);
  }
  return database;
};

export const getFirebaseFirestore = () => {
  if (!firestore) {
    firestore = getFirestore(firebaseApp);
  }
  return firestore;
};

export const getFirebaseStorage = () => {
  if (!storage) {
    storage = getStorage(firebaseApp);
  }
  return storage;
};

export { firebaseApp };
