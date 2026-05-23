import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import { useThemeStore } from '../../store/themeStore';
import { spacing, borderRadius } from '../../theme';

const ALERTS = [
  { icon: 'cloudy-night-outline', title: 'Rain Watch', text: 'Delay pesticide spray if your field gets evening showers.', tone: '#38BDF8' },
  { icon: 'leaf-outline', title: 'Crop Care', text: 'Inspect lower tomato leaves for early blight rings twice this week.', tone: '#81C784' },
  { icon: 'sync-outline', title: 'Offline Queue', text: 'Scans and scheme searches retry automatically when network returns.', tone: '#F59E0B' },
  { icon: 'shield-checkmark-outline', title: 'Backend Fallback', text: 'BharatFarm keeps AI, weather, and wiki guidance available with local data.', tone: '#4CAF50' },
];

export default function NotificationsScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const alerts = useMemo(() => ALERTS, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Smart Alerts" subtitle="Graceful offline mode" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>No signal? Keep farming.</Text>
          <Text style={styles.bannerText}>Critical reminders, cached weather, local crop data, and retry-safe actions stay visible during poor rural connectivity.</Text>
        </View>
        {alerts.map(alert => (
          <View key={alert.title} style={styles.card}>
            <View style={[styles.icon, { borderColor: alert.tone, backgroundColor: `${alert.tone}20` }]}>
              <Ionicons name={alert.icon} size={20} color={alert.tone} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{alert.title}</Text>
              <Text style={styles.text}>{alert.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 120 },
  banner: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backgroundColor: 'rgba(76,175,80,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.25)',
    marginBottom: spacing.md,
  },
  bannerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  bannerText: { color: '#A2C2AC', marginTop: 8, lineHeight: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(12,22,14,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.22)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  icon: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  text: { color: '#A2C2AC', lineHeight: 19, marginTop: 4 },
});
