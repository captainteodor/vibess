import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { getFirestore, doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/auth/authContext'; // Use the useAuth hook for user data
import { useRouter, useRootNavigationState } from 'expo-router'; // Use router and root navigation state

const CollectUserDataScreen = () => {
  const { user } = useAuth(); // Get the authenticated user's data
  const router = useRouter(); // Router for navigation
  const rootNavigationState = useRootNavigationState(); // Track root navigation state
  const [sex, setSex] = useState<string>(''); // State for sex
  const [age, setAge] = useState<string>(''); // State for age
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleSexSelection = (selectedSex: string) => {
    setSex(selectedSex);
  };

  const handleSubmit = async () => {
    if (!sex || !age || isNaN(Number(age))) {
      Alert.alert('Error', 'Please fill out all fields correctly.');
      return;
    }

    try {
      setLoading(true); // Start loading indicator
      const firestore = getFirestore();
      const userEmail = user?.email; // Get user's email from the useAuth context

      if (!userEmail) {
        Alert.alert('Error', 'User email not available. Please log in again.');
        setLoading(false);
        return;
      }

      const userDocRef = doc(firestore, 'users', userEmail); // Use user's email from session as document ID

      // Check if the user document exists
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        console.log("User document does not exist, creating new document...");
        await setDoc(userDocRef, {
          email: userEmail,
          lastLogin: serverTimestamp(),
        });
        console.log("User document created in Firestore.");
      }

      // Update the document with additional fields
      await updateDoc(userDocRef, {
        sex,
        age: parseInt(age, 10), // Convert age to a number
        lastLogin: serverTimestamp(),
      });

      Alert.alert('Success', 'Your profile has been updated');

      // Ensure the navigation system is ready before redirecting
      if (rootNavigationState?.key) {
        router.replace('/'); // Redirect to the main screen
      } else {
        console.log("Navigation not ready, waiting for navigation state...");
      }
      
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    } finally {
      setLoading(false); // Stop loading once done
    }
  };

  if (!rootNavigationState?.key) {
    return null; // Ensure navigation is ready before rendering
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, sex === 'Male' && styles.buttonSelected]}
          onPress={() => handleSexSelection('Male')}
        >
          <Text style={styles.buttonText}>Male</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, sex === 'Female' && styles.buttonSelected]}
          onPress={() => handleSexSelection('Female')}
        >
          <Text style={styles.buttonText}>Female</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Save Details</Text>}
      </TouchableOpacity>
    </View>
  );
};

// Styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonSelected: {
    backgroundColor: '#0782F9',
  },
  buttonText: {
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#0782F9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CollectUserDataScreen;
