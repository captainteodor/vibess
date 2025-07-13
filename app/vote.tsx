import React, { useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import VibeCard from '~/components/ui/VibeCard';
import VoteButton from '~/components/ui/VoteButton';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

const dummyUser1 = {
  name: 'Cosmic Chris',
  age: 28,
  occupation: 'Stargazer & Adventure Seeker',
  imageUrl: 'https://img.heroui.chat/image/avatar?w=600&h=750&u=user1',
};

const dummyUser2 = {
  name: 'Galactic Gazer',
  age: 32,
  occupation: 'Nebula Navigator',
  imageUrl: 'https://img.heroui.chat/image/avatar?w=600&h=750&u=user2',
};


export default function VoteScreen() {
  const [user, setUser] = useState(dummyUser1);
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const onVote = (direction: 'left' | 'right') => {
    console.log(`Voted ${direction}`);
    setUser(user.name === 'Cosmic Chris' ? dummyUser2 : dummyUser1);
    translateX.value = 0;
    rotate.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      rotate.value = interpolate(
        event.translationX,
        [-screenWidth / 2, screenWidth / 2],
        [-15, 15],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.velocityX) < 800) {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
        return;
      }

      if (event.velocityX > 0) {
        translateX.value = withSpring(screenWidth * 2);
        runOnJS(onVote)('right');
      } else {
        translateX.value = withSpring(-screenWidth * 2);
        runOnJS(onVote)('left');
      }
    });

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4 space-y-6">
      <Text className="text-3xl font-bold text-center text-gray-800">
        Align Vibes
      </Text>

      <GestureDetector gesture={pan}>
        <Animated.View style={cardStyle}>
          <VibeCard user={user} />
        </Animated.View>
      </GestureDetector>

      <View className="flex-row justify-center space-x-4">
        <VoteButton
          onPress={() => {
            translateX.value = withSpring(-screenWidth * 2);
            onVote('left');
          }}
          iconName="x"
          color="bg-red-200"
          iconColor="red"
        />
        <VoteButton
          onPress={() => {
            translateX.value = withSpring(screenWidth * 2);
            onVote('right');
          }}
          iconName="heart"
          color="bg-green-200"
          iconColor="green"
        />
      </View>
    </View>
  );
}
