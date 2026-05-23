/**
 * Government Scheme Assistant Screen
 * AI-powered central and state government scheme matcher for Indian farmers.
 * Filters by land size, state, and primary crops.
 * Upgraded to high-fidelity dark glassmorphism, golden rewards ribbon styling, and clear action step guides.
 */

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Linking, Dimensions, Pressable, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import GradientCard from '../../components/GradientCard';
import { useThemeStore } from '../../store/themeStore';
import apiService from '../../services/api';
import { typography, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

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
      // Offline fallback government schemes match
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
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Background ambient lighting */}
      <View style={styles.schemesAmbientGlow} />

      <ScreenHeader
        title="Scheme Matcher"
        subtitle="AI eligible government subsidies"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!schemes ? (
          <View style={styles.formCardGlass}>
            <Text style={styles.cardHeading}>
              📋 Eligibility Parameters
            </Text>
            <Text style={styles.cardSubText}>
              Find fully subsidized financial schemes provided by both the Central Government and your state
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
          </View>
        ) : (
          <View>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsHeadingText}>
                🏛️ Match Results ({schemes.length})
              </Text>
              <Pressable onPress={() => setSchemes(null)} style={styles.resetBtn}>
                <Text style={{ color: '#4CAF50', fontWeight: '700' }}>Modify Profile</Text>
              </Pressable>
            </View>

            {schemes.map((scheme, idx) => (
              <View key={idx} style={styles.schemeCardGlass}>
                <View style={styles.schemeHeader}>
                  <View style={styles.typeBadgeGlass}>
                    <Text style={styles.typeBadgeText}>
                      {scheme.type?.toUpperCase()} SCHEME
                    </Text>
                  </View>
                  <Ionicons name="ribbon" size={20} color="#F59E0B" />
                </View>

                <Text style={styles.schemeTitleText}>
                  {scheme.name}
                </Text>

                <Text style={styles.schemeDescText}>
                  {scheme.description}
                </Text>

                {/* Benefits */}
                <Text style={styles.subHeadingText}>
                  🎁 Subsidies & Benefits
                </Text>
                {scheme.benefits && scheme.benefits.map((benefit, bIdx) => (
                  <View key={bIdx} style={styles.bulletRow}>
                    <Ionicons name="gift-outline" size={14} color="#F59E0B" style={{ marginRight: 8, marginTop: 2 }} />
                    <Text style={styles.bulletText}>
                      {benefit}
                    </Text>
                  </View>
                ))}

                {/* Apply Steps */}
                <Text style={styles.subHeadingTextGreen}>
                  📝 How to Apply
                </Text>
                {scheme.applySteps && scheme.applySteps.map((step, sIdx) => (
                  <View key={sIdx} style={styles.bulletRow}>
                    <Text style={styles.stepNumText}>{sIdx + 1}.</Text>
                    <Text style={styles.bulletText}>
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
              </View>
            ))}
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
  schemesAmbientGlow: {
    position: 'absolute',
    top: 80,
    left: -100,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  formCardGlass: {
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    padding: 20,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardSubText: {
    fontSize: 12,
    color: '#A2C2AC',
    marginBottom: 20,
    lineHeight: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resultsHeadingText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resetBtn: {
    padding: 4,
  },
  schemeCardGlass: {
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    padding: 20,
    marginBottom: spacing.base,
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadgeGlass: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.25)',
  },
  typeBadgeText: {
    color: '#81C784',
    fontSize: 8,
    fontWeight: '800',
  },
  schemeTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: spacing.sm,
  },
  schemeDescText: {
    fontSize: 13,
    color: '#A2C2AC',
    lineHeight: 18,
    marginTop: 6,
  },
  subHeadingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FCD34D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subHeadingTextGreen: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4CAF50',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  bulletText: {
    fontSize: 12,
    color: '#A2C2AC',
    flex: 1,
    lineHeight: 16,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4CAF50',
    marginRight: 8,
    width: 14,
  },
});
