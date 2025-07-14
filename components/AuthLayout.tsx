// /components/AuthLayout.tsx
import { Stack } from 'expo-router';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import SignInScreen from '../app/sign-in';
import { useAuth } from '../lib/auth/authContext';

const AuthLayout = () => {
  const { user, loading } = useAuth(); // Auth state from context
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [checkingProfile, setCheckingProfile] = useState<boolean>(true); // To check if we are still fetching profile data

  // Fetch user profile data from Firestore once the user is authenticated
  useEffect(() => {
    const checkUserProfile = async () => {
      if (user) {
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'users', user.email!);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists() && userDocSnapshot.data()?.sex && userDocSnapshot.data()?.age) {
          setProfileComplete(true); // Profile is complete
        } else {
          setProfileComplete(false); // Profile is incomplete
        }
        setCheckingProfile(false); // Done checking profile
      }
    };

    if (user && !loading) {
      checkUserProfile(); // Check profile only after authentication is resolved
    }
  }, [user, loading]);

  if (loading || checkingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // If no user is authenticated, show the SignInScreen
  if (!user) {
    return <SignInScreen />;
  }

  // If the user is authenticated but profile is incomplete, show the CollectUserDataScreen
  if (!profileComplete) {
    return (
      <Stack>
        <Stack.Screen name="CollectUserDataScreen" options={{ headerShown: false }} />
      </Stack>
    );
  }

  // If everything is good, load the main app (tabs)
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
