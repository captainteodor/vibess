import React, { memo } from 'react';
import { View, Text } from 'react-native';
import ImageWithLoader from './ImageWithLoader';

interface PhotoCardProps {
  uri: string;
}

const PhotoCardComponent: React.FC<PhotoCardProps> = ({ uri }) => {
  return (
    <View className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-6">
      <View className="absolute inset-0 bg-black/40 z-10" />
      <ImageWithLoader uri={uri} />
      <View className="absolute bottom-4 left-4 right-4 z-20">
        <Text className="text-2xl font-bold mb-1 text-white">
          Rate the Photo:
        </Text>
        <Text className="text-sm text-white/90">
          Share your honest impression!
        </Text>
      </View>
    </View>
  );
};

const PhotoCard = memo(PhotoCardComponent);
PhotoCard.displayName = 'PhotoCard';

export default PhotoCard;
