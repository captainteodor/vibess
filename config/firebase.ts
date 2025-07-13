// /config/firebase.ts

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { 
  getFirestore, 
  initializeFirestore, 
  Firestore,
  persistentLocalCache,
  persistentSingleTabManager 
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDAuRfATK7ZDkc4r7IKZbGH66ONKqGBHVc",
  authDomain: "photofeeler-b47c8.firebaseapp.com",
  projectId: "photofeeler-b47c8",
  storageBucket: "photofeeler-b47c8.appspot.com",
  messagingSenderId: "1029812079354",
  appId: "1:1029812079354:android:4371198864cc1e6aa35743",
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
    try {
      firestore = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({
          tabManager: persistentSingleTabManager({})
        })
      });
    } catch (error) {
      console.error("Firestore initialization failed:", error);
      // Fallback to default firestore if persistence fails
      firestore = getFirestore(firebaseApp);
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
  if (analytics) return analytics; // Return existing instance if already initialized

  try {
    const isAnalyticsSupported = await isSupported();
    if (isAnalyticsSupported) {
      analytics = getAnalytics(firebaseApp);
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
