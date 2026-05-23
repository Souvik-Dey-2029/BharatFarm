import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppInput from '../../components/AppInput';
import apiService from '../../services/api';
import { useThemeStore } from '../../store/themeStore';
import { spacing, borderRadius } from '../../theme';

export default function WikiScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    apiService.getWikiDiseases()
      .then(res => {
        const data = res?.data || res?.diseases || [];
        if (mounted) setItems(Array.isArray(data) ? data : []);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => `${item.name_en || item.name || ''} ${item.crop || ''} ${item.description || ''}`.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title="Crop Health Wiki" subtitle="Disease and pest playbooks" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppInput value={query} onChangeText={setQuery} placeholder="Search disease, pest, crop" leftIcon="search-outline" />
        {loading ? <ActivityIndicator color="#4CAF50" style={{ marginTop: 30 }} /> : filtered.map(item => (
          <View key={item.id || item.name_en} style={styles.card}>
            <View style={styles.titleRow}>
              <Ionicons name="medical-outline" size={20} color="#81C784" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.title}>{item.name_en || item.name}</Text>
                <Text style={styles.crop}>{item.crop || 'General crop health'}</Text>
              </View>
            </View>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.section}>Symptoms</Text>
            {(item.symptoms || []).slice(0, 4).map(symptom => <Text key={symptom} style={styles.bullet}>- {symptom}</Text>)}
            <Text style={styles.section}>Actions</Text>
            {(item.solutions || item.treatments || []).slice(0, 4).map(solution => <Text key={solution} style={styles.bullet}>- {solution}</Text>)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 120 },
  card: {
    backgroundColor: 'rgba(12,22,14,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.22)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  crop: { color: '#81C784', fontSize: 12, marginTop: 2 },
  desc: { color: '#D7F7D8', lineHeight: 19, marginTop: 12 },
  section: { color: '#FCD34D', fontWeight: '900', marginTop: 14, marginBottom: 4 },
  bullet: { color: '#A2C2AC', lineHeight: 20 },
});
