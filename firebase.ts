// config/firebase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Dynamically import for native persistence
let getReactNativePersistence: any;
if (Platform.OS !== 'web') {
  getReactNativePersistence = require('firebase/auth').getReactNativePersistence;
}

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
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Eagerly initialize services
const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

const firestore = getFirestore(app, "myvibedb");
const storage = getStorage(app);
const analytics = Platform.OS === 'web' ? getAnalytics(app) : null;

// Export the initialized services directly
export const getFirebaseAuth = () => auth;
export const getFirebaseFirestore = () => firestore;
export const getFirebaseStorage = () => storage;
export const getFirebaseAnalytics = () => analytics;
export const firebaseApp = app;
