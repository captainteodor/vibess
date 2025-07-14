import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface VoteButtonProps {
  onPress: () => void;
  iconName: React.ComponentProps<typeof Feather>['name'];
  color: string;
  iconColor: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({
  onPress,
  iconName,
  color,
  iconColor,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-16 h-16 rounded-full items-center justify-center ${color}`}
    >
      <Feather name={iconName} size={32} color={iconColor} />
    </TouchableOpacity>
  );
};

export default VoteButton;
