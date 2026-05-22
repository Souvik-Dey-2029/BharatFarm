/**
 * GradientCard - Glassmorphism-style card with gradient border
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/themeStore';
import { borderRadius, spacing } from '../theme';

export default function GradientCard({
  children,
  onPress,
  style,
  gradientColors,
  borderWidth = 1,
  padded = true,
  elevated = false,
}) {
  const theme = useThemeStore(s => s.theme);
  const colors = gradientColors || [theme.glass.border, 'transparent'];
  const shadow = elevated ? theme.shadow.md : theme.shadow.sm;

  const content = (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
        borderWidth,
        shadowColor: theme.shadow.color,
        ...shadow,
      },
      padded && styles.padded,
      style,
    ]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  padded: {
    padding: spacing.base,
  },
});
