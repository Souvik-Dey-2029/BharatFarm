/**
 * HomeScreen - Smart Agriculture Dashboard
 * Near 1:1 mobile adaptation of the high-fidelity BharatFarm web dashboard.
 * Features: Cinematic Dash Hero, Gamification Card, Next Activity indicator,
 * KrishiBot waveform, Leaf pathology card, WhatsApp avatars, SVG/Native Hyperlocal Analytics Chart,
 * and the "From Soil to Soul" Impact grid.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, Pressable,
  ActivityIndicator, Image, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { useGamificationStore } from '../../store/gamificationStore';
import GradientCard from '../../components/GradientCard';
import { typography, spacing, borderRadius } from '../../theme';
import { getGreeting } from '../../utils/helpers';
import apiService from '../../services/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40 - 12) / 2; // Perfect grid spacing

export default function HomeScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const toggleTheme = useThemeStore(s => s.toggleTheme);
  const currentUser = useAuthStore(s => s.currentUser);
  const { level, xp, streak_days, incrementXP } = useGamificationStore();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const [bridgeState, setBridgeState] = useState('checking'); // 'checking' | 'live' | 'demo'
  const [bridgeNote, setBridgeNote] = useState('Preparing demo session...');
  const [checking, setChecking] = useState(false);

  // Animation values
  const waveformAnims = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const firstName = currentUser?.name?.split(' ')[0] || 'Farmer';
  const greeting = getGreeting();

  useEffect(() => {
    syncBridgeState();
    startWaveformAnimation();
  }, []);

  const startWaveformAnimation = () => {
    const anims = waveformAnims.map((anim, idx) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 2.2 + Math.random() * 2,
            duration: 400 + idx * 80,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400 + idx * 80,
            useNativeDriver: true,
          }),
        ])
      );
    });
    Animated.parallel(anims).start();
  };

  const syncBridgeState = async () => {
    setChecking(true);
    try {
      const res = await apiService.healthCheck();
      const mode = res?.mode === 'demo' ? 'demo' : 'live';
      setBridgeState(mode);
      setBridgeNote(
        mode === 'demo'
          ? 'Demo data is active. The dashboard stays functional without backend access.'
          : 'Live backend bridge detected. Demo fallback remains ready.'
      );
    } catch (e) {
      setBridgeState('demo');
      setBridgeNote('Demo data is active. The dashboard stays functional without backend access.');
    } finally {
      setChecking(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await syncBridgeState();
    await useGamificationStore.getState().loadState();
    setRefreshing(false);
  };

  const handleTakeDailyQuiz = () => {
    // Add quick quiz experience with XP increment
    incrementXP(15);
    Alert.alert(
      'Daily Agricultural Quiz',
      'Question: Which crop is known for organic Nitrogen fixation?\n\nAnswer: Legumes (Beans & Pulses)!\n\nCorrect! You earned +15 XP.'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Upper ambient glow */}
      <View style={styles.dashboardAmbientGlow} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Cinematic Header TopBar */}
        <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>Bharat<Text style={{ color: '#4CAF50' }}>Farm</Text></Text>
            <View style={styles.crownBadge}>
              <Ionicons name="crown" size={10} color="#F59E0B" />
              <Text style={styles.crownBadgeText}>Premium</Text>
            </View>
          </View>
          
          <View style={styles.topActions}>
            <Pressable onPress={toggleTheme} style={styles.iconBtn}>
              <Ionicons
                name={theme.mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
                size={18}
                color="#E8F5EC"
              />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>{firstName[0]}</Text>
            </Pressable>
          </View>
        </View>

        {/* ── HERO HEADER (Replica from app.html) ── */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80' }}
            style={styles.heroBgImage}
          />
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.95)']}
            style={styles.heroOverlay}
          />

          <View style={styles.heroContent}>
            <Text style={styles.heroGreeting}>
              {greeting} 👋 {firstName}
            </Text>
            <Text style={styles.heroMainTitle}>
              Your AI Companion for{'\n'}
              <Text style={{ color: '#4CAF50' }}>Smarter Farming</Text>
            </Text>
            <Text style={styles.heroSubText}>
              Empowering Indian agriculture with real-time intelligence, voice-first assistance, and direct market access.
            </Text>

            <View style={styles.heroCtaRow}>
              <Pressable
                onPress={() => navigation.navigate('LeafScanner')}
                style={styles.heroPrimaryBtn}
              >
                <Ionicons name="seedling-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.heroPrimaryBtnText}>Get Started</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('KrishiBot')}
                style={styles.heroSecondaryBtn}
              >
                <Ionicons name="leaf-outline" size={16} color="#E8F5EC" style={{ marginRight: 6 }} />
                <Text style={styles.heroSecondaryBtnText}>Explore AI</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* ── THE ECOSYSTEM FEATURE GRID (1:1 Web Replication) ── */}
        <View style={styles.contentBody}>
          
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTag}>THE ECOSYSTEM</Text>
            <Text style={styles.sectionHeading}>Cultivating the Future</Text>
          </View>

          {/* Gamification / Daily Quiz Card */}
          <LinearGradient
            colors={['rgba(76, 175, 80, 0.16)', 'rgba(76, 175, 80, 0.03)']}
            style={styles.gamificationCard}
          >
            <View style={styles.gamiHeader}>
              <View style={styles.gamiBadge}>
                <Ionicons name="medal-outline" size={13} color="#81C784" />
                <Text style={styles.gamiBadgeText}>Lvl {level}</Text>
              </View>
              <Text style={styles.gamiXpTotal}>⭐ {xp} XP</Text>
              <Text style={styles.gamiRank}>🏆 Rank #3</Text>
            </View>

            <View style={styles.xpContainer}>
              <View style={styles.xpLabelsRow}>
                <Text style={styles.xpLabel}>Ecosystem Experience</Text>
                <Text style={styles.xpValueText}>{xp % 100} / 100 XP</Text>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpProgressFill, { width: `${xp % 100}%` }]} />
              </View>
            </View>

            <Pressable onPress={handleTakeDailyQuiz} style={styles.takeQuizBtn}>
              <Ionicons name="brain-outline" size={15} color="#000000" style={{ marginRight: 6 }} />
              <Text style={styles.takeQuizBtnText}>Take Daily Quiz</Text>
            </Pressable>
          </LinearGradient>

          {/* Grid Layout for specific website panels */}
          <View style={styles.gridRow}>
            
            {/* CARD 1: Next Activity (Roadmap) */}
            <Pressable
              onPress={() => navigation.navigate('Calculator')}
              style={styles.cardItem}
            >
              <View style={styles.glassCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80' }}
                  style={styles.cardThumbnail}
                />
                <View style={styles.cardInfoArea}>
                  <Text style={styles.cardMiniLabel}>Next Activity</Text>
                  <Text style={styles.cardMainHeading} numberOfLines={1}>Nitrogen Spray</Text>
                  <View style={[styles.statusBadge, { backgroundColor: 'rgba(76, 175, 80, 0.16)' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#81C784' }]}>Day 24 Crop Schedule</Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {/* CARD 2: Weather Alert */}
            <Pressable
              onPress={() => navigation.navigate('Weather')}
              style={styles.cardItem}
            >
              <View style={styles.glassCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&q=80' }}
                  style={styles.cardThumbnail}
                />
                <View style={styles.cardInfoArea}>
                  <Text style={styles.cardMiniLabel}>Smart Forecast</Text>
                  <View style={styles.tempRow}>
                    <Text style={styles.tempText}>32°C</Text>
                    <View style={styles.weatherSafeBadge}>
                      <Text style={styles.weatherSafeText}>SAFE</Text>
                    </View>
                  </View>
                  <Text style={styles.weatherDesc} numberOfLines={1}>Clear Sky · Localized Sensor</Text>
                </View>
              </View>
            </Pressable>

            {/* CARD 3: KrishiBot AI Voice Card */}
            <Pressable
              onPress={() => navigation.navigate('KrishiBot')}
              style={styles.cardItem}
            >
              <View style={styles.glassCard}>
                <View style={styles.voiceCardHeader}>
                  <Ionicons name="mic-outline" size={20} color="#4CAF50" />
                  <Text style={styles.cardMiniLabel}>Voice AI Assistant</Text>
                </View>
                <Text style={styles.voiceTitle}>KrishiBot: Voice First</Text>
                <Text style={styles.voiceSubtext}>Talk to your farm. Dialect expert support.</Text>
                
                {/* Animated Waveform mock replicating website */}
                <View style={styles.waveformContainer}>
                  {waveformAnims.map((anim, idx) => (
                    <Animated.View
                      key={idx}
                      style={[
                        styles.waveformBar,
                        { transform: [{ scaleY: anim }] }
                      ]}
                    />
                  ))}
                </View>
              </View>
            </Pressable>

            {/* CARD 4: Leaf Scanner Pathology Card */}
            <Pressable
              onPress={() => navigation.navigate('LeafScanner')}
              style={styles.cardItem}
            >
              <View style={styles.glassCard}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&q=80' }}
                  style={styles.scannerThumbnail}
                />
                <View style={styles.scannerInfo}>
                  <Text style={styles.cardMiniLabel}>AI Diagnostic</Text>
                  <Text style={styles.scannerTitle}>Leaf Scanner</Text>
                  <Text style={styles.scannerDesc}>Instant Gemini disease scans.</Text>
                </View>
              </View>
            </Pressable>

            {/* CARD 5: Smart Market Direct Trade Card */}
            <Pressable
              onPress={() => navigation.navigate('Marketplace')}
              style={styles.cardItem}
            >
              <View style={styles.glassCard}>
                <Text style={styles.cardMiniLabel}>Direct Agriculture Trade</Text>
                <Text style={styles.marketTitle}>Smart Market</Text>
                <Text style={styles.marketDesc}>Sell direct to urban clusters. Cut middlemen commissions.</Text>
                
                {/* avatars mock */}
                <View style={styles.avatarRow}>
                  <View style={[styles.avatarCircle, { backgroundColor: '#2E7D32' }]}><Text style={styles.avatarEmoji}>👨‍🌾</Text></View>
                  <View style={[styles.avatarCircle, { backgroundColor: '#374151', marginLeft: -10 }]}><Text style={styles.avatarEmoji}>👩‍🌾</Text></View>
                  <View style={[styles.avatarCircle, { backgroundColor: '#4B5563', marginLeft: -10 }]}><Text style={styles.avatarEmoji}>🧑‍🌾</Text></View>
                  <View style={styles.avatarCountBadge}><Text style={styles.avatarCountText}>+89</Text></View>
                </View>
              </View>
            </Pressable>

            {/* CARD 6: Hyperlocal Analytics (Visual chart mock) */}
            <Pressable
              onPress={() => navigation.navigate('Calculator')}
              style={styles.cardItem}
            >
              <View style={styles.glassCard}>
                <Text style={styles.cardMiniLabel}>Hyperlocal Analytics</Text>
                <Text style={styles.analyticsTitle}>Precision Yield</Text>
                
                <View style={styles.analyticsStatsRow}>
                  <View style={styles.analyticsStatBox}>
                    <Text style={styles.analyticsStatLabel}>Costs</Text>
                    <Text style={styles.analyticsStatValue}>₹14.2k</Text>
                  </View>
                  <View style={styles.analyticsStatBox}>
                    <Text style={styles.analyticsStatLabel}>Revenue</Text>
                    <Text style={[styles.analyticsStatValue, { color: '#4CAF50' }]}>₹65.8k</Text>
                  </View>
                </View>

                {/* Frosted elegant visual chart replica using css styling */}
                <View style={styles.visualChartMock}>
                  <View style={[styles.chartBarMock, { height: 15 }]} />
                  <View style={[styles.chartBarMock, { height: 28 }]} />
                  <View style={[styles.chartBarMock, { height: 42, backgroundColor: '#4CAF50' }]} />
                  <View style={[styles.chartBarMock, { height: 24 }]} />
                  <View style={[styles.chartBarMock, { height: 35 }]} />
                  <View style={[styles.chartBarMock, { height: 55, backgroundColor: '#81C784' }]} />
                </View>
              </View>
            </Pressable>

          </View>

          {/* Quick Shortcuts Row (Govt Schemes & Calculator) */}
          <View style={styles.shortcutsContainer}>
            <Pressable
              onPress={() => navigation.navigate('Schemes')}
              style={styles.shortcutCard}
            >
              <View style={styles.shortcutGlass}>
                <Ionicons name="landmark-outline" size={18} color="#4CAF50" style={{ marginRight: 8 }} />
                <Text style={styles.shortcutText}>Govt Subsidy Matchmaker</Text>
              </Pressable>
            </Pressable>
          </View>

          {/* ── FROM SOIL TO SOUL IMPACT SECTION (Replica from app.html) ── */}
          <View style={styles.impactHeader}>
            <Text style={styles.impactTitle}>From Soil to Soul.</Text>
            <Text style={styles.impactDesc}>
              We don't just provide data; we provide a bridge between the hardworking farmer and the conscious consumer. Join an ecosystem that respects the land and rewards the labor.
            </Text>

            <View style={styles.impactStatsContainer}>
              <View style={styles.impactStatRow}>
                <View style={styles.impactIconCircle}>
                  <Ionicons name="leaf" size={16} color="#4CAF50" />
                </View>
                <View style={styles.impactTextCol}>
                  <Text style={styles.impactStatHeading}>Sustainability First</Text>
                  <Text style={styles.impactStatSubText}>Reducing fertilizer waste by 30% through AI precision.</Text>
                </View>
              </View>

              <View style={styles.impactStatRow}>
                <View style={styles.impactIconCircle}>
                  <Ionicons name="cash-outline" size={16} color="#81C784" />
                </View>
                <View style={styles.impactTextCol}>
                  <Text style={styles.impactStatHeading}>Fair Direct Pricing</Text>
                  <Text style={styles.impactStatSubText}>Direct distribution ensures farmers get 85% of retail price.</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── DEMO BRIDGE STATUS (Hackathon requirement) ── */}
          <GradientCard style={styles.connectivityCard}>
            <View style={styles.connectivityHeader}>
              <View style={styles.connectivityTitleRow}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: bridgeState === 'live' ? '#4CAF50' : '#F59E0B' }
                ]} />
                <Text style={{ color: '#E8F5EC', fontSize: 13, fontWeight: '800' }}>
                  Live Demo Bridge
                </Text>
              </View>
              <Pressable style={styles.configToggle} onPress={syncBridgeState} disabled={checking}>
                {checking ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : (
                  <Ionicons name="refresh-outline" size={18} color="#4CAF50" />
                )}
              </Pressable>
            </View>

            <Text style={{ color: '#A2C2AC', fontSize: 11, marginTop: 4, lineHeight: 15 }}>
              Demo-first launch with active Expo session and local mock database.
            </Text>

            <Text style={{ color: '#E8F5EC', fontSize: 12, marginTop: 10, lineHeight: 18, fontWeight: '500' }}>
              {bridgeNote}
            </Text>
          </GradientCard>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dashboardAmbientGlow: {
    position: 'absolute',
    top: -150,
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    filter: Platform.OS === 'ios' ? 'blur(60px)' : undefined,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: spacing.xs,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  crownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginLeft: 8,
  },
  crownBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFB366',
    textTransform: 'uppercase',
    marginLeft: 3,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E7D32',
    borderWidth: 1.5,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Hero Container
  heroContainer: {
    width: '100%',
    height: 290,
    position: 'relative',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  heroBgImage: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: 290,
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroGreeting: {
    fontSize: 13,
    fontWeight: '600',
    color: '#81C784',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroMainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heroSubText: {
    fontSize: 12,
    color: '#A2C2AC',
    lineHeight: 18,
    marginTop: 8,
    maxWidth: '92%',
  },
  heroCtaRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  heroSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E8F5EC',
  },
  // Body Content
  contentBody: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginVertical: spacing.lg,
  },
  sectionTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4CAF50',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  // Gamification Card
  gamificationCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.28)',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  gamiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gamiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.28)',
  },
  gamiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#81C784',
    marginLeft: 4,
  },
  gamiXpTotal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gamiRank: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FCD34D',
  },
  xpContainer: {
    marginTop: 14,
  },
  xpLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  xpLabel: {
    fontSize: 11,
    color: '#A2C2AC',
  },
  xpValueText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  xpTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  takeQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    marginTop: 14,
  },
  takeQuizBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  // Feature Cards Grid
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardItem: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  glassCard: {
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    overflow: 'hidden',
    padding: spacing.sm,
    height: 194,
    justifyContent: 'space-between',
  },
  cardThumbnail: {
    width: '100%',
    height: 80,
    borderRadius: borderRadius.md,
    resizeMode: 'cover',
  },
  cardInfoArea: {
    marginTop: 6,
    flex: 1,
    justifyContent: 'center',
  },
  cardMiniLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4CAF50',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardMainHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  tempText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  weatherSafeBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.16)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  weatherSafeText: {
    fontSize: 8,
    color: '#81C784',
    fontWeight: '800',
  },
  weatherDesc: {
    fontSize: 10,
    color: '#A2C2AC',
    marginTop: 4,
  },
  // KrishiBot
  voiceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  voiceSubtext: {
    fontSize: 10,
    color: '#A2C2AC',
    lineHeight: 14,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    gap: 4,
    marginTop: 8,
  },
  waveformBar: {
    width: 3,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 1.5,
  },
  // Leaf Scanner
  scannerThumbnail: {
    width: '100%',
    height: 90,
    borderRadius: borderRadius.md,
    resizeMode: 'cover',
  },
  scannerInfo: {
    marginTop: 4,
  },
  scannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scannerDesc: {
    fontSize: 10,
    color: '#A2C2AC',
  },
  // Market
  marketTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  marketDesc: {
    fontSize: 10,
    color: '#A2C2AC',
    lineHeight: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatarCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  avatarEmoji: {
    fontSize: 11,
  },
  avatarCountBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    marginLeft: -8,
  },
  avatarCountText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  // Analytics
  analyticsTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  analyticsStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  analyticsStatBox: {
    flex: 1,
  },
  analyticsStatLabel: {
    fontSize: 8,
    color: '#688E75',
    textTransform: 'uppercase',
  },
  analyticsStatValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  visualChartMock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 55,
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.12)',
  },
  chartBarMock: {
    width: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.22)',
    borderRadius: 2,
  },
  // Shortcuts
  shortcutsContainer: {
    marginVertical: spacing.md,
  },
  shortcutCard: {
    width: '100%',
  },
  shortcutGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  shortcutText: {
    color: '#E8F5EC',
    fontSize: 13,
    fontWeight: '700',
  },
  // Impact Section
  impactHeader: {
    marginTop: spacing.xl,
    paddingVertical: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 175, 80, 0.15)',
  },
  impactTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  impactDesc: {
    fontSize: 13,
    color: '#A2C2AC',
    lineHeight: 20,
    marginTop: 10,
  },
  impactStatsContainer: {
    marginTop: 20,
  },
  impactStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  impactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  impactTextCol: {
    flex: 1,
  },
  impactStatHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  impactStatSubText: {
    fontSize: 12,
    color: '#688E75',
    marginTop: 2,
  },
  // Connectivity Card
  connectivityCard: {
    padding: spacing.md,
    marginVertical: spacing.xl,
  },
  connectivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectivityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  configToggle: {
    padding: 4,
  },
});
