import React from 'react';
import { View } from 'react-native';

const PhotoSkeleton = () => (
  <View className="animate-pulse">
    <View className="bg-gray-200 w-full h-80 rounded-lg" />
    <View className="mt-4 space-y-4">
      <View className="h-4 bg-gray-200 rounded w-3/4" />
      <View className="h-4 bg-gray-200 rounded w-1/2" />
    </View>
  </View>
);

export default PhotoSkeleton;
