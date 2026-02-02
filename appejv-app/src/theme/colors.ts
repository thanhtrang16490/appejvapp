export const colors = {
  // Primary colors
  primary: '#ED1C24',
  primaryDark: '#9C1C21',
  primaryLight: '#FFE8E8',

  // Secondary colors
  secondary: '#12B669',
  secondaryLight: '#ECFDF3',

  // Status colors
  success: '#00AA00',
  warning: '#FF9900',
  error: '#FF3B30',
  info: '#0066CC',

  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F8',
  gray200: '#EFEFEF',
  gray300: '#DCDCE6',
  gray400: '#ABACC2',
  gray500: '#7B7D9D',
  gray600: '#555777',
  gray700: '#27273E',

  // Text colors
  textPrimary: '#27273E',
  textSecondary: '#7B7D9D',
  textTertiary: '#ABACC2',
  textLight: '#FFFFFF',

  // Background colors
  background: '#FFFFFF',
  backgroundLight: '#F5F5F8',
  backgroundDark: '#27273E',

  // Border colors
  border: '#EFEFEF',
  borderLight: '#F5F5F8',
  borderDark: '#DCDCE6',

  // Transparent colors
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.3)',
  overlayLight: 'rgba(255, 255, 255, 0.3)',
} as const;

export type ColorName = keyof typeof colors;
