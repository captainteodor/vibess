// config/firebase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { Database, getDatabase } from 'firebase/database';
import {
  Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Dynamically import for native
let getReactNativePersistence: any;
if (Platform.OS !== 'web') {
  getReactNativePersistence = require('firebase/auth').getReactNativePersistence;
}

// IMPORTANT: Update these values from Firebase Console -> Project Settings -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyCrRJvywxlCBBqAEZz1vt5wrcr0rSSl22c",
  authDomain: "vibe-c2a30.firebaseapp.com",
  projectId: "vibe-c2a30",
  storageBucket: "vibe-c2a30.firebasestorage.app",
  messagingSenderId: "409680446243",
  appId: "1:409680446243:web:fdaa5934a96c5afd6a0296",
  measurementId: "G-6JH4E7Y922"
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
let analytics: Analytics | null = null;

export const getFirebaseAuth = () => {
  if (!auth) {
    if (Platform.OS === 'web') {
      auth = getAuth(firebaseApp); // Use getAuth for web
    } else {
      // For React Native, use AsyncStorage for persistence
      auth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    }
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
    const dbName = "myvibedb";
    try {
      // Only use persistent cache on web
      if (Platform.OS === 'web') {
        firestore = initializeFirestore(firebaseApp, {
          localCache: persistentLocalCache({
            tabManager: persistentSingleTabManager({})
          })
        }, dbName);
      } else {
        firestore = getFirestore(firebaseApp, dbName);
      }
    } catch (error) {
      console.error("Firestore initialization failed:", error);
      // Fallback to default firestore if persistence fails
      firestore = getFirestore(firebaseApp, dbName);
    }
  }
  return firestore;
};

export const getFirebaseStorage = () => {
  if (!storage) {
    storage = getStorage(firebaseApp);
  }
  return storage;
};

export const initializeFirebaseAnalytics = async () => {
  // Only initialize analytics on web
  if (Platform.OS !== 'web') {
    console.log('Analytics is only supported on web platform');
    return null;
  }

  if (analytics) return analytics; // Return existing instance if already initialized

  try {
    const isAnalyticsSupported = await isSupported();
    if (isAnalyticsSupported) {
      analytics = getAnalytics(firebaseApp);
      console.log('Firebase Analytics initialized successfully');
      return analytics;
    } else {
      console.warn('Firebase Analytics is not supported in this environment');
      return null;
    }
  } catch (error) {
    console.warn('Firebase Analytics initialization error:', error);
    return null;
  }
};

export { firebaseApp };
