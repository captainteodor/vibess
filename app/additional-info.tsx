import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useGoogleAuth } from '../lib/auth/GoogleSignInContext'; // Get access to Firestore update function

const AdditionalInfoScreen = () => {
  const { user, saveUserInfo } = useGoogleAuth(); 
  const [sex, setSex] = useState(''); // Sex value, either 'Male' or 'Female'
  const [age, setAge] = useState('');

  const handleSexSelection = (selectedSex: string) => {
    setSex(selectedSex);
  };

  const handleSubmit = async () => {
    if (!sex || !age) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      // Save the additional data to Firestore
      await saveUserInfo({ sex, age: parseInt(age, 10) });
    } catch (error) {
      Alert.alert('Error', 'Failed to save user info.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      {/* Sex Selection */}
      <Text style={styles.label}>Select Your Gender</Text>
      <View style={styles.sexSelector}>
        <TouchableOpacity
          style={[styles.sexButton, sex === 'Male' && styles.selectedButton]}
          onPress={() => handleSexSelection('Male')}
        >
          <Text style={[styles.sexButtonText, sex === 'Male' && styles.selectedButtonText]}>
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sexButton, sex === 'Female' && styles.selectedButton]}
          onPress={() => handleSexSelection('Female')}
        >
          <Text style={[styles.sexButtonText, sex === 'Female' && styles.selectedButtonText]}>
            Female
          </Text>
        </TouchableOpacity>
      </View>

      {/* Age Input */}
      <Text style={styles.label}>Enter Your Age</Text>
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#999"
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0782F9',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  sexSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  sexButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectedButton: {
    backgroundColor: '#0782F9',
  },
  sexButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#0782F9',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AdditionalInfoScreen;
