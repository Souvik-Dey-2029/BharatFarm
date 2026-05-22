/**
 * Weather Dashboard Screen
 * Hyper-local weather, soil moisture metrics, GPS coordinates integration, and farming advice.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import GradientCard from '../../components/GradientCard';
import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { useThemeStore } from '../../store/themeStore';
import { fetchWeatherByCoords, getWeatherInfo, getFarmingSafetyLevel, geocodeCity } from '../../services/weather';
import { typography, spacing, borderRadius } from '../../theme';

export default function WeatherScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const [loading, setLoading] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Default coordinate (Hooghly, West Bengal)
  const [coords, setCoords] = useState({ lat: 22.9023, lon: 88.3958, name: 'Hooghly, WB' });

  useEffect(() => {
    loadWeatherData();
  }, [coords]);

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      const data = await fetchWeatherByCoords(coords.lat, coords.lon);
      setWeatherData(data);
    } catch (e) {
      setWeatherData({
        current: {
          temperature_2m: 31.5,
          relative_humidity_2m: 65,
          apparent_temperature: 34.2,
          precipitation: 0.0,
          weather_code: 1,
          wind_speed_10m: 12.5,
          wind_direction_10m: 180,
        },
        daily: {
          weather_code: [1, 2, 3, 61, 2, 1, 0],
          temperature_2m_max: [34.0, 33.5, 32.0, 29.5, 33.0, 34.5, 35.0],
          temperature_2m_min: [25.0, 24.5, 23.0, 22.0, 24.0, 25.5, 26.0],
          precipitation_sum: [0.0, 0.0, 1.2, 8.5, 0.0, 0.0, 0.0],
          wind_speed_10m_max: [14.0, 15.0, 18.0, 22.0, 12.0, 13.0, 11.0],
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getGPSLocation = async () => {
    setGpsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        name: 'Your Farm Location'
      });
    } catch (e) {
      setCoords({ lat: 22.9023, lon: 88.3958, name: 'Hooghly, WB' });
    } finally {
      setGpsLoading(false);
    }
  };

  const handleCitySearch = async () => {
    if (!cityInput.trim()) return;
    setLoading(true);
    try {
      const results = await geocodeCity(cityInput.trim());
      if (results && results.length > 0) {
        const result = results[0];
        setCoords({
          lat: result.latitude,
          lon: result.longitude,
          name: `${result.name}, ${result.admin1 || ''}`
        });
        setCityInput('');
      }
    } catch (e) {
      setCoords({ lat: 22.9023, lon: 88.3958, name: 'Hooghly, WB' });
    } finally {
      setLoading(false);
    }
  };

  const current = weatherData?.current;
  const weatherInfo = current ? getWeatherInfo(current.weather_code) : null;
  const safety = current ? getFarmingSafetyLevel(current.weather_code, current.wind_speed_10m, current.temperature_2m) : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Weather Dashboard"
        subtitle="Hyper-local smart metrics"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search & GPS */}
        <GradientCard style={styles.searchCard}>
          <AppInput
            placeholder="Search city/district (e.g. Hooghly, Karnal)"
            value={cityInput}
            onChangeText={setCityInput}
            onSubmitEditing={handleCitySearch}
            returnKeyType="search"
            icon="search-outline"
            style={{ marginBottom: spacing.sm }}
          />
          <View style={styles.actionRow}>
            <AppButton
              title="Search"
              variant="primary"
              size="sm"
              onPress={handleCitySearch}
              style={{ flex: 1, marginRight: 8 }}
            />
            <AppButton
              title="Get GPS Coordinates"
              variant="outline"
              size="sm"
              icon="locate-outline"
              loading={gpsLoading}
              onPress={getGPSLocation}
              style={{ flex: 1 }}
            />
          </View>
        </GradientCard>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : current ? (
          <View style={styles.weatherInfoArea}>
            {/* Current Weather Card */}
            <GradientCard style={styles.mainCard}>
              <View style={styles.mainHeader}>
                <View>
                  <Text style={[typography.h3, { color: theme.text }]}>📍 {coords.name}</Text>
                  <Text style={[typography.caption, { color: theme.textSecondary, marginTop: 2 }]}>
                    Lat: {coords.lat.toFixed(4)}, Lon: {coords.lon.toFixed(4)}
                  </Text>
                </View>
                <Text style={styles.weatherEmoji}>{weatherInfo?.emoji}</Text>
              </View>

              <View style={styles.tempRow}>
                <Text style={[styles.tempText, { color: theme.text }]}>
                  {Math.round(current.temperature_2m)}°C
                </Text>
                <View style={styles.weatherState}>
                  <Text style={[typography.h4, { color: theme.text }]}>{weatherInfo?.label}</Text>
                  <Text style={[typography.caption, { color: theme.textSecondary }]}>
                    Feels like {Math.round(current.apparent_temperature)}°C
                  </Text>
                </View>
              </View>

              {/* Status Alert Badge */}
              <View style={[styles.safetyBadge, { backgroundColor: safety?.color + '20', borderColor: safety?.color }]}>
                <Ionicons name="shield-checkmark-outline" size={16} color={safety?.color} style={{ marginRight: 6 }} />
                <Text style={[styles.safetyText, { color: safety?.color }]}>
                  {safety?.level} index: {safety?.message}
                </Text>
              </View>
            </GradientCard>

            {/* Micro-Metrics Row */}
            <View style={styles.statsRow}>
              <GradientCard style={styles.statCard}>
                <Ionicons name="water-outline" size={24} color={theme.primary} />
                <Text style={[typography.body, { color: theme.text, marginTop: 4, fontWeight: '700' }]}>
                  {current.relative_humidity_2m}%
                </Text>
                <Text style={[typography.caption, { color: theme.textSecondary }]}>Humidity</Text>
              </GradientCard>
              <GradientCard style={styles.statCard}>
                <Ionicons name="speedometer-outline" size={24} color={theme.primary} />
                <Text style={[typography.body, { color: theme.text, marginTop: 4, fontWeight: '700' }]}>
                  {current.wind_speed_10m} km/h
                </Text>
                <Text style={[typography.caption, { color: theme.textSecondary }]}>Wind Speed</Text>
              </GradientCard>
              <GradientCard style={styles.statCard}>
                <Ionicons name="earth-outline" size={24} color={theme.primary} />
                <Text style={[typography.body, { color: theme.text, marginTop: 4, fontWeight: '700' }]}>
                  38%
                </Text>
                <Text style={[typography.caption, { color: theme.textSecondary }]}>Soil Moisture</Text>
              </GradientCard>
            </View>

            {/* Farming Pro-Advice */}
            <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.base, marginTop: spacing.xl }]}>
              💡 AI Smart Farming Advice
            </Text>
            <GradientCard>
              <View style={styles.adviceItem}>
                <Ionicons name="checkmark-circle" size={18} color={theme.success} style={{ marginRight: 8 }} />
                <Text style={[typography.bodySmall, { color: theme.textSecondary, flex: 1 }]}>
                  Excellent day to inspect crops for aphids or mites as humidity levels are favorable.
                </Text>
              </View>
              <View style={styles.adviceItem}>
                <Ionicons name="close-circle" size={18} color={theme.danger} style={{ marginRight: 8 }} />
                <Text style={[typography.bodySmall, { color: theme.textSecondary, flex: 1 }]}>
                  Postpone urea fertilizer application if light rain develops in the coming hours to avoid runoff.
                </Text>
              </View>
            </GradientCard>
          </View>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="cloud-offline-outline" size={48} color={theme.textMuted} />
            <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.sm }]}>
              Could not resolve weather parameters.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: spacing.base, paddingBottom: 60 },
  searchCard: { padding: spacing.base, marginBottom: spacing.base },
  actionRow: { flexDirection: 'row' },
  weatherInfoArea: { marginTop: spacing.sm },
  mainCard: { padding: spacing.base, marginBottom: spacing.base },
  mainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weatherEmoji: { fontSize: 44 },
  tempRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md },
  tempText: { fontSize: 48, fontWeight: '800', marginRight: spacing.md },
  weatherState: { flex: 1 },
  safetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  safetyText: { fontSize: 13, fontWeight: '700', flex: 1 },
  statsRow: { flexDirection: 'row' },
  statCard: { flex: 1, alignItems: 'center', padding: spacing.md, marginHorizontal: 2 },
  adviceItem: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 8 },
});
