/**
 * AppButton - Primary action button with gradient and press animation
 */

import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../store/themeStore';
import { typography, borderRadius, spacing, layout } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export default function AppButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) {
  const theme = useThemeStore(s => s.theme);

  const heights = { sm: layout.buttonHeightSm, md: layout.buttonHeight, lg: 56 };
  const textSizes = { sm: typography.buttonSmall, md: typography.button, lg: { fontSize: 18, fontWeight: '700' } };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.primary,
          text: '#FFFFFF',
          border: 'transparent',
          gradient: theme.gradient.primary,
        };
      case 'accent':
        return {
          bg: theme.accent,
          text: '#FFFFFF',
          border: 'transparent',
          gradient: theme.gradient.accent,
        };
      case 'secondary':
        return {
          bg: theme.surface,
          text: theme.primary,
          border: theme.border,
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.primary,
          border: theme.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: theme.primary,
          border: 'transparent',
        };
      default:
        return {
          bg: theme.primary,
          text: '#FFFFFF',
          border: 'transparent',
        };
    }
  };

  const v = getVariantStyles();

  const buttonContent = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator size="small" color={v.text} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={v.text} style={styles.iconLeft} />
          )}
          <Text style={[textSizes[size], { color: v.text }, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={v.text} style={styles.iconRight} />
          )}
        </>
      )}
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          height: heights[size],
          backgroundColor: v.gradient ? 'transparent' : v.bg,
          borderColor: v.border,
          borderWidth: variant === 'outline' ? 2 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed && !disabled ? 0.97 : 1 }],
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {v.gradient ? (
        <LinearGradient
          colors={v.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { height: heights[size] }]}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        buttonContent
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
