import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '~/lib/auth/authContext';
import { GoogleSignInProvider } from '~/lib/auth/GoogleSignInContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GoogleSignInProvider>
        <Stack>
          <Stack.Screen name="home" options={{ title: 'Home' }} />
          <Stack.Screen name="vote" options={{ title: 'Vote' }} />
        </Stack>
      </GoogleSignInProvider>
    </AuthProvider>
  );
}
