/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  // Primary colors
  primary: '#ED1C24',
  primaryLight: '#FFE8E8',
  primaryDark: '#CC0000',

  // Secondary colors
  secondary: '#0066CC',
  secondaryLight: '#E6F7FF',
  secondaryDark: '#004C99',

  // Status colors
  success: '#00AA00',
  successLight: '#E6F7EA',
  warning: '#FF9900',
  warningLight: '#FFF5E6',
  error: '#FF3B30',
  errorLight: '#FFE8E8',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F5F5F5',
    200: '#F0F0F0',
    300: '#E5E5E5',
    400: '#CCCCCC',
    500: '#999999',
    600: '#666666',
    700: '#444444',
    800: '#333333',
    900: '#222222',
  },

  // Text colors
  text: {
    primary: '#27273E',
    secondary: '#7B7D9D',
    light: '#FFFFFF',
    dark: '#000000',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F8',
    dark: '#222222',
  },

  // Border colors
  border: {
    light: '#E5E5E5',
    dark: '#CCCCCC',
  },

  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
  },

  // Transparent colors
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.3)',

  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
