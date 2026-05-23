/**
 * BharatFarm Mobile App Entrypoint
 * Stably handles Safe Area context, Navigation provider, persistence loads,
 * and contains a robust global Error Boundary to prevent launch crashes.
 */

import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from './src/store/themeStore';
import { useAuthStore } from './src/store/authStore';
import { useGamificationStore } from './src/store/gamificationStore';
import AppNavigator from './src/navigation/AppNavigator';
import AppButton from './src/components/AppButton';
import { apiService } from './src/services/api';

// ── GLOBAL ERROR BOUNDARY SYSTEM ─────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Runtime Exception Caught:', error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <ScrollView contentContainerStyle={styles.errorContent}>
            <View style={styles.errorHeader}>
              <Text style={styles.errorEmoji}>⚠️</Text>
              <Text style={styles.errorTitle}>Application Error</Text>
              <Text style={styles.errorSubtitle}>BharatFarm encountered a launch-time conflict.</Text>
            </View>

            <View style={styles.errorDetailsBox}>
              <Text style={styles.errorDetailsTitle}>Diagnostic Message:</Text>
              <Text style={styles.errorDetailsBody}>
                {this.state.error?.toString() || 'Unknown runtime stack violation'}
              </Text>
            </View>

            <AppButton
              title="Reload Ecosystem"
              variant="primary"
              icon="refresh-outline"
              onPress={this.handleRestart}
              style={{ marginTop: 24 }}
            />
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

// Keep splash screen visible while loading initial state
SplashScreen.preventAutoHideAsync().catch(() => { });

export default function App() {
  const loadTheme = useThemeStore(s => s.loadTheme);
  const loadSession = useAuthStore(s => s.loadSession);
  const loadGamification = useGamificationStore(s => s.loadState);
  const theme = useThemeStore(s => s.theme);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load persistences with high safety margin
        await Promise.all([
          loadTheme().catch(e => console.warn('Failed to load Theme state:', e)),
          loadSession().catch(e => console.warn('Failed to load Auth state:', e)),
          loadGamification().catch(e => console.warn('Failed to load Gamification state:', e))
        ]);
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        setReady(true);
        await SplashScreen.hideAsync().catch(() => { });
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    // Publish Expo developer Metro session (fails/skips silently in production APK standalone)
    apiService.publishExpoSession().catch(() => {});
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  errorHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
  },
  errorDetailsBox: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  errorDetailsTitle: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  errorDetailsBody: {
    color: '#E2E8F0',
    fontSize: 13,
    fontFamily: 'monospace',
    marginTop: 8,
  },
});
