/**
 * HomeScreen - Main Dashboard
 * Shows greeting, XP bar, weather summary, and feature grid
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, Pressable,
  TextInput, ActivityIndicator, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useGamificationStore } from '../../store/gamificationStore';
import FeatureCard from '../../components/FeatureCard';
import XPBar from '../../components/XPBar';
import GradientCard from '../../components/GradientCard';
import { typography, spacing, borderRadius } from '../../theme';
import { getGreeting } from '../../utils/helpers';
import apiService from '../../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const toggleTheme = useThemeStore(s => s.toggleTheme);
  const currentUser = useAuthStore(s => s.currentUser);
  const { level, xp, streak_days } = useGamificationStore();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  // Backend connection checking states
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [showConfig, setShowConfig] = useState(false);
  const [inputIp, setInputIp] = useState('');
  const [checking, setChecking] = useState(false);

  const firstName = currentUser?.name?.split(' ')[0] || 'Farmer';
  const greeting = getGreeting();

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    setChecking(true);
    try {
      const res = await apiService.healthCheck();
      if (res && res.status === 'ok') {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
    } catch (e) {
      setBackendStatus('disconnected');
    } finally {
      setChecking(false);
    }
  };

  const handleUpdateIp = async () => {
    if (!inputIp.trim()) {
      Alert.alert('Error', 'Please enter a valid server URL');
      return;
    }

    let url = inputIp.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    setChecking(true);
    try {
      // Temporarily set baseUrl to verify connection
      const oldBase = apiService.baseUrl;
      apiService.baseUrl = url;
      const res = await apiService.healthCheck();
      
      if (res && res.status === 'ok') {
        await apiService.setBaseUrl(url);
        setBackendStatus('connected');
        setShowConfig(false);
        Alert.alert('Connected', `Successfully connected to backend at: ${url}`);
      } else {
        apiService.baseUrl = oldBase; // revert
        Alert.alert('Connection Failed', `Could not reach backend at ${url}. Verify address and port.`);
      }
    } catch (err) {
      Alert.alert('Connection Failed', `Failed to reach backend at ${url}: ${err.message}`);
    } finally {
      setChecking(false);
    }
  };

  const handleResetIp = async () => {
    setChecking(true);
    try {
      await apiService.resetBaseUrl();
      const res = await apiService.healthCheck();
      if (res && res.status === 'ok') {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
      Alert.alert('Reset Complete', `Restored default API Base: ${apiService.baseUrl}`);
    } catch (e) {
      setBackendStatus('disconnected');
    } finally {
      setChecking(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkBackend();
    await useGamificationStore.getState().loadState();
    setRefreshing(false);
  };

  const features = [
    {
      title: 'KrishiBot AI',
      subtitle: 'Talk to your farm advisor',
      emoji: '🤖',
      screen: 'KrishiBot',
      gradient: ['rgba(16, 185, 129, 0.12)', 'rgba(16, 185, 129, 0.03)'],
    },
    {
      title: 'Leaf Scanner',
      subtitle: 'AI disease detection',
      emoji: '🔬',
      screen: 'LeafScanner',
      gradient: ['rgba(14, 165, 233, 0.12)', 'rgba(14, 165, 233, 0.03)'],
    },
    {
      title: 'Weather',
      subtitle: 'Real-time forecast',
      emoji: '🌦️',
      screen: 'Weather',
      gradient: ['rgba(6, 182, 212, 0.12)', 'rgba(6, 182, 212, 0.03)'],
    },
    {
      title: 'KrishiMart',
      subtitle: 'Buy & sell crops',
      emoji: '🛒',
      screen: 'Marketplace',
      gradient: ['rgba(245, 158, 11, 0.12)', 'rgba(245, 158, 11, 0.03)'],
    },
    {
      title: 'Govt Schemes',
      subtitle: 'Find eligible schemes',
      emoji: '🏛️',
      screen: 'Schemes',
      gradient: ['rgba(139, 92, 246, 0.12)', 'rgba(139, 92, 246, 0.03)'],
    },
    {
      title: 'Calculator',
      subtitle: 'Cost & profit tools',
      emoji: '🧮',
      screen: 'Calculator',
      gradient: ['rgba(236, 72, 153, 0.12)', 'rgba(236, 72, 153, 0.03)'],
    },
  ];

  const quickTips = [
    { time: 'Morning', tip: 'Water crops early to reduce evaporation.', icon: '🌅' },
    { time: 'Afternoon', tip: 'Inspect crops for pests during warm hours.', icon: '☀️' },
    { time: 'Evening', tip: 'Apply fertilizers in cool evening for absorption.', icon: '🌇' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <LinearGradient
          colors={theme.gradient.hero}
          style={[styles.heroSection, { paddingTop: insets.top + 12 }]}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={[typography.caption, { color: 'rgba(255,255,255,0.6)' }]}>
                {greeting} 👋
              </Text>
              <Text style={[typography.h2, { color: '#FFFFFF' }]}>{firstName}</Text>
            </View>
            <View style={styles.topActions}>
              <Pressable
                onPress={toggleTheme}
                style={styles.iconBtn}
              >
                <Ionicons
                  name={theme.mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
                  size={22}
                  color="#FFF"
                />
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Profile')}
                style={styles.iconBtn}
              >
                <Ionicons name="person-circle-outline" size={26} color="#FFF" />
              </Pressable>
            </View>
          </View>

          {/* XP Bar in Hero */}
          <View style={styles.heroXP}>
            <XPBar compact />
          </View>

          {/* Tagline */}
          <View style={styles.heroTagline}>
            <Text style={styles.heroTitle}>Your AI Companion for{'\n'}
              <Text style={{ color: '#34D399' }}>Smarter Farming</Text>
            </Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <GradientCard style={styles.statCard}>
              <Text style={styles.statEmoji}>🌱</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>Lvl {level}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Level</Text>
            </GradientCard>
            <GradientCard style={styles.statCard}>
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{xp}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>XP</Text>
            </GradientCard>
            <GradientCard style={styles.statCard}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{streak_days}d</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Streak</Text>
            </GradientCard>
          </View>

          {/* Backend Connectivity Status Card */}
          <GradientCard style={styles.connectivityCard}>
            <View style={styles.connectivityHeader}>
              <View style={styles.connectivityTitleRow}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: backendStatus === 'connected' ? '#10B981' : backendStatus === 'disconnected' ? '#EF4444' : '#F59E0B' }
                ]} />
                <Text style={[typography.body, { color: theme.text, fontWeight: '700' }]}>
                  Backend Connectivity
                </Text>
              </View>
              <Pressable style={styles.configToggle} onPress={() => setShowConfig(!showConfig)}>
                <Ionicons name={showConfig ? "chevron-up" : "settings-outline"} size={18} color={theme.primary} />
              </Pressable>
            </View>

            <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 4 }]}>
              Base URL: {apiService.baseUrl}
            </Text>

            {backendStatus === 'disconnected' && !showConfig && (
              <Pressable onPress={() => setShowConfig(true)} style={styles.reconfigBanner}>
                <Ionicons name="alert-circle" size={14} color="#EF4444" style={{ marginRight: 6 }} />
                <Text style={[typography.caption, { color: '#EF4444', fontWeight: '700' }]}>
                  Backend Offline. Tap here to configure IP address.
                </Text>
              </Pressable>
            )}

            {showConfig && (
              <View style={styles.ipConfigArea}>
                <TextInput
                  style={[styles.ipInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.inputBg }]}
                  placeholder="e.g. 192.168.1.15:5000"
                  placeholderTextColor={theme.inputPlaceholder}
                  value={inputIp}
                  onChangeText={setInputIp}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.ipActionRow}>
                  <Pressable
                    onPress={handleUpdateIp}
                    disabled={checking}
                    style={[styles.ipBtn, { backgroundColor: theme.primary }]}
                  >
                    {checking ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={styles.ipBtnText}>Test & Connect</Text>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={handleResetIp}
                    disabled={checking}
                    style={[styles.ipBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.border }]}
                  >
                    <Text style={[styles.ipBtnText, { color: theme.text }]}>Reset Default</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </GradientCard>

          {/* Features Grid */}
          <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.base, marginTop: spacing.lg }]}>
            🌾 The Ecosystem
          </Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <FeatureCard
                  title={feature.title}
                  subtitle={feature.subtitle}
                  emoji={feature.emoji}
                  gradientColors={feature.gradient}
                  onPress={() => navigation.navigate(feature.screen)}
                />
              </View>
            ))}
          </View>

          {/* Quick Tips */}
          <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.base, marginTop: spacing.xl }]}>
            💡 Quick Tips for Today
          </Text>
          <GradientCard>
            {quickTips.map((tip, idx) => (
              <View
                key={idx}
                style={[
                  styles.tipRow,
                  idx < quickTips.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.divider },
                ]}
              >
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <View style={styles.tipContent}>
                  <Text style={[typography.bodySmall, { color: theme.primary, fontWeight: '600' }]}>
                    {tip.time}:
                  </Text>
                  <Text style={[typography.bodySmall, { color: theme.textSecondary, marginTop: 2 }]}>
                    {tip.tip}
                  </Text>
                </View>
              </View>
            ))}
          </GradientCard>

          {/* Gamification Progress */}
          <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.base, marginTop: spacing.xl }]}>
            🏆 Your Progress
          </Text>
          <XPBar />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  topActions: {
    flexDirection: 'row',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  heroXP: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  heroTagline: {
    marginTop: spacing.sm,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  content: {
    padding: spacing.lg,
    marginTop: -spacing.base,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.base,
    marginRight: 8,
  },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(spacing.md / 2),
  },
  featureItem: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    margin: spacing.md / 2,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  tipIcon: { fontSize: 20, marginRight: spacing.md },
  tipContent: { flex: 1 },
  connectivityCard: {
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  connectivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectivityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  configToggle: {
    padding: 4,
  },
  reconfigBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  ipConfigArea: {
    marginTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  ipInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  ipActionRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  ipBtn: {
    flex: 1,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  ipBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
