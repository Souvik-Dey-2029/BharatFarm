/**
 * Profile Screen
 * Farmer profile management, onboarding configuration details, XP badge awards overview, and settings.
 * Upgraded to high-fidelity dark glassmorphic styling, glowing rewards grid, and organic details row.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, Pressable, Dimensions, Platform
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

const { width } = Dimensions.get('window');

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
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Background ambient lighting */}
      <View style={styles.profileAmbientGlow} />

      <ScreenHeader
        title="My Profile"
        subtitle="Farmer smart settings"
        onBack={() => navigation.goBack()}
        rightIcon={isEditing ? "close-outline" : "create-outline"}
        rightAction={() => setIsEditing(!isEditing)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Glowing Avatar stats replication */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarGlowOuter}>
            <View style={styles.avatarGlowInner}>
              <Text style={styles.avatarText}>🧑‍🌾</Text>
            </View>
          </View>
          <Text style={styles.avatarNameText}>
            {currentUser?.name || 'Farmer'}
          </Text>
          <Text style={styles.avatarLevelText}>
            Level {level} Cultivator • {xp} XP Accumulated
          </Text>
        </View>

        {isEditing ? (
          <View style={styles.cardGlass}>
            <Text style={styles.cardHeading}>
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
          </View>
        ) : (
          <View>
            <View style={styles.cardGlass}>
              <Text style={styles.cardHeading}>
                📝 Account details
              </Text>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsRowLabel}>Registered Phone:</Text>
                <Text style={styles.detailsRowVal}>{currentUser?.phone}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsRowLabel}>State Jurisdiction:</Text>
                <Text style={styles.detailsRowVal}>{currentUser?.state || 'West Bengal'}</Text>
              </View>
              <View style={[styles.detailsRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailsRowLabel}>Cultivable Acreage:</Text>
                <Text style={styles.detailsRowVal}>
                  {currentUser?.landSize ? `${currentUser.landSize} Acres` : 'Not set'}
                </Text>
              </View>
            </View>

            {/* Badges section grid matching website achievements */}
            <Text style={[typography.h3, { color: '#FFFFFF', marginVertical: spacing.md, marginTop: spacing.xl }]}>
              🏆 Achievements & Badges ({unlockedBadges.length})
            </Text>
            {unlockedBadges.length > 0 ? (
              <View style={styles.badgesRow}>
                {unlockedBadges.map(badge => (
                  <View key={badge.id} style={styles.badgeItemGlass}>
                    <View style={styles.badgeIconWrapper}>
                      <Ionicons name={badge.icon} size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.badgeTitleText} numberOfLines={1}>
                      {badge.title}
                    </Text>
                    <Text style={styles.badgeDescText} numberOfLines={1}>
                      {badge.description}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <GradientCard style={{ alignItems: 'center', padding: spacing.lg }}>
                <Ionicons name="trophy-outline" size={32} color="#688E75" />
                <Text style={{ color: '#A2C2AC', marginTop: 8, fontSize: 13, textAlign: 'center' }}>
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
  container: {
    flex: 1,
  },
  profileAmbientGlow: {
    position: 'absolute',
    top: 80,
    right: -100,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  avatarGlowOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarGlowInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(16, 26, 18, 0.9)',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  avatarNameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: spacing.sm,
  },
  avatarLevelText: {
    fontSize: 12,
    color: '#A2C2AC',
    marginTop: 2,
  },
  cardGlass: {
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    padding: 20,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.15)',
  },
  detailsRowLabel: {
    color: '#A2C2AC',
    fontSize: 13,
  },
  detailsRowVal: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badgeItemGlass: {
    width: (width - 40 - 8) / 2, // Perfect 2-column grid
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.25)',
    padding: 14,
    alignItems: 'center',
  },
  badgeIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.28)',
  },
  badgeTitleText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 6,
  },
  badgeDescText: {
    fontSize: 10,
    color: '#A2C2AC',
    marginTop: 2,
    textAlign: 'center',
  },
});
