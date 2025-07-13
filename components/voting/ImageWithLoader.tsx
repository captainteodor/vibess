import React, { useState, useEffect, useRef, memo } from 'react';
import { View, Image, ActivityIndicator, Text } from 'react-native';

interface ImageWithLoaderProps {
  uri: string;
}

const ImageWithLoaderComponent: React.FC<ImageWithLoaderProps> = ({ uri }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      if (!uri) return;
      setLoading(true);
      setError(false);
      try {
        await Image.prefetch(uri);
        if (isMounted.current) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Image load error:', err);
        if (isMounted.current) {
          setError(true);
          setLoading(false);
        }
      }
    };

    loadImage();
  }, [uri]);

  return (
    <View className="relative w-full h-full">
      {loading && (
        <View className="absolute inset-0 flex items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      )}
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        onError={() => {
          if (isMounted.current) {
            setError(true);
            setLoading(false);
          }
        }}
        accessible={true}
        accessibilityLabel="Photo to be rated"
      />
      {error && (
        <View className="absolute inset-0 bg-gray-200 items-center justify-center">
          <Text className="text-gray-600">Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

const ImageWithLoader = memo(ImageWithLoaderComponent);
ImageWithLoader.displayName = 'ImageWithLoader';

export default ImageWithLoader;
