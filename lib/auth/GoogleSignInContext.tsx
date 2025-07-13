import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { getFirebaseAuth, getFirebaseFirestore } from '../../config/firebase';

// Only import native Google Sign-In for non-web platforms
let GoogleSignin: any;
let statusCodes: any;

if (Platform.OS !== 'web') {
  const nativeGoogleSignIn = require('@react-native-google-signin/google-signin');
  GoogleSignin = nativeGoogleSignIn.GoogleSignin;
  statusCodes = nativeGoogleSignIn.statusCodes;
}

interface AdditionalUserData {
  sex: string;
  age: number;
}

interface GoogleAuthContextType {
  user: FirebaseUser | null;
  userInfo: AdditionalUserData | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  saveUserInfo: (additionalData: AdditionalUserData) => Promise<void>;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const GoogleSignInProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userInfo, setUserInfo] = useState<AdditionalUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = getFirebaseAuth();

  useEffect(() => {
    // Configure Google Sign-In only for native platforms
    if (Platform.OS !== 'web' && GoogleSignin) {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
        offlineAccess: true,
        scopes: ['profile', 'email'],
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
      });
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch additional user info from Firestore
        const firestore = getFirebaseFirestore();
        const userDocRef = doc(firestore, 'users', firebaseUser.email!);
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as AdditionalUserData;
          setUserInfo(userData);
        }
      } else {
        setUser(null);
        setUserInfo(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);
     
  const saveUserInfo = async (additionalData: AdditionalUserData) => {
    if (!user) {
      throw new Error('No authenticated user');
    }
    const firestore = getFirebaseFirestore();
    const userDocRef = doc(firestore, 'users', user.email!);
    
    // Save user info to Firestore
    await setDoc(userDocRef, {
      ...additionalData,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      lastUpdated: serverTimestamp(),
    }, { merge: true });
    
    setUserInfo(additionalData);
  };

  const signIn = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        // Web implementation using Firebase Auth
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({
          prompt: 'select_account'
        });

        const result = await signInWithPopup(auth, provider);
        
        // Check if user exists in Firestore
        const firestore = getFirebaseFirestore();
        const userDocRef = doc(firestore, 'users', result.user.email!);
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (!userDocSnapshot.exists()) {
          // Create user document if it doesn't exist
          await setDoc(userDocRef, {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
            createdAt: serverTimestamp(),
            lastSignIn: serverTimestamp(),
          });
        } else {
          // Update last sign in
          await setDoc(userDocRef, {
            lastSignIn: serverTimestamp(),
          }, { merge: true });
        }
        
        console.log('Web Google Sign-In successful');
      } else {
        // Native implementation
        if (!GoogleSignin) {
          throw new Error('Google Sign-In not available on this platform');
        }

        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        
        // Create Firebase credential
        const googleCredential = GoogleAuthProvider.credential(
          tokens.idToken,
          tokens.accessToken
        );
        
        // Sign in to Firebase
        const userCredential = await signInWithCredential(auth, googleCredential);
        
        // Save/update user in Firestore
        const firestore = getFirebaseFirestore();
        const userDocRef = doc(firestore, 'users', userCredential.user.email!);
        const userDocSnapshot = await getDoc(userDocRef);
        
        if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, {
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            uid: userCredential.user.uid,
            createdAt: serverTimestamp(),
            lastSignIn: serverTimestamp(),
          });
        } else {
          await setDoc(userDocRef, {
            lastSignIn: serverTimestamp(),
          }, { merge: true });
        }
        
        console.log('Native Google Sign-In successful');
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      if (Platform.OS === 'web') {
        // Handle web-specific errors
        if (error.code === 'auth/popup-closed-by-user') {
          console.log('User closed the popup window');
        } else if (error.code === 'auth/cancelled-popup-request') {
          console.log('Popup request was cancelled');
        } else {
          Alert.alert('Error', 'An error occurred during Google Sign-In.');
        }
      } else if (error.code) {
        // Handle native-specific errors
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('User cancelled the login flow.');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log('Sign-in is in progress already.');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert('Error', 'Google Play Services not available or outdated.');
        } else {
          Alert.alert('Error', 'An error occurred during Google Sign-In.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      
      // Sign out from Google on native platforms
      if (Platform.OS !== 'web' && GoogleSignin) {
        await GoogleSignin.signOut();
      }
      
      setUser(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleAuthContext.Provider value={{ user, userInfo, loading, signIn, signOut, saveUserInfo }}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = () => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleSignInProvider');
  }
  return context;
};