import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import { Trait } from '~/constants/votingConstants';

interface TraitIconProps {
  trait: Trait;
}

const TraitIconComponent: React.FC<TraitIconProps> = ({ trait }) => {
  if (!trait) {
    console.error('TraitIcon received invalid trait:', trait);
    return null;
  }

  return (
    <View className="flex flex-col items-center gap-2">
      <LinearGradient
        colors={trait.gradientColors}
        className="w-12 h-12 rounded-2xl items-center justify-center shadow-lg"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text className="text-2xl">{trait.emoji}</Text>
      </LinearGradient>
      <Text className="text-sm font-medium text-gray-700 text-center">
        {trait.label}
      </Text>
    </View>
  );
};

const TraitIcon = React.memo(TraitIconComponent);
TraitIcon.displayName = 'TraitIcon';

export default TraitIcon;
