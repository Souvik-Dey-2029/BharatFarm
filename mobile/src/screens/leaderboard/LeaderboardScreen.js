import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import XPBar from '../../components/XPBar';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useGamificationStore } from '../../store/gamificationStore';
import { spacing, borderRadius } from '../../theme';

export default function LeaderboardScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const currentUser = useAuthStore(s => s.currentUser);
  const { getLeaderboard, achievements, badges } = useGamificationStore();
  const rows = getLeaderboard(currentUser?.name || 'You').slice(0, 12);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Farmer League" subtitle="XP, badges, streaks" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.panel}>
          <XPBar />
        </View>
        {rows.map(row => (
          <View key={`${row.rank}-${row.name}`} style={[styles.row, row.isUser && styles.userRow]}>
            <Text style={[styles.rank, row.rank <= 3 && styles.topRank]}>#{row.rank}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{row.name}</Text>
              <Text style={styles.meta}>{row.isUser ? 'Your current BharatFarm rank' : 'Community farmer'}</Text>
            </View>
            <Text style={styles.xp}>{row.xp} XP</Text>
          </View>
        ))}
        <Text style={styles.section}>Unlocked Badges</Text>
        <View style={styles.badgeGrid}>
          {achievements.map(badge => {
            const unlocked = badges.includes(badge.id);
            return (
              <View key={badge.id} style={[styles.badge, !unlocked && styles.lockedBadge]}>
                <Ionicons name={unlocked ? 'ribbon-outline' : 'lock-closed-outline'} size={18} color={unlocked ? '#FCD34D' : '#688E75'} />
                <Text style={[styles.badgeText, !unlocked && { color: '#688E75' }]}>{badge.title}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 120 },
  panel: { backgroundColor: 'rgba(12,22,14,0.72)', borderWidth: 1, borderColor: 'rgba(76,175,80,0.22)', borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(12,22,14,0.72)', borderWidth: 1, borderColor: 'rgba(76,175,80,0.18)', borderRadius: borderRadius.md, padding: spacing.md, marginBottom: 10 },
  userRow: { borderColor: 'rgba(245,158,11,0.45)', backgroundColor: 'rgba(245,158,11,0.10)' },
  rank: { width: 42, color: '#A2C2AC', fontWeight: '900' },
  topRank: { color: '#FCD34D' },
  name: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
  meta: { color: '#688E75', fontSize: 11, marginTop: 2 },
  xp: { color: '#81C784', fontWeight: '900' },
  section: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginVertical: spacing.md },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  badge: { width: '48%', marginRight: '2%', marginBottom: 10, borderRadius: borderRadius.md, borderWidth: 1, borderColor: 'rgba(245,158,11,0.28)', backgroundColor: 'rgba(245,158,11,0.10)', padding: spacing.sm },
  lockedBadge: { borderColor: 'rgba(104,142,117,0.18)', backgroundColor: 'rgba(104,142,117,0.06)' },
  badgeText: { color: '#FCD34D', fontWeight: '800', fontSize: 11, marginTop: 6 },
});
