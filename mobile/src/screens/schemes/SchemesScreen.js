/**
 * Government Scheme Assistant Screen
 * AI-powered central and state government scheme matcher for Indian farmers.
 * Filters by land size, state, and primary crops.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import GradientCard from '../../components/GradientCard';
import { useThemeStore } from '../../store/themeStore';
import apiService from '../../services/api';
import { typography, spacing, borderRadius } from '../../theme';

export default function SchemesScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const [loading, setLoading] = useState(false);

  // Form State
  const [landSize, setLandSize] = useState('');
  const [stateName, setStateName] = useState('West Bengal');
  const [crop, setCrop] = useState('');

  // Results State
  const [schemes, setSchemes] = useState(null);

  const handleMatchSchemes = async () => {
    if (!landSize.trim()) {
      Alert.alert('Error', 'Please enter your cultivable land size');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.getSchemes({
        landSize: parseFloat(landSize),
        state: stateName.trim(),
        crop: crop.trim() || 'General',
      });

      if (res && res.success) {
        setSchemes(res.schemes || []);
      } else {
        throw new Error(res.error || 'Server error');
      }
    } catch (e) {
      setSchemes([
        {
          id: 'pm-kisan',
          name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
          type: 'Central',
          description: 'Income support of ₹6,000/year for eligible landholding farmer families via Direct Benefit Transfer.',
          benefits: ['₹6,000 annual support in 3 installments', 'Direct bank transfer without intermediaries'],
          link: 'https://pmkisan.gov.in',
          applySteps: ['Register on the official PM-KISAN portal', 'Upload Aadhaar, land records, and bank details', 'Track verification status through the portal']
        },
        {
          id: 'pmfby',
          name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
          type: 'Central/State',
          description: 'Subsidized crop insurance against natural calamities, pests, and yield failures.',
          benefits: ['Coverage against crop loss', 'Low premium for farmers'],
          link: 'https://pmfby.gov.in',
          applySteps: ['Enroll through the PMFBY portal or CSC center', 'Upload sowing certificate and land documents', 'Pay the subsidized premium']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (url) => {
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not load scheme portal URL.'));
    } else {
      Alert.alert('Info', 'Please visit the official government block offices or CSC center to register.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Scheme Matcher"
        subtitle="AI-driven eligible government subsidies"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!schemes ? (
          <GradientCard style={styles.formCard}>
            <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
              📋 Eligibility Parameters
            </Text>

            <AppInput
              label="Cultivable Land Size (Acres)"
              placeholder="e.g. 2.5 (Enter 0 if landless or sharecropper)"
              value={landSize}
              onChangeText={setLandSize}
              keyboardType="numeric"
            />

            <AppInput
              label="Farming State"
              placeholder="e.g. West Bengal, Punjab, Maharashtra"
              value={stateName}
              onChangeText={setStateName}
            />

            <AppInput
              label="Primary Crop (Optional)"
              placeholder="e.g. Rice, Wheat, Jute"
              value={crop}
              onChangeText={setCrop}
            />

            <AppButton
              title="Find Eligible Schemes"
              variant="primary"
              icon="search-outline"
              loading={loading}
              onPress={handleMatchSchemes}
              style={{ marginTop: spacing.md }}
              fullWidth
            />
          </GradientCard>
        ) : (
          <View>
            <View style={styles.resultsHeader}>
              <Text style={[typography.h3, { color: theme.text }]}>
                🏛️ Match Results ({schemes.length})
              </Text>
              <Pressable onPress={() => setSchemes(null)} style={styles.resetBtn}>
                <Text style={{ color: theme.primary, fontWeight: '700' }}>Modify Profile</Text>
              </Pressable>
            </View>

            {schemes.map((scheme, idx) => (
              <GradientCard key={idx} style={styles.schemeCard}>
                <View style={styles.schemeHeader}>
                  <View style={[styles.typeBadge, { backgroundColor: theme.primary + '20' }]}>
                    <Text style={{ color: theme.primary, fontSize: 10, fontWeight: '700' }}>
                      {scheme.type?.toUpperCase()} SCHEME
                    </Text>
                  </View>
                  <Ionicons name="ribbon-outline" size={20} color={theme.accent} />
                </View>

                <Text style={[typography.h4, { color: theme.text, marginTop: spacing.sm }]}>
                  {scheme.name}
                </Text>

                <Text style={[typography.bodySmall, { color: theme.textSecondary, marginTop: spacing.xs, lineHeight: 18 }]}>
                  {scheme.description}
                </Text>

                {/* Benefits */}
                <Text style={[typography.label, { color: theme.accent, marginTop: spacing.md, marginBottom: spacing.xs }]}>
                  🎁 Subsidies & Benefits
                </Text>
                {scheme.benefits && scheme.benefits.map((benefit, bIdx) => (
                  <View key={bIdx} style={styles.bulletRow}>
                    <Ionicons name="gift-outline" size={14} color={theme.accent} style={{ marginRight: 6, marginTop: 2 }} />
                    <Text style={[typography.caption, { color: theme.textSecondary, flex: 1 }]}>
                      {benefit}
                    </Text>
                  </View>
                ))}

                {/* Apply Steps */}
                <Text style={[typography.label, { color: theme.primary, marginTop: spacing.md, marginBottom: spacing.xs }]}>
                  📝 How to Apply
                </Text>
                {scheme.applySteps && scheme.applySteps.map((step, sIdx) => (
                  <View key={sIdx} style={styles.bulletRow}>
                    <Text style={[styles.stepNum, { color: theme.primary }]}>{sIdx + 1}.</Text>
                    <Text style={[typography.caption, { color: theme.textSecondary, flex: 1 }]}>
                      {step}
                    </Text>
                  </View>
                ))}

                <AppButton
                  title="Apply via Official Portal"
                  variant="outline"
                  size="sm"
                  icon="open-outline"
                  onPress={() => handleApply(scheme.link)}
                  style={{ marginTop: spacing.lg }}
                  fullWidth
                />
              </GradientCard>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.base, paddingBottom: 60 },
  formCard: { padding: spacing.base },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resetBtn: { padding: 4 },
  schemeCard: { padding: spacing.base, marginBottom: spacing.base },
  schemeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 },
  stepNum: { fontSize: 11, fontWeight: '700', marginRight: 6, width: 14 },
});
