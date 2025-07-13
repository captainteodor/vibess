import { Redirect } from 'expo-router';
import React from 'react';

// This screen will never be seen.
// It simply redirects the user to the first tab of the navigator.
export default function TabsIndex() {
  return <Redirect href="/(tabs)/vote" />;
}
