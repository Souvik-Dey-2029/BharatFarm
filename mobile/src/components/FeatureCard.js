/**
 * FeatureCard - Dashboard feature tile with icon and gradient
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { typography, borderRadius, spacing } from '../theme';

export default function FeatureCard({
  title,
  subtitle,
  icon,
  emoji,
  gradientColors,
  onPress,
  badge,
  size = 'normal', // 'normal' | 'large' | 'compact'
}) {
  const theme = useThemeStore(s => s.theme);

  const defaultGradient = [theme.primary + '15', theme.primary + '05'];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        size === 'large' && styles.containerLarge,
        size === 'compact' && styles.containerCompact,
        {
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          shadowColor: theme.shadow.color,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          ...theme.shadow.sm,
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors || defaultGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconArea}>
          {emoji ? (
            <Text style={[styles.emoji, size === 'compact' && styles.emojiCompact]}>{emoji}</Text>
          ) : (
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name={icon} size={size === 'compact' ? 20 : 24} color={theme.primary} />
            </View>
          )}
          {badge && (
            <View style={[styles.badge, { backgroundColor: theme.accent }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            size === 'compact' ? typography.bodySmall : typography.h4,
            { color: theme.text, marginTop: spacing.sm },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        {subtitle && size !== 'compact' && (
          <Text
            style={[typography.caption, { color: theme.textSecondary, marginTop: 4 }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    flex: 1,
  },
  containerLarge: {
    minHeight: 160,
  },
  containerCompact: {
    minHeight: 90,
  },
  gradient: {
    flex: 1,
    padding: spacing.base,
    justifyContent: 'flex-start',
  },
  iconArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  emojiCompact: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
