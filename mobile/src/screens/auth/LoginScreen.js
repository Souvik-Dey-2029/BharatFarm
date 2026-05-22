/**
 * LoginScreen - BharatFarm Authentication
 * Beautiful agricultural-themed login with glass UI
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Pressable, Alert, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import { typography, spacing, borderRadius } from '../../theme';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const { login, register } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  // Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleLogin = async () => {
    if (!loginPhone.trim() || !loginPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(loginPhone.trim(), loginPassword);
    } catch (e) {
      Alert.alert('Login Failed', e.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!regName.trim() || !regPhone.trim() || !regPassword || !regConfirm) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (regPassword !== regConfirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (regPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ name: regName.trim(), phone: regPhone.trim(), password: regPassword });
    } catch (e) {
      Alert.alert('Registration Failed', e.message);
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={theme.gradient.hero}
        style={[styles.heroGradient, { paddingTop: insets.top + 20 }]}
      >
        {/* Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🌾</Text>
          </View>
          <Text style={styles.appName}>BharatFarm</Text>
          <Text style={styles.tagline}>Empowering Farmers Through Technology</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.formArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tab Switcher */}
          <View style={[styles.tabContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable
              onPress={() => setActiveTab('login')}
              style={[
                styles.tab,
                activeTab === 'login' && { backgroundColor: theme.primary },
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'login' ? '#FFF' : theme.textSecondary },
              ]}>Login</Text>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('register')}
              style={[
                styles.tab,
                activeTab === 'register' && { backgroundColor: theme.primary },
              ]}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === 'register' ? '#FFF' : theme.textSecondary },
              ]}>Register</Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={[styles.form, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[typography.h2, { color: theme.text, textAlign: 'center' }]}>
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={[typography.bodySmall, { color: theme.textSecondary, textAlign: 'center', marginTop: 4, marginBottom: spacing.xl }]}>
              {activeTab === 'login'
                ? 'Login to access your farming dashboard'
                : 'Register to start smart farming'}
            </Text>

            {activeTab === 'login' ? (
              <>
                <AppInput
                  label="Phone Number"
                  placeholder="Enter phone number"
                  icon="call-outline"
                  value={loginPhone}
                  onChangeText={setLoginPhone}
                  keyboardType="phone-pad"
                />
                <AppInput
                  label="Password"
                  placeholder="Enter password"
                  icon="lock-closed-outline"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry
                  onSubmitEditing={handleLogin}
                  returnKeyType="done"
                />
                <AppButton
                  title="Login"
                  onPress={handleLogin}
                  loading={loading}
                  icon="log-in-outline"
                  fullWidth
                  style={{ marginTop: spacing.md }}
                />
              </>
            ) : (
              <>
                <AppInput
                  label="Full Name"
                  placeholder="Enter your name"
                  icon="person-outline"
                  value={regName}
                  onChangeText={setRegName}
                  autoCapitalize="words"
                />
                <AppInput
                  label="Phone Number"
                  placeholder="Enter phone number"
                  icon="call-outline"
                  value={regPhone}
                  onChangeText={setRegPhone}
                  keyboardType="phone-pad"
                />
                <AppInput
                  label="Password"
                  placeholder="Create password"
                  icon="lock-closed-outline"
                  value={regPassword}
                  onChangeText={setRegPassword}
                  secureTextEntry
                />
                <AppInput
                  label="Confirm Password"
                  placeholder="Confirm password"
                  icon="lock-closed-outline"
                  value={regConfirm}
                  onChangeText={setRegConfirm}
                  secureTextEntry
                  onSubmitEditing={handleRegister}
                  returnKeyType="done"
                />
                <AppButton
                  title="Register"
                  onPress={handleRegister}
                  loading={loading}
                  icon="person-add-outline"
                  fullWidth
                  style={{ marginTop: spacing.md }}
                />
              </>
            )}

            <Text style={[typography.caption, { color: theme.textMuted, textAlign: 'center', marginTop: spacing.lg }]}>
              By continuing, you agree to our Terms of Service
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroGradient: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  formArea: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  form: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
});
