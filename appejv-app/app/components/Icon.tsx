import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IconProps = {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
};

export const Icon = ({ name, size, color }: IconProps) => {
  return (
    <Text style={[styles.iconContainer, { fontSize: size }]}>
      <Ionicons name={name} size={size} color={color} />
    </Text>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
