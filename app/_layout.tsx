import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '~/lib/auth/authContext';
import { GoogleSignInProvider } from '~/lib/auth/GoogleSignInContext';
import AuthGuard from '~/components/AuthGuard';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GoogleSignInProvider>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </AuthGuard>
      </GoogleSignInProvider>
    </AuthProvider>
  );
}
