import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  gradient: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Welcome to VibeMatch',
    description: 'Where cosmic connections align through authentic energy matching',
    icon: 'heart',
    gradient: ['#9c27b0', '#e91e63'],
  },
  {
    id: 2,
    title: 'Rate & Align',
    description: 'Swipe through profiles and rate vibes based on three key traits',
    icon: 'star',
    gradient: ['#e91e63', '#ff6090'],
  },
  {
    id: 3,
    title: 'Get AI Insights',
    description: 'Receive personalized tips to enhance your profile and attract your tribe',
    icon: 'zap',
    gradient: ['#ff6090', '#ffc107'],
  },
  {
    id: 4,
    title: 'Ready to Vibe?',
    description: "Let's set up your profile and start your cosmic journey",
    icon: 'smile',
    gradient: ['#ffc107', '#4caf50'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
    scrollX.value = offsetX;
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      router.push('/profile-setup');
    }
  };

  const handleSkip = () => {
    router.push('/profile-setup');
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={slides[currentIndex].gradient}
        className="flex-1"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Skip Button */}
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity
            onPress={handleSkip}
            className="absolute top-12 right-6 z-10 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full"
          >
            <Text className="text-white font-semibold">Skip</Text>
          </TouchableOpacity>
        )}

        {/* Slides */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              className="justify-center items-center px-8"
              style={{ width: SCREEN_WIDTH }}
            >
              <Animated.View
                style={useAnimatedStyle(() => ({
                  transform: [
                    {
                      scale: interpolate(
                        scrollX.value,
                        [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
                        [0.8, 1, 0.8]
                      ),
                    },
                  ],
                }))}
                className="w-32 h-32 bg-white/20 rounded-full items-center justify-center mb-8 backdrop-blur-md"
              >
                <Feather name={slide.icon} size={64} color="white" />
              </Animated.View>
              
              <Text className="text-3xl font-bold text-white text-center mb-4">
                {slide.title}
              </Text>
              
              <Text className="text-lg text-white/80 text-center">
                {slide.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Section */}
        <View className="absolute bottom-0 left-0 right-0 p-8">
          {/* Page Indicators */}
          <View className="flex-row justify-center mb-8">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-2 mx-1 rounded-full ${
                  index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </View>

          {/* Next Button */}
          <TouchableOpacity
            onPress={handleNext}
            className="bg-white/90 backdrop-blur-md rounded-full px-8 py-4 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-gray-800 font-bold text-lg mr-2">
              {currentIndex === slides.length - 1 ? "Let's Start" : 'Next'}
            </Text>
            <Feather 
              name={currentIndex === slides.length - 1 ? "check" : "arrow-right"} 
              size={20} 
              color="#333" 
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}