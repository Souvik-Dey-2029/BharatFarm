/**
 * ScreenHeader - Consistent header with back button and title
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { typography, spacing, layout } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  rightIcon,
  transparent = false,
}) {
  const theme = useThemeStore(s => s.theme);
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        paddingTop: insets.top + spacing.sm,
        backgroundColor: transparent ? 'transparent' : theme.background,
        borderBottomColor: transparent ? 'transparent' : theme.border,
      },
    ]}>
      <View style={styles.row}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: pressed ? theme.surface : 'transparent' },
            ]}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
        )}
        <View style={[styles.titleArea, !onBack && { paddingLeft: spacing.lg }]}>
          <Text style={[typography.h3, { color: theme.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 2 }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightAction && (
          <Pressable
            onPress={rightAction}
            style={({ pressed }) => [
              styles.rightBtn,
              { backgroundColor: pressed ? theme.surface : 'transparent' },
            ]}
          >
            <Ionicons name={rightIcon || 'ellipsis-vertical'} size={22} color={theme.text} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.headerHeight,
    paddingHorizontal: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleArea: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  rightBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
