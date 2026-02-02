import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export type ThemedTextProps = TextProps & {
  variant?: 'default' | 'title' | 'subtitle' | 'caption' | 'link';
};

export function ThemedText({ style, variant = 'default', ...props }: ThemedTextProps) {
  return (
    <Text
      style={[
        styles.base,
        variant === 'title' && styles.title,
        variant === 'subtitle' && styles.subtitle,
        variant === 'caption' && styles.caption,
        variant === 'link' && styles.link,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: Colors.text.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  caption: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
