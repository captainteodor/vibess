import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useGoogleAuth } from '~/lib/auth/GoogleSignInContext';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const { user, signOut } = useGoogleAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-3xl font-bold mb-2">Welcome to Vibe</Text>
      {user ? (
        <>
          <Text className="text-lg text-gray-600 mb-6">
            Logged in as: {user.email}
          </Text>
          <Link href="/vote" asChild>
            <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-lg mb-4">
              <Text className="text-white font-bold text-lg">Go to Voting</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            className="bg-blue-500 py-3 px-6 rounded-lg"
            onPress={signOut}
          >
            <Text className="text-white font-bold text-lg">Sign Out</Text>
          </TouchableOpacity>
        </>
      ) : (
         <Link href="/vote" asChild>
            <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-lg mb-4">
              <Text className="text-white font-bold text-lg">Login to Start</Text>
            </TouchableOpacity>
          </Link>
      )}
    </View>
  );
}
