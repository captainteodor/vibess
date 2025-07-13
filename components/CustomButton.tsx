// components/CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.disabled : null]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled ? styles.disabledText : null]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: 14,
    backgroundColor: '#ffffff',
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 20,
    textAlign: 'center',
  },
  buttonText: {
    color: '#000000',
    textAlign: 'center',
  },
  disabled: {
    backgroundColor: 'grey',
  },
  disabledText: {
    color: '#c0c0c0',
  },
});
