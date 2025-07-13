import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useGoogleAuth } from '~/lib/auth/GoogleSignInContext';

export default function LoginScreen() {
  const { signIn, loading } = useGoogleAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signIn();
      // Navigation will be handled by auth state change
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <LinearGradient
      colors={['#9c27b0', '#e91e63']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center items-center px-8">
            {/* Animated Stars Background */}
            <View className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                <View
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-70"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </View>

            {/* Logo/Title Section */}
            <View className="items-center mb-12">
              <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-6 backdrop-blur-md">
                <Feather name="heart" size={48} color="white" />
              </View>
              <Text className="text-4xl font-bold text-white mb-2">VibeMatch</Text>
              <Text className="text-lg text-white/80">Align Your Cosmic Energy</Text>
            </View>

            {/* Sign In Section */}
            <View className="w-full max-w-sm">
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                disabled={loading || isSigningIn}
                className="bg-white/90 backdrop-blur-md rounded-full px-6 py-4 flex-row items-center justify-center shadow-lg mb-4"
                activeOpacity={0.8}
              >
                {loading || isSigningIn ? (
                  <ActivityIndicator size="small" color="#9c27b0" />
                ) : (
                  <>
                    <Feather name="mail" size={20} color="#9c27b0" />
                    <Text className="text-gray-800 font-semibold text-lg ml-3">
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-transparent border-2 border-white/50 rounded-full px-6 py-4 flex-row items-center justify-center"
                activeOpacity={0.8}
              >
                <Feather name="smartphone" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-3">
                  Continue with Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms and Privacy */}
            <View className="mt-12">
              <Text className="text-white/70 text-sm text-center">
                By continuing, you agree to our{' '}
                <Text className="text-white underline">Terms of Service</Text>
                {' '}and{' '}
                <Text className="text-white underline">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}