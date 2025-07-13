declare module 'expo-linear-gradient' {
    import { ViewProps } from 'react-native';
    import React from 'react';
  
    interface LinearGradientProps extends ViewProps {
      colors: string[];
      start?: { x: number; y: number };
      end?: { x: number; y: number };
      locations?: number[];
    }
  
    export default class LinearGradient extends React.Component<LinearGradientProps> {}
  }