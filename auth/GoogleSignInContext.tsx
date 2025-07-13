import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleSignin,
  statusCodes,
  GetTokensResponse,
} from '@react-native-google-signin/google-signin';
import { Platform, Alert } from 'react-native';
import { getFirebaseAuth, getFirebaseFirestore } from '../../config/firebase';
import {
  GoogleAuthProvider,
  signInWithCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';  // Import Firestore methods

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
    // Correctly configure Google Sign-In using environment variables
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB, // Use the env variable
      offlineAccess: true, // for getting tokens
      scopes: ['profile', 'email'], // to request user's profile and email
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS, // for iOS
    });

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
  
    try {
      console.log('Saving user info to Firestore:', additionalData); // Log details being saved
  
      // Save the additional user info in Firestore
      await setDoc(userDocRef, {
        sex: additionalData.sex,
        age: additionalData.age,
        lastLogin: serverTimestamp(),
      }, { merge: true });
  
      // Log success
      console.log('User info successfully saved to Firestore');
      
      // Update local user info state
      setUserInfo(additionalData);
  
    } catch (error) {
      console.error('Error saving user info to Firestore:', error);
      throw error;
    }
  };  


  const signIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
  
      const tokens: GetTokensResponse = await GoogleSignin.getTokens();
      const { idToken, accessToken } = tokens;
  
      if (!idToken) {
        throw new Error('Google Sign-In failed: No ID token returned');
      }
  
      const googleCredential = GoogleAuthProvider.credential(idToken, accessToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;
  
      setUser(user);
  
      // Firestore instance and user doc setup
      const firestore = getFirebaseFirestore();
      const userDocRef = doc(firestore, 'users', user.email!);
  
      // Extract first and last names from displayName
      const displayName = user.displayName || '';
      let firstName = '';
      let lastName = '';
  
      if (displayName) {
        const nameParts = displayName.split(' ');
        firstName = nameParts[0];
        lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''; // Handle middle names too
      }
  
      // Set user info to Firestore (including firstName and lastName)
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        // If the user already exists, fetch existing additional data
        const userData = userDocSnapshot.data() as AdditionalUserData;
        setUserInfo(userData);
      } else {
        // If the user is new, save first name and last name
        const newUserInfo: AdditionalUserData & { firstName: string; lastName: string } = {
          firstName,
          lastName,
          sex: '', // Placeholder
          age: 0, // Placeholder
        };
  
        await setDoc(userDocRef, {
          firstName: newUserInfo.firstName,
          lastName: newUserInfo.lastName,
          sex: newUserInfo.sex,
          age: newUserInfo.age,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
  
        setUserInfo(newUserInfo);
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is in progress already.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available or outdated.');
      } else {
        console.error('Google Sign-In Error:', error);
        Alert.alert('Error', 'An error occurred during Google Sign-In.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      await GoogleSignin.signOut();
      setUser(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    };
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
