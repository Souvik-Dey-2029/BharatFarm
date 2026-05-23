import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppInput from '../../components/AppInput';
import { useThemeStore } from '../../store/themeStore';
import { typography, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

const CROPS = [
  {
    id: 'rice',
    name: 'Rice',
    season: 'Kharif / Rabi',
    duration: '110-140 days',
    seedRate: '20-25 kg/acre',
    water: 'Maintain 3-5 cm standing water during tillering.',
    roadmap: ['Nursery prep', 'Transplanting', 'Tillering nutrition', 'Panicle care', 'Harvest at 20-22% grain moisture'],
  },
  {
    id: 'wheat',
    name: 'Wheat',
    season: 'Rabi',
    duration: '120-150 days',
    seedRate: '40-50 kg/acre',
    water: 'First irrigation at crown root initiation, then at tillering and flowering.',
    roadmap: ['Seed treatment', 'Line sowing', 'CRI irrigation', 'Rust inspection', 'Harvest at 12-14% moisture'],
  },
  {
    id: 'potato',
    name: 'Potato',
    season: 'Rabi',
    duration: '90-120 days',
    seedRate: '600-800 kg/acre',
    water: 'Keep ridges moist but avoid waterlogging.',
    roadmap: ['Sprout seed tubers', 'Ridge planting', 'Earthing up', 'Late blight watch', 'Cure before storage'],
  },
  {
    id: 'tomato',
    name: 'Tomato',
    season: 'Year-round',
    duration: '100-120 days',
    seedRate: '60-80 g/acre',
    water: 'Drip irrigation is ideal; avoid leaf wetness.',
    roadmap: ['Nursery trays', 'Transplanting', 'Staking', 'Blight prevention', 'Grade and sell'],
  },
];

export default function CropsScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const [query, setQuery] = useState('');
  const crops = useMemo(() => CROPS.filter(c => c.name.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Crop Roadmaps" subtitle="Offline crop database" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['rgba(76,175,80,0.18)', 'rgba(245,158,11,0.08)']} style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="leaf-outline" size={26} color="#81C784" />
          </View>
          <Text style={styles.heroTitle}>Local crop intelligence</Text>
          <Text style={styles.heroText}>Seed rates, timelines, irrigation cues, and stage-wise roadmap stay available without internet.</Text>
        </LinearGradient>

        <AppInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search crop"
          leftIcon="search-outline"
          containerStyle={{ marginBottom: spacing.md }}
        />

        {crops.map(crop => (
          <View key={crop.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cropName}>{crop.name}</Text>
                <Text style={styles.meta}>{crop.season} - {crop.duration}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{crop.seedRate}</Text>
              </View>
            </View>
            <Text style={styles.water}>{crop.water}</Text>
            {crop.roadmap.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <Text style={styles.stepNum}>{index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 120 },
  hero: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.25)',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(76,175,80,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  heroText: { color: '#A2C2AC', lineHeight: 20, marginTop: 8, maxWidth: width - 70 },
  card: {
    backgroundColor: 'rgba(12,22,14,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.22)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cropName: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  meta: { color: '#81C784', marginTop: 4, fontSize: 12, fontWeight: '700' },
  badge: { backgroundColor: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.35)', borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: '#FCD34D', fontSize: 11, fontWeight: '800' },
  water: { color: '#D7F7D8', lineHeight: 19, marginVertical: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(76,175,80,0.16)', color: '#81C784', textAlign: 'center', lineHeight: 24, fontWeight: '900', marginRight: 10 },
  stepText: { flex: 1, color: '#A2C2AC', fontSize: 13 },
});
