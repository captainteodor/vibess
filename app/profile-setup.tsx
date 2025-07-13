import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getFirebaseFirestore } from '~/config/firebase';
import { useAuth } from '~/lib/auth/authContext';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [loading, setLoading] = useState(false);

  const ageRanges = [
    { label: '18-24', value: '18-24' },
    { label: '25-34', value: '25-34' },
    { label: '35-44', value: '35-44' },
    { label: '45+', value: '45+' },
  ];

  const handleComplete = async () => {
    if (!age || !gender) {
      Alert.alert('Missing Info', 'Please select your age range and gender');
      return;
    }

    setLoading(true);
    try {
      const firestore = getFirebaseFirestore();
      const userDocRef = doc(firestore, 'users', user?.email || '');
      
      await setDoc(userDocRef, {
        email: user?.email,
        age,
        gender,
        onboardingComplete: true,
        createdAt: new Date(),
      }, { merge: true });

      router.replace('/vote');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#4caf50', '#2196f3']}
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
          <View className="flex-1 px-8 pt-16 pb-8">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4 backdrop-blur-md">
                <Feather name="user" size={40} color="white" />
              </View>
              <Text className="text-3xl font-bold text-white mb-2">Basic Info</Text>
              <Text className="text-lg text-white/80 text-center">
                Help us personalize your experience
              </Text>
            </View>

            {/* Age Selection */}
            <View className="mb-8">
              <Text className="text-white font-semibold text-lg mb-4">Age Range</Text>
              <View className="space-y-3">
                {ageRanges.map((range) => (
                  <TouchableOpacity
                    key={range.value}
                    onPress={() => setAge(range.value)}
                    className={`p-4 rounded-2xl border-2 ${
                      age === range.value
                        ? 'bg-white/30 border-white'
                        : 'bg-white/10 border-white/30'
                    }`}
                    activeOpacity={0.8}
                  >
                    <Text className={`text-center font-semibold text-lg ${
                      age === range.value ? 'text-white' : 'text-white/70'
                    }`}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Gender Selection */}
            <View className="mb-8">
              <Text className="text-white font-semibold text-lg mb-4">Gender</Text>
              <View className="flex-row space-x-3">
                {['male', 'female', 'other'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setGender(option as any)}
                    className={`flex-1 p-4 rounded-2xl border-2 ${
                      gender === option
                        ? 'bg-white/30 border-white'
                        : 'bg-white/10 border-white/30'
                    }`}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name={option === 'male' ? 'user' : option === 'female' ? 'user' : 'users'}
                      size={24}
                      color={gender === option ? 'white' : 'rgba(255,255,255,0.7)'}
                      style={{ alignSelf: 'center', marginBottom: 4 }}
                    />
                    <Text className={`text-center font-semibold capitalize ${
                      gender === option ? 'text-white' : 'text-white/70'
                    }`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Spacer */}
            <View className="flex-1" />

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleComplete}
              disabled={loading || !age || !gender}
              className={`rounded-full px-8 py-4 flex-row items-center justify-center ${
                age && gender
                  ? 'bg-white/90 backdrop-blur-md'
                  : 'bg-white/40'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`font-bold text-lg mr-2 ${
                age && gender ? 'text-gray-800' : 'text-white/70'
              }`}>
                {loading ? 'Saving...' : 'Continue to Voting'}
              </Text>
              {!loading && (
                <Feather 
                  name="arrow-right" 
                  size={20} 
                  color={age && gender ? '#333' : 'rgba(255,255,255,0.7)'} 
                />
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}