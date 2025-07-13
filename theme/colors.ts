// /theme/colors.ts
import { Platform } from 'react-native';

// Brand-specific colors
const BRAND_COLORS = {
  purple: {
    light: 'rgb(107, 77, 230)',
    medium: 'rgb(143, 123, 232)',
    dark: 'rgb(75, 43, 196)',
  },
  coral: {
    light: 'rgb(255, 155, 143)',
    medium: 'rgb(255, 125, 107)',
    dark: 'rgb(230, 95, 77)',
  },
  psychology: {
    confidence: 'rgb(255, 179, 71)',
    authenticity: 'rgb(152, 216, 216)',
    growth: 'rgb(123, 192, 67)',
  },
  feedback: {
    success: 'rgb(76, 175, 80)',
    warning: 'rgb(255, 193, 7)',
    error: 'rgb(255, 77, 77)',
    info: 'rgb(33, 150, 243)',
  },
};

const IOS_SYSTEM_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    grey6: 'rgb(242, 242, 247)',
    grey5: 'rgb(230, 230, 235)',
    grey4: 'rgb(210, 210, 215)',
    grey3: 'rgb(199, 199, 204)',
    grey2: 'rgb(175, 176, 180)',
    grey: 'rgb(142, 142, 147)',
    background: 'rgb(242, 242, 247)',
    foreground: 'rgb(0, 0, 0)',
    root: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    destructive: 'rgb(255, 56, 43)',
    primary: BRAND_COLORS.purple.medium,
    brand: {
      primary: BRAND_COLORS.purple.medium,
      secondary: BRAND_COLORS.coral.medium,
      primaryLight: BRAND_COLORS.purple.light,
      primaryDark: BRAND_COLORS.purple.dark,
      secondaryLight: BRAND_COLORS.coral.light,
      secondaryDark: BRAND_COLORS.coral.dark,
    },
    psychology: BRAND_COLORS.psychology,
    feedback: BRAND_COLORS.feedback,
  },
  dark: {
    grey6: 'rgb(21, 21, 24)',
    grey5: 'rgb(40, 40, 42)',
    grey4: 'rgb(55, 55, 57)',
    grey3: 'rgb(70, 70, 73)',
    grey2: 'rgb(99, 99, 102)',
    grey: 'rgb(142, 142, 147)',
    background: 'rgb(0, 0, 0)',
    foreground: 'rgb(255, 255, 255)',
    root: 'rgb(0, 0, 0)',
    card: 'rgb(28, 28, 30)',
    destructive: 'rgb(254, 67, 54)',
    primary: BRAND_COLORS.purple.light,
    brand: {
      primary: BRAND_COLORS.purple.light,
      secondary: BRAND_COLORS.coral.light,
      primaryLight: BRAND_COLORS.purple.medium,
      primaryDark: BRAND_COLORS.purple.light,
      secondaryLight: BRAND_COLORS.coral.medium,
      secondaryDark: BRAND_COLORS.coral.light,
    },
    psychology: BRAND_COLORS.psychology,
    feedback: BRAND_COLORS.feedback,
  },
} as const;

const ANDROID_COLORS = {
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  light: {
    ...IOS_SYSTEM_COLORS.light,
    grey6: 'rgb(249, 249, 255)',
    grey5: 'rgb(215, 217, 228)',
    grey4: 'rgb(193, 198, 215)',
    grey3: 'rgb(113, 119, 134)',
    grey2: 'rgb(65, 71, 84)',
    grey: 'rgb(24, 28, 35)',
    background: 'rgb(249, 249, 255)',
  },
  dark: {
    ...IOS_SYSTEM_COLORS.dark,
    grey6: 'rgb(16, 19, 27)',
    grey5: 'rgb(39, 42, 50)',
    grey4: 'rgb(49, 53, 61)',
    grey3: 'rgb(54, 57, 66)',
    grey2: 'rgb(139, 144, 160)',
    grey: 'rgb(193, 198, 215)',
    background: 'rgb(0, 0, 0)',
  },
} as const;

export const TYPOGRAPHY = {
  fonts: Platform.select({
    ios: {
      primary: 'SF Pro Display',
      secondary: 'SF Pro Text',
    },
    android: {
      primary: 'Roboto',
      secondary: 'Roboto',
    },
  }),
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

const COLORS = Platform.OS === 'ios' ? IOS_SYSTEM_COLORS : ANDROID_COLORS;

export { COLORS };