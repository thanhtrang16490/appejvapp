import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/src/theme/colors';
import { commonStyles } from '@/src/theme/styles';

export interface CardProps extends ViewProps {
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  children: React.ReactNode;
}

/**
 * Card component với nhiều variants khác nhau
 */
export function Card({ onPress, variant = 'elevated', style, children, ...props }: CardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlined;
      case 'filled':
        return styles.filled;
      default:
        return styles.elevated;
    }
  };

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[commonStyles.card, getVariantStyle(), style]}
      onPress={onPress}
      {...props}
    >
      {children}
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  elevated: {
    backgroundColor: colors.background,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  outlined: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.backgroundLight,
  },
});
