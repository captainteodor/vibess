import React from 'react';
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function ChatbotLayout() {
  const colorScheme = useColorScheme();
  const darkMode = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: darkMode ? "rgba(52, 46, 84, 1)" : "white",
        },
        headerTintColor: darkMode ? "white" : "black",
        headerTitleStyle: {
          fontFamily: "Quicksand_600SemiBold",
        },
      }}
    >
      <Stack.Screen name="main" options={{ title: "New Profile" }} />
    </Stack>
  );
}
