import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../lib/auth/authContext';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [layoutMounted, setLayoutMounted] = useState(false); // Add state to track layout mounting
  const router = useRouter();

  useEffect(() => {
    console.log('Layout Mounted State Set to True');
    setLayoutMounted(true); // Assume layout is mounted after this effect runs
  }, []);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (user && layoutMounted) {
        console.log('User found, checking Firestore for user profile...');
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'users', user.email!);
        const userDocSnapshot = await getDoc(userDocRef);
        console.log('User document:', userDocSnapshot.exists());

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          console.log('User Data:', userData);
          if (userData?.sex && userData?.age) {
            console.log('User Profile Complete');
            setProfileComplete(true); // Profile complete
          } else {
            console.log('User Profile Incomplete, Redirecting to CollectUserDataScreen');
            setProfileComplete(false); // Profile incomplete
            requestAnimationFrame(() => {
              router.replace('/CollectUserDataScreen'); // Redirect to complete profile
            });
          }
        } else {
          console.log('No User Profile Document Exists');
          setProfileComplete(false);
          requestAnimationFrame(() => {
            router.replace('/CollectUserDataScreen'); // Redirect to profile completion
          });
        }
        setProfileLoading(false);
      }
    };

    if (!loading && layoutMounted) {
      console.log('Auth finished loading, checking user profile...');
      checkUserProfile();
    } else {
      console.log('Still loading... or layout not mounted');
    }
  }, [user, loading, layoutMounted, router]);

  if (loading || profileLoading) {
    console.log('Auth or Profile still loading...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  if (!user && layoutMounted) {
    console.log('No user found, redirecting to sign-in...');
    requestAnimationFrame(() => {
      router.replace('/SignInScreen');
    });
    return null;
  }

  console.log('Rendering Children');
  return <>{children}</>;
};

export default AuthGuard;
