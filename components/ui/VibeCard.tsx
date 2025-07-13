import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

interface VibeCardProps {
  user: {
    name: string;
    age: number;
    occupation: string;
    imageUrl: string;
  };
}

const VibeCard: React.FC<VibeCardProps> = ({ user }) => {
  return (
    <View className="w-full max-w-md mx-auto aspect-[4/5] rounded-2xl overflow-hidden shadow-lg bg-white">
      <ImageBackground
        source={{ uri: user.imageUrl }}
        className="flex-1 justify-end p-6"
      >
        <View className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <View>
          <Text className="text-white text-3xl font-bold">
            {user.name}, {user.age}
          </Text>
          <Text className="text-white text-lg">
            {user.occupation}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default VibeCard;
