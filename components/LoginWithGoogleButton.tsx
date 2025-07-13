import * as Haptics from 'expo-haptics';
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { getFirebaseAuth } from "../config/firebase"; // Using your Firebase config
import Button from "./Button";

// Conditional imports based on platform
const getGoogleSignIn = async () => {
  if (Platform.OS === 'web') {
    const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
    return { GoogleAuthProvider, signInWithPopup };
  } else {
    // For native platforms, use Firebase web SDK with redirect approach
    const { GoogleAuthProvider, signInWithRedirect, getRedirectResult } = await import('firebase/auth');
    return { GoogleAuthProvider, signInWithRedirect, getRedirectResult };
  }
};

interface GoogleSignInResult {
  user: any;
  error?: string;
}

export const LoginWithGoogleButton = () => {
  const [loading, setLoading] = useState(false);
  const auth = getFirebaseAuth(); // Using your lazy-initialized auth

  useEffect(() => {
    // Configure Google Sign-In for native platforms if needed
    if (Platform.OS !== 'web') {
      checkForRedirectResult();
    }
  }, []);

  // Check for redirect result on native platforms
  const checkForRedirectResult = async () => {
    try {
      const { getRedirectResult } = await getGoogleSignIn();
      if (getRedirectResult) {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Native Google Sign-in successful:", result.user);
          handleSignInSuccess(result.user);
        }
      }
    } catch (error) {
      console.error("Error checking redirect result:", error);
    }
  };

  const handleSignInSuccess = (user: any) => {
    console.log("Google Sign-in successful:", user);
    // Add your navigation or state update logic here
    // router.push('/dashboard') or similar
    
    // Optional: Initialize analytics after successful sign-in
    // initializeFirebaseAnalytics();
  };

  const handleSignInError = (error: any) => {
    console.error("Google Sign-in error:", error);
    // Add your error handling logic here
    // Show toast, alert, etc.
  };

  const onGoogleButtonPress = async (): Promise<GoogleSignInResult> => {
    try {
      if (Platform.OS === 'web') {
        // Web platform - use popup
        const { GoogleAuthProvider, signInWithPopup } = await getGoogleSignIn();
        const provider = new GoogleAuthProvider();
        
        // Add scopes if needed
        provider.addScope('profile');
        provider.addScope('email');

        // Custom parameters for better UX
        provider.setCustomParameters({
          prompt: 'select_account'
        });

        const result = await signInWithPopup(auth, provider);
        return { user: result.user };
        
      } else {
        // Native platforms - use redirect flow
        const { GoogleAuthProvider, signInWithRedirect } = await getGoogleSignIn();
        const provider = new GoogleAuthProvider();
        
        // Add scopes if needed
        provider.addScope('profile');
        provider.addScope('email');

        // Custom parameters for better UX
        provider.setCustomParameters({
          prompt: 'select_account'
        });

        await signInWithRedirect(auth, provider);
        // The result will be handled in useEffect after redirect
        return { user: null }; // User will be available after redirect
      }
    } catch (error: any) {
      console.error("Google Sign-in error:", error);
      return { user: null, error: error.message };
    }
  };

  const handlePress = async () => {
    setLoading(true);
    
    // Haptic feedback for native platforms
    if (Platform.OS !== 'web') {
      try {
        await Haptics.selectionAsync();
      } catch (e) {
        // Haptics might not be available in all environments
        console.log('Haptics not available');
      }
    }

    try {
      const result = await onGoogleButtonPress();
      
      if (result.error) {
        throw new Error(result.error);
      }

      if (result.user) {
        // Success for web platform
        handleSignInSuccess(result.user);
        
        if (Platform.OS !== 'web') {
          try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (e) {
            console.log('Haptics not available');
          }
        }
      } else if (Platform.OS !== 'web') {
        // For native platforms, success will be handled after redirect
        console.log('Redirecting to Google Sign-in...');
      }
      
    } catch (error: any) {
      handleSignInError(error);
      
      if (Platform.OS !== 'web') {
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch (e) {
          console.log('Haptics not available');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      isLoading={loading}
      iconSrc={require("../../assets/google-logo.png")}
      title="Continue with Google"
      style={{
        width: "100%",
      }}
      className="w-full my-10"
      onPress={handlePress}
    />
  );
};