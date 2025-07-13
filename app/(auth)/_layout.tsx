import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  // This layout routes all screens in the (auth) group.
  // We'll hide the header for a cleaner login experience.
  return <Stack screenOptions={{ headerShown: false }} />;
}
