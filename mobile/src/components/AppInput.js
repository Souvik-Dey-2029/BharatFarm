/**
 * AppInput - Styled text input with label and error support
 */

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/themeStore';
import { typography, borderRadius, spacing, layout } from '../theme';

export default function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType,
  icon,
  multiline,
  maxLength,
  style,
  inputStyle,
  editable = true,
  autoCapitalize = 'none',
  returnKeyType,
  onSubmitEditing,
}) {
  const theme = useThemeStore(s => s.theme);
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      )}
      <View style={[
        styles.inputWrapper,
        {
          backgroundColor: theme.inputBg,
          borderColor: error ? theme.danger : focused ? theme.primary : theme.inputBorder,
          borderWidth: focused ? 2 : 1,
          height: multiline ? undefined : layout.inputHeight,
          minHeight: multiline ? 100 : undefined,
        },
      ]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={focused ? theme.primary : theme.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            { color: theme.inputText },
            multiline && styles.multiline,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={theme.textMuted}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.bodySmall,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm,
  },
  multiline: {
    paddingTop: spacing.md,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  error: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
