/**
 * XPBar - Animated XP progress bar with level display
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/themeStore';
import { useGamificationStore } from '../store/gamificationStore';
import { typography, borderRadius, spacing } from '../theme';

export default function XPBar({ compact = false }) {
  const theme = useThemeStore(s => s.theme);
  const { level, xp, getXPForNextLevel, getLevelTitle, getProgress } = useGamificationStore();
  const progress = getProgress();
  const nextLevelXP = getXPForNextLevel(level);
  const title = getLevelTitle(level);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.levelBadge, { backgroundColor: theme.primary + '20', marginRight: 8 }]}>
          <Text style={[styles.levelText, { color: theme.primary }]}>Lvl {level}</Text>
        </View>
        <View style={[styles.barBg, { backgroundColor: theme.border }]}>
          <View
            style={[styles.barFill, { width: `${Math.max(5, Math.round(progress * 100))}%`, backgroundColor: theme.primary }]}
          />
        </View>
        <Text style={[styles.xpText, { color: theme.textMuted, marginLeft: 8 }]}>{xp} XP</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.topRow}>
        <View style={[styles.levelBadgeLg, { backgroundColor: theme.primary }]}>
          <Text style={styles.levelNumText}>{level}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[typography.h4, { color: theme.text }]}>{title}</Text>
          <Text style={[typography.caption, { color: theme.textSecondary }]}>
            {xp} / {nextLevelXP} XP
          </Text>
        </View>
        <View style={styles.streakArea}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={[typography.caption, { color: theme.accent }]}>
            {useGamificationStore.getState().streak_days}d
          </Text>
        </View>
      </View>
      <View style={[styles.barBgLg, { backgroundColor: theme.border }]}>
        <View
          style={[styles.barFillLg, { width: `${Math.max(3, Math.round(progress * 100))}%`, backgroundColor: theme.primary }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Compact
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  barBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  xpText: {
    fontSize: 11,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  // Full
  container: {
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  levelBadgeLg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelNumText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  streakArea: {
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 20,
  },
  barBgLg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFillLg: {
    height: 10,
    borderRadius: 5,
  },
});
