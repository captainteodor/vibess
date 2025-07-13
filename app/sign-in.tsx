import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getFirebaseAuth } from '../config/firebase'; // Adjust the path as necessary
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useGoogleAuth } from '../lib/auth/GoogleSignInContext'; // Google Sign-In context

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getFirebaseAuth();

  const {
    signIn: googleSignIn,
    loading: googleLoading,
    user: googleUser,
  } = useGoogleAuth();

  const loading = googleLoading;

  // Handle Email/Password Login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation to authenticated screens is handled in _layout.tsx
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  // Handle Email/Password Registration
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Registration Successful', `Account created for ${email}`);
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      // Navigation to authenticated screens is handled in _layout.tsx
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', 'An error occurred during Google Sign-In');
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>Welcome to MyApp</Text>

      {/* Email and Password Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#999"
        />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator size="large" color="#0782F9" style={{ marginVertical: 20 }} />
      )}

      {/* Authentication Buttons */}
      {!loading && (
        <View style={styles.buttonContainer}>
          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Register Button */}
          <TouchableOpacity onPress={handleSignUp} style={[styles.button, styles.buttonOutline]}>
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>

          {/* Temporary Google Sign-In Button */}
          <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Display Logged-In User Info */}
      {googleUser && (
        <View style={styles.userInfo}>
          <Text style={styles.loggedInText}>
            Logged in as: {googleUser?.email}
          </Text>
        </View>
      )}
    </View>
  );
};

// Styles for the Sign-In Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#0782F9',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  googleButton: {
    backgroundColor: '#4285F4', // Google's blue color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  googleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userInfo: {
    marginTop: 20,
  },
  loggedInText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SignInScreen;
