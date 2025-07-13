import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, GestureResponderEvent } from 'react-native';

// 1. Define an interface for your props:
interface Layered3DButtonProps {
  title?: string;
  onPress?: (event: GestureResponderEvent) => void; // or () => void if you don’t use the event
}

// 2. Use the interface in the component signature:
export default function Layered3DButton({
  title = 'Click me',
  onPress,
}: Layered3DButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={styles.buttonContainer}
    >
      {/* Underlay view mimics the “::before” pink layer */}
      <View
        style={[
          styles.buttonUnderlay,
          pressed && styles.buttonUnderlayPressed
        ]}
      />

      {/* Main “button face” */}
      <View style={[styles.buttonFace, pressed && styles.buttonFacePressed]}>
        <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
          {title.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    // We use position: 'relative' so we can absolutely position the underlay.
    position: 'relative',
    width: 180,
    height: 50,
    marginVertical: 10,
    alignItems: 'center',
  },

  // The “::before” layer from your CSS becomes an absolutely-positioned View
  buttonUnderlay: {
    position: 'absolute',
    top: 8, // shift down to mimic 3D
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgb(255,179,201)', // your "darker" pink
    // Optionally replicate the box-shadow edges:
    shadowColor: '#931A3E', // the darker border color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 0.5,
    borderWidth: 2,
    borderColor: 'rgb(147, 26, 62)', // matches your pink border
    zIndex: 0, // ensure it stays behind the face
  },
  buttonUnderlayPressed: {
    // Move it up a bit on press so the button face looks more “pushed in”
    top: 4,
  },

  // The top “button face”
  buttonFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(255,229,237)', // your lighter pink
    borderWidth: 2,
    borderColor: 'rgb(147, 26, 62)',
    zIndex: 1,
    // “3D” transform: the default “unpressed” state
    transform: [{ translateY: 0 }],
  },
  buttonFacePressed: {
    // Shift down slightly to look pressed
    transform: [{ translateY: 4 }],
  },

  // Text
  buttonText: {
    color: 'rgb(147, 26, 62)',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextPressed: {
    // Maybe darken or lighten on press? Optional
  },
});
