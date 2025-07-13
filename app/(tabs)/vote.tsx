import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Profile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  imageUrl: string;
  bio: string;
  interests: string[];
}

const dummyProfiles: Profile[] = [
  {
    id: '1',
    name: 'Cosmic Chris',
    age: 28,
    occupation: 'Stargazer & Adventure Seeker',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    bio: 'Looking for someone to explore the universe with, both metaphorically and literally.',
    interests: ['Stargazing', 'Hiking', 'Quantum Physics'],
  },
  {
    id: '2',
    name: 'Luna Light',
    age: 26,
    occupation: 'Yoga Instructor & Energy Healer',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
    bio: 'Manifesting deep connections through mindful living and positive vibes.',
    interests: ['Meditation', 'Crystal Healing', 'Vegan Cooking'],
  },
];

const aiHints = [
  "Strong smile energy—boost with adventure pose? ✨",
  "Great eye contact! Try outdoor lighting for extra spark 🌟",
  "Confident pose detected. Consider a vibrant background 🎨",
  "Friendly vibe! A group photo might amplify your social energy 👥",
];

export default function VotingScreen() {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentVibe, setCurrentVibe] = useState(50);
  const [aiHint, setAiHint] = useState(aiHints[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPremium] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const currentProfile = dummyProfiles[currentProfileIndex];

  useEffect(() => {
    // Pulse animation on mount
    scale.value = withSequence(
      withTiming(1.05, { duration: 500 }),
      withTiming(1, { duration: 500 })
    );
    generateAIHint();
  }, [currentProfileIndex]);

  const generateAIHint = () => {
    setAiHint(aiHints[Math.floor(Math.random() * aiHints.length)]);
  };

  const triggerHapticFeedback = () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(10);
    }
  };

  const handleVote = (vote: number) => {
    setCurrentVibe(prev => Math.min(Math.max(prev + vote, 0), 100));
    triggerHapticFeedback();
    generateAIHint();
  };

  const nextProfile = () => {
    setCurrentProfileIndex((prev) => (prev + 1) % dummyProfiles.length);
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotate.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH / 2, SCREEN_WIDTH / 2],
        [-15, 15],
        Extrapolate.CLAMP
      );
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SCREEN_WIDTH * 0.3) {
        translateX.value = withSpring(
          translateX.value > 0 ? SCREEN_WIDTH * 2 : -SCREEN_WIDTH * 2
        );
        runOnJS(nextProfile)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const likeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SCREEN_WIDTH / 4],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const nopeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 4, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e']}
      className="flex-1"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Stars Background */}
      <View className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <View
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center px-4 pt-12 pb-8">
          {/* Header */}
          <Text className="text-3xl font-bold text-center text-white mb-6">
            Align Vibes
          </Text>

          {/* Card */}
          <View className="relative w-full max-w-sm aspect-[4/5] mb-6">
            <GestureDetector gesture={pan}>
              <Animated.View style={[cardStyle, { width: '100%', height: '100%' }]}>
                <View className="w-full h-full rounded-3xl overflow-hidden bg-gray-900">
                  <Image
                    source={{ uri: currentProfile.imageUrl }}
                    className="w-full h-full"
                    contentFit="cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    className="absolute bottom-0 left-0 right-0 h-1/3"
                  />
                  
                  {/* Profile Info */}
                  <View className="absolute bottom-6 left-6 right-6">
                    <Text className="text-2xl font-bold text-white mb-1">
                      {currentProfile.name}, {currentProfile.age}
                    </Text>
                    <Text className="text-base text-white/90">
                      {currentProfile.occupation}
                    </Text>
                  </View>

                  {/* Swipe Indicators */}
                  <Animated.View 
                    style={likeOpacityStyle}
                    className="absolute top-20 left-6 transform rotate-[-20deg]"
                  >
                    <View className="border-4 border-green-500 rounded-xl px-6 py-2">
                      <Text className="text-green-500 text-3xl font-bold">LIKE</Text>
                    </View>
                  </Animated.View>

                  <Animated.View 
                    style={nopeOpacityStyle}
                    className="absolute top-20 right-6 transform rotate-[20deg]"
                  >
                    <View className="border-4 border-red-500 rounded-xl px-6 py-2">
                      <Text className="text-red-500 text-3xl font-bold">NOPE</Text>
                    </View>
                  </Animated.View>

                  {/* Premium Badge */}
                  {isPremium && (
                    <View className="absolute top-3 right-3 bg-yellow-500 px-3 py-1 rounded-full">
                      <Text className="text-xs font-bold text-gray-900">AR</Text>
                    </View>
                  )}

                  {/* Expand Button */}
                  <TouchableOpacity
                    className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md p-2 rounded-full"
                    onPress={() => setModalVisible(true)}
                  >
                    <Feather name="maximize-2" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </GestureDetector>
          </View>

          {/* Vibe Progress */}
          <View className="w-full max-w-sm mb-4">
            <Text className="text-center text-white font-semibold mb-2">
              Current Vibe Alignment
            </Text>
            <View className="bg-gray-800 h-4 rounded-full overflow-hidden">
              <LinearGradient
                colors={['#e91e63', '#9c27b0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: `${currentVibe}%`, height: '100%' }}
              />
            </View>
            <Text className="text-center text-white/70 text-sm mt-1">
              {currentVibe}% aligned
            </Text>
          </View>

          {/* AI Hint */}
          <View className="w-full max-w-sm bg-white/10 backdrop-blur-md p-3 rounded-xl mb-6">
            <Text className="text-sm text-center text-white">
              <Feather name="zap" size={14} color="white" /> AI Hint: {aiHint}
            </Text>
          </View>

          {/* Vote Buttons */}
          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity
              className="w-16 h-16 rounded-full bg-red-500/20 items-center justify-center"
              onPress={() => handleVote(-10)}
            >
              <Feather name="x" size={30} color="#ef4444" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-16 h-16 rounded-full bg-yellow-500/20 items-center justify-center"
              onPress={() => handleVote(-5)}
            >
              <Feather name="star" size={30} color="#f59e0b" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-16 h-16 rounded-full bg-green-500/20 items-center justify-center"
              onPress={() => handleVote(5)}
            >
              <Feather name="star" size={30} color="#10b981" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-16 h-16 rounded-full bg-purple-500/20 items-center justify-center"
              onPress={() => handleVote(10)}
            >
              <Feather name="heart" size={30} color="#8b5cf6" />
            </TouchableOpacity>
          </View>

          <Text className="text-center text-sm italic text-white/50 mt-4">
            "Swipe through the cosmic sea of connections!"
          </Text>

          {/* Premium AR Button */}
          {isPremium && (
            <TouchableOpacity className="mt-6 bg-yellow-500/20 backdrop-blur-md px-6 py-3 rounded-full flex-row items-center">
              <Feather name="eye" size={20} color="#fbbf24" />
              <Text className="text-yellow-400 font-semibold ml-2">View AR Aura</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-gray-900 rounded-t-3xl p-6 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-white">
                {currentProfile.name}'s Full Profile
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="space-y-4">
                <View>
                  <Text className="text-gray-400 font-semibold">Age</Text>
                  <Text className="text-white text-lg">{currentProfile.age}</Text>
                </View>
                
                <View>
                  <Text className="text-gray-400 font-semibold">Occupation</Text>
                  <Text className="text-white text-lg">{currentProfile.occupation}</Text>
                </View>
                
                <View>
                  <Text className="text-gray-400 font-semibold">Interests</Text>
                  <Text className="text-white text-lg">{currentProfile.interests.join(', ')}</Text>
                </View>
                
                <View>
                  <Text className="text-gray-400 font-semibold">Bio</Text>
                  <Text className="text-white text-lg">{currentProfile.bio}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}