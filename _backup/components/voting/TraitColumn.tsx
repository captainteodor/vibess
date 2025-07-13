import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import { RATINGS } from '~/constants/votingConstants';
import { VotingCriteria } from '~/types/index';

type VoteValue = 1 | 2 | 3 | 4;

interface TraitColumnProps {
  criteria: VotingCriteria;
  currentVotes: number;
  handleVoteSelection: (criteria: VotingCriteria, value: VoteValue) => void;
  disabled?: boolean;
}

const TraitColumnComponent: React.FC<TraitColumnProps> = ({
  criteria,
  currentVotes,
  handleVoteSelection,
  disabled = false,
}) => {
  const buttonGradients: Record<number, string[]> = {
    4: ['#2ECC71', '#27AE60'],
    3: ['#82E0AA', '#52BE80'],
    2: ['#F4D03F', '#F1C40F'],
    1: ['#FF7043', '#F4511E'],
  };

  return (
    <View className="flex-1">
      {RATINGS.map((rating, index) => {
        const isSelected = currentVotes === rating.value;
        const gradientColors = buttonGradients[rating.value];

        return (
          <TouchableOpacity
            key={rating.label}
            onPress={() => handleVoteSelection(criteria, rating.value as VoteValue)}
            disabled={disabled}
            className={`
              h-14
              ${isSelected ? 'scale-[1.02]' : ''}
              ${disabled ? 'opacity-50' : ''}
              ${index === 0 ? 'rounded-t-xl' : ''}
              ${index === RATINGS.length - 1 ? 'rounded-b-xl' : ''}
            `}
          >
            <LinearGradient
              colors={gradientColors}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                borderRadius: index === 0 ? 12 : index === RATINGS.length - 1 ? 12 : 0,
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text className={`
                text-center text-sm font-bold text-white
                ${isSelected ? 'opacity-100' : 'opacity-90'}
              `}>
                {rating.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TraitColumn = memo(TraitColumnComponent);
TraitColumn.displayName = 'TraitColumn';

export default TraitColumn;
