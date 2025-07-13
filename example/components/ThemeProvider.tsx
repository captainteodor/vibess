import React from 'react';
import { HeroUIProvider } from "@heroui/react";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HeroUIProvider
      theme={{
        colors: {
          primary: {
            50: '#f3e5f5',
            100: '#e1bee7',
            200: '#ce93d8',
            300: '#ba68c8',
            400: '#ab47bc',
            500: '#9c27b0',
            600: '#8e24aa',
            700: '#7b1fa2',
            800: '#6a1b9a',
            900: '#4a148c',
            DEFAULT: '#9c27b0',
          },
          secondary: {
            50: '#fce4ec',
            100: '#f8bbd0',
            200: '#f48fb1',
            300: '#f06292',
            400: '#ec407a',
            500: '#e91e63',
            600: '#d81b60',
            700: '#c2185b',
            800: '#ad1457',
            900: '#880e4f',
            DEFAULT: '#e91e63',
          },
          success: {
            DEFAULT: '#00BFA5',
          },
          warning: {
            DEFAULT: '#FFC107',
          },
          danger: {
            DEFAULT: '#FF1744',
          },
        },
      }}
    >
      {children}
    </HeroUIProvider>
  );
};