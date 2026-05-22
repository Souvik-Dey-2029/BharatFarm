/**
 * Profile Screen
 * Farmer profile management, onboarding configuration details, XP badge awards overview, and settings.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import GradientCard from '../../components/GradientCard';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useGamificationStore } from '../../store/gamificationStore';
import { typography, spacing, borderRadius } from '../../theme';

export default function ProfileScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const { currentUser, updateProfile, logout } = useAuthStore();
  const { badges, achievements, level, xp } = useGamificationStore();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [stateName, setStateName] = useState(currentUser?.state || 'West Bengal');
  const [land, setLand] = useState(currentUser?.landSize || '');

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        state: stateName.trim(),
        landSize: land.trim(),
      });
      setIsEditing(false);
      Alert.alert('Success', 'Profile details updated successfully');
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  // Find unlocked badge structures
  const unlockedBadges = achievements.filter(badge => badges.includes(badge.id));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="My Profile"
        subtitle="Farmer smart settings"
        onBack={() => navigation.goBack()}
        rightIcon={isEditing ? "close-outline" : "create-outline"}
        rightAction={() => setIsEditing(!isEditing)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar/Stats area */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>🧑‍🌾</Text>
          </View>
          <Text style={[typography.h2, { color: theme.text, marginTop: spacing.sm }]}>
            {currentUser?.name || 'Farmer'}
          </Text>
          <Text style={[typography.caption, { color: theme.textSecondary }]}>
            Level {level} Cultivator • {xp} XP Accumulated
          </Text>
        </View>

        {isEditing ? (
          <GradientCard style={styles.card}>
            <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
              🔧 Edit Details
            </Text>
            <AppInput label="Full Name" value={name} onChangeText={setName} />
            <AppInput label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <AppInput label="Farming State" value={stateName} onChangeText={setStateName} />
            <AppInput label="Land Size (Acres)" value={land} onChangeText={setLand} keyboardType="numeric" />

            <AppButton
              title="Save Profile"
              variant="primary"
              loading={saving}
              onPress={handleSave}
              style={{ marginTop: spacing.md }}
              fullWidth
            />
          </GradientCard>
        ) : (
          <View>
            <GradientCard style={styles.card}>
              <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
                📝 Account details
              </Text>
              <View style={styles.detailsRow}>
                <Text style={{ color: theme.textSecondary }}>Registered Phone:</Text>
                <Text style={{ color: theme.text, fontWeight: '600' }}>{currentUser?.phone}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={{ color: theme.textSecondary }}>State Jurisdiction:</Text>
                <Text style={{ color: theme.text, fontWeight: '600' }}>{currentUser?.state || 'West Bengal'}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={{ color: theme.textSecondary }}>Cultivable Acreage:</Text>
                <Text style={{ color: theme.text, fontWeight: '600' }}>
                  {currentUser?.landSize ? `${currentUser.landSize} Acres` : 'Not set'}
                </Text>
              </View>
            </GradientCard>

            {/* Badges section */}
            <Text style={[typography.h3, { color: theme.text, marginVertical: spacing.md }]}>
              🏆 Achievements & Badges ({unlockedBadges.length})
            </Text>
            {unlockedBadges.length > 0 ? (
              <View style={styles.badgesRow}>
                {unlockedBadges.map(badge => (
                  <View key={badge.id} style={[styles.badgeItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={[styles.badgeIcon, { backgroundColor: theme.primary + '20' }]}>
                      <Ionicons name={badge.icon} size={24} color={theme.primary} />
                    </View>
                    <Text style={[typography.bodySmall, { color: theme.text, fontWeight: '700', marginTop: 4 }]} numberOfLines={1}>
                      {badge.title}
                    </Text>
                    <Text style={[typography.caption, { color: theme.textSecondary, textAlign: 'center' }]} numberOfLines={1}>
                      {badge.description}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <GradientCard style={{ alignItems: 'center', padding: spacing.lg }}>
                <Ionicons name="trophy-outline" size={32} color={theme.textMuted} />
                <Text style={[typography.bodySmall, { color: theme.textSecondary, marginTop: 4 }]}>
                  No achievements unlocked yet. Scan leaves or talk to KrishiBot to earn badges!
                </Text>
              </GradientCard>
            )}

            <AppButton
              title="Sign Out"
              variant="outline"
              icon="log-out-outline"
              onPress={handleLogout}
              style={{ marginTop: spacing.xl }}
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.base, paddingBottom: 60 },
  avatarSection: { alignItems: 'center', marginVertical: spacing.lg },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 44 },
  card: { padding: spacing.base },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E2E8F0' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  badgeItem: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    margin: 4,
  },
  badgeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
