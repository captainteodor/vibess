// /app/_layout.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { AuthProvider } from '../lib/auth/authContext';
import { GoogleSignInProvider, useGoogleAuth } from '../lib/auth/GoogleSignInContext';
import { useColorScheme, useInitialAndroidBarSync } from '../lib/useColorScheme';
import { View, ActivityIndicator, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import SignInScreen from './sign-in';
import { useAuth } from '../lib/auth/authContext';
import AdditionalInfoScreen from './additional-info';
import { useFocusEffect } from '@react-navigation/native'; // Import `useFocusEffect`
import { AppDataProvider } from './context/AppDataContext';
import 'nativewind';
import '../global.css';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  // Log route navigation and focusing events using `useFocusEffect`
  useFocusEffect(
    React.useCallback(() => {
      console.log('Root layout is focused');
      return () => {
        console.log('Root layout is unfocused');
      };
    }, [])
  );

  // Log when RootLayout is rendered
  useEffect(() => {
    console.log('Root layout rendered');
  }, []);

  return (
    <>
      <StatusBar
        key={`root-status-bar-${colorScheme === 'dark' ? 'light' : 'dark'}`}
        style={colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <GestureHandlerRootView style={{ flex: 1 }} pointerEvents="auto">
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <AuthProvider>
              <GoogleSignInProvider>
                <AppDataProvider>
                  <AuthLayout />
                </AppDataProvider>
              </GoogleSignInProvider>
            </AuthProvider>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

const AuthLayout = () => {
  const { user, loading } = useAuth();
  const { userInfo, loading: googleLoading } = useGoogleAuth();

  const isLoading = loading || googleLoading;

  // Log loading and rendering states
  useEffect(() => {
    console.log(`AuthLayout rendered: Loading state = ${isLoading}`);
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    console.log('User not authenticated. Redirecting to SignInScreen.');
    return <SignInScreen />;
  }

  if (!userInfo?.sex || !userInfo?.age) {
    console.log('User missing additional info. Redirecting to AdditionalInfoScreen.');
    return <AdditionalInfoScreen />;
  }

  console.log('User authenticated. Rendering main stack.');
  return (
    <Stack screenOptions={{ animation: 'fade' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal',
          title: 'Settings',
        }}
      />
    </Stack>
  );
};
