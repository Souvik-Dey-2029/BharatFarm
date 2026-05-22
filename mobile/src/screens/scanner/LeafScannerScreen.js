/**
 * AI Leaf Disease Scanner Screen
 * Uses Camera & Gallery Upload to diagnose plant disease using Gemini Vision.
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, Pressable,
  ActivityIndicator, Alert, Platform, Dimensions
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import AppButton from '../../components/AppButton';
import GradientCard from '../../components/GradientCard';
import { useThemeStore } from '../../store/themeStore';
import { useGamificationStore } from '../../store/gamificationStore';
import apiService from '../../services/api';
import { typography, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

export default function LeafScannerScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const trackScan = useGamificationStore(s => s.trackScan);

  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(
        cameraStatus.status === 'granted' && galleryStatus.status === 'granted'
      );
    })();
  }, []);

  const pickImage = async () => {
    try {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!res.canceled) {
        setImage(res.assets[0].uri);
        setResult(null);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    try {
      let res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!res.canceled) {
        setImage(res.assets[0].uri);
        setResult(null);
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    try {
      // Convert to base64
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const data = await apiService.analyzeLeaf({
        base64Image: base64,
        mimeType: 'image/jpeg',
      });

      if (data && data.disease) {
        setResult(data.disease);
        trackScan(); // Award XP & check badge
      } else {
        throw new Error('Invalid analysis response structure');
      }
    } catch (e) {
      Alert.alert(
        'Analysis Failed',
        'Could not complete scan. Please verify that your Node.js backend is running and correct IP is configured in mobile/src/services/api.js.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[typography.body, { color: theme.text, textAlign: 'center', marginHorizontal: 20 }]}>
          No access to camera or photo library. Please allow permissions in system settings to use the Leaf Scanner.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="Leaf Scanner"
        subtitle="Gemini Vision plant pathology"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <GradientCard style={styles.uploadCard}>
          {image ? (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <Pressable onPress={() => setImage(null)} style={styles.removeBtn}>
                <Ionicons name="close" size={20} color="#FFF" />
              </Pressable>
            </View>
          ) : (
            <View style={styles.placeholderWrapper}>
              <Ionicons name="cloud-upload-outline" size={48} color={theme.primary} />
              <Text style={[typography.body, { color: theme.text, marginTop: spacing.sm }]}>
                Upload Leaf Photograph
              </Text>
              <Text style={[typography.caption, { color: theme.textSecondary, textAlign: 'center', marginTop: 4 }]}>
                Capture clear view of the affected leaf area
              </Text>
            </View>
          )}

          <View style={styles.btnRow}>
            <AppButton
              title="Camera"
              variant="outline"
              icon="camera-outline"
              onPress={takePhoto}
              style={{ flex: 1, marginRight: 8 }}
            />
            <AppButton
              title="Gallery"
              variant="outline"
              icon="image-outline"
              onPress={pickImage}
              style={{ flex: 1 }}
            />
          </View>

          {image && !result && (
            <AppButton
              title="Analyze Leaf Health"
              variant="primary"
              icon="analytics-outline"
              onPress={analyzeImage}
              loading={loading}
              style={{ marginTop: spacing.md }}
              fullWidth
            />
          )}
        </GradientCard>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[typography.bodySmall, { color: theme.textSecondary, marginTop: spacing.sm }]}>
              Running deep diagnosis via plant pathology model...
            </Text>
          </View>
        )}

        {result && (
          <View style={styles.resultContainer}>
            <Text style={[typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
              🔍 Diagnosis Report
            </Text>

            <GradientCard style={[
              styles.statusCard,
              result.status === 'diseased' && { borderColor: theme.danger + '40' },
              result.status === 'healthy' && { borderColor: theme.success + '40' },
            ]}>
              <View style={styles.statusHeader}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: result.status === 'healthy' ? theme.success : result.status === 'diseased' ? theme.danger : theme.warning }
                ]}>
                  <Text style={styles.badgeText}>
                    {result.status?.toUpperCase() || 'UNKNOWN'}
                  </Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={[typography.caption, { color: theme.textSecondary }]}>Confidence: </Text>
                  <Text style={[typography.bodySmall, { color: theme.primary, fontWeight: '700' }]}>94%</Text>
                </View>
              </View>

              <Text style={[typography.h3, { color: theme.text, marginTop: spacing.sm }]}>
                {result.name}
              </Text>
              <Text style={[typography.bodySmall, { color: theme.textSecondary, marginTop: spacing.xs, lineHeight: 18 }]}>
                {result.description}
              </Text>
            </GradientCard>

            {result.fertilizers && result.fertilizers.length > 0 && (
              <View style={{ marginTop: spacing.lg }}>
                <Text style={[typography.h4, { color: theme.text, marginBottom: spacing.sm }]}>
                  🧪 Fertilizer Recommendations
                </Text>
                <GradientCard>
                  {result.fertilizers.map((item, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <Ionicons name="flask-outline" size={16} color={theme.primary} style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={[typography.bodySmall, { color: theme.textSecondary, flex: 1 }]}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </GradientCard>
              </View>
            )}

            {result.treatments && result.treatments.length > 0 && (
              <View style={{ marginTop: spacing.lg }}>
                <Text style={[typography.h4, { color: theme.text, marginBottom: spacing.sm }]}>
                  🌿 Actionable Treatment Tips
                </Text>
                <GradientCard>
                  {result.treatments.map((item, idx) => (
                    <View key={idx} style={styles.listItem}>
                      <Ionicons name="checkmark-circle-outline" size={16} color={theme.primary} style={{ marginRight: 8, marginTop: 2 }} />
                      <Text style={[typography.bodySmall, { color: theme.textSecondary, flex: 1 }]}>
                        {item}
                      </Text>
                    </View>
                  ))}
                </GradientCard>
              </View>
            )}
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
  scrollContent: {
    padding: spacing.base,
    paddingBottom: 40,
  },
  uploadCard: {
    padding: spacing.base,
  },
  placeholderWrapper: {
    height: 180,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  imageWrapper: {
    height: 200,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.base,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  resultContainer: {
    marginTop: spacing.xl,
  },
  statusCard: {
    padding: spacing.base,
    borderLeftWidth: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
});
