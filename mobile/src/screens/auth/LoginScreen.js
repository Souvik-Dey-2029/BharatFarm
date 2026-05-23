/**
 * LoginScreen - BharatFarm Authentication & Onboarding
 * Jaw-dropping cinematic landing replication mirroring the website's visual DNA.
 * Features: Concentric rotating rings, glowing particles, horizontal story scrolling, and glassmorphism.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, Pressable, Alert, Dimensions, Animated, Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import { typography, spacing, borderRadius } from '../../theme';

const { width, height } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    badge: 'Next Gen Farming',
    title: 'The Future of Agriculture',
    desc: 'BharatFarm integrates cutting-edge AI, machine learning, and comprehensive crop data to bring an entire farming ecosystem right to your mobile device.',
    icon: 'leaf-outline',
    color: '#4CAF50',
    details: ['🤖 Voice Assistant', '🔬 Disease Scanner']
  },
  {
    badge: 'KrishiBot AI',
    title: 'Real-Time AI Intelligence',
    desc: 'Interact with our custom voice assistant powered by Gemini 2.5. Identify diseases instantly with our interactive Leaf Scanner.',
    icon: 'chatbubble-ellipses-outline',
    color: '#81C784',
    details: ['🎤 Voice Commands', '📸 Instant Diagnosis']
  },
  {
    badge: 'Data-Driven',
    title: 'Predictive Smart Tools',
    desc: 'Make calculated decisions with professional land unit calculators, real-time localized weather monitoring, and proximity safety alerts.',
    icon: 'cloud-sun-outline',
    color: '#34D399',
    details: ['🌦️ Live Weather', '🧮 Yield Simulator']
  },
  {
    badge: 'Digital Agri-India',
    title: 'Marketplace & Community',
    desc: 'Connect directly with buyers through our Zero-Commission marketplace. Stay updated with dynamic blog feeds sharing agricultural breakthroughs.',
    icon: 'cart-outline',
    color: '#F59E0B',
    details: ['🏪 Zero Commission', '📦 Direct Trade']
  }
];

export default function LoginScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const { login, register } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Login fields
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Animation values
  const spinValue1 = useRef(new Animated.Value(0)).current;
  const spinValue2 = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const authSlide = useRef(new Animated.Value(height)).current; // auth box starting below the screen

  // Background glow particle animation
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    // Concentric spin loops
    Animated.loop(
      Animated.timing(spinValue1, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(spinValue2, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Background organic glow pulses
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const spinRing1 = spinValue1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const spinRing2 = spinValue2.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg']
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25]
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.12, 0.22]
  });

  const handleEnterPlatform = () => {
    setShowAuth(true);
    Animated.spring(authSlide, {
      toValue: 0,
      tension: 15,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handleBackToStory = () => {
    Animated.timing(authSlide, {
      toValue: height,
      duration: 350,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setShowAuth(false);
    });
  };

  const handleLogin = async () => {
    if (!loginPhone.trim() || !loginPassword.trim()) {
      Alert.alert('Field Required', 'Please fill in both Phone Number and Password.');
      return;
    }
    setLoading(true);
    try {
      await login(loginPhone.trim(), loginPassword);
    } catch (e) {
      Alert.alert('Login Failed', e.message);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!regName.trim() || !regPhone.trim() || !regPassword || !regConfirm) {
      Alert.alert('Field Required', 'Please fill in all register details.');
      return;
    }
    if (regPassword !== regConfirm) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must contain at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register({ name: regName.trim(), phone: regPhone.trim(), password: regPassword });
    } catch (e) {
      Alert.alert('Registration Failed', e.message);
    }
    setLoading(false);
  };

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Cinematic Glowing Background Particles */}
      <Animated.View style={[
        styles.glowCircle1,
        {
          transform: [{ scale: glowScale }],
          opacity: glowOpacity
        }
      ]} />
      <View style={styles.glowCircle2} />
      <View style={styles.gridLinesOverlay} />

      <ScrollView contentContainerStyle={styles.mainScroll} bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* Floating Futuristic Logo System with Concentric Rotating Rings */}
        <Animated.View style={[styles.logoSection, { transform: [{ scale: logoScale }], marginTop: insets.top + 20 }]}>
          <View style={styles.logoInteractiveContainer}>
            {/* Spinning Outer Ring */}
            <Animated.View style={[styles.spinningRingOuter, { transform: [{ rotate: spinRing1 }] }]} />
            {/* Spinning Inner Ring */}
            <Animated.View style={[styles.spinningRingInner, { transform: [{ rotate: spinRing2 }] }]} />
            
            <View style={styles.centerLogoCircle}>
              <Text style={styles.centerEmoji}>🌾</Text>
            </View>
          </View>
          <Text style={styles.logoTextMain}>Bharat<Text style={{ color: '#4CAF50' }}>Farm</Text></Text>
          <Text style={styles.logoSubtitle}>SMART AGRICULTURE PLATFORM</Text>
        </Animated.View>

        {!showAuth ? (
          /* horizontal scroll storyteller replicating the website slides */
          <Animated.View style={[styles.storytellerContainer, { opacity: contentFade }]}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ height: 260 }}
            >
              {ONBOARDING_SLIDES.map((slide, idx) => (
                <View key={idx} style={styles.slideCardOuter}>
                  <View style={styles.glassSlideCard}>
                    <View style={styles.slideHeader}>
                      <View style={styles.slideBadge}>
                        <Text style={styles.slideBadgeText}>{slide.badge}</Text>
                      </View>
                      <Ionicons name={slide.icon} size={22} color="#4CAF50" />
                    </View>
                    <Text style={styles.slideTitle}>{slide.title}</Text>
                    <Text style={styles.slideDesc}>{slide.desc}</Text>
                    
                    <View style={styles.detailsRow}>
                      {slide.details.map((detail, dIdx) => (
                        <View key={dIdx} style={styles.detailPill}>
                          <Text style={styles.detailPillText}>{detail}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Pagination Indicators */}
            <View style={styles.paginationRow}>
              {ONBOARDING_SLIDES.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.paginationDot,
                    activeSlide === idx ? styles.paginationDotActive : null
                  ]}
                />
              ))}
            </View>

            {/* Premium Call to Action */}
            <View style={styles.ctaWrapper}>
              <Pressable
                onPress={handleEnterPlatform}
                style={({ pressed }) => [
                  styles.ctaButton,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
                ]}
              >
                <LinearGradient
                  colors={['#4CAF50', '#2E7D32']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaText}>Enter Platform</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </LinearGradient>
              </Pressable>
              
              <Text style={styles.versionTag}>Works 100% Offline-First · Production Native APK</Text>
            </View>
          </Animated.View>
        ) : (
          /* Glassmorphic Auth Entry Panel */
          <Animated.View style={[styles.authContainer, { transform: [{ translateY: authSlide }] }]}>
            <View style={styles.authGlassBox}>
              
              {/* Back to welcome link */}
              <Pressable onPress={handleBackToStory} style={styles.backLink}>
                <Ionicons name="arrow-back-outline" size={16} color="#A2C2AC" />
                <Text style={styles.backLinkText}>View Onboarding Story</Text>
              </Pressable>

              {/* Tabs */}
              <View style={styles.authTabs}>
                <Pressable
                  onPress={() => setActiveTab('login')}
                  style={[
                    styles.authTabBtn,
                    activeTab === 'login' && styles.authTabBtnActive
                  ]}
                >
                  <Text style={[styles.authTabText, activeTab === 'login' && styles.authTabTextActive]}>Login</Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab('register')}
                  style={[
                    styles.authTabBtn,
                    activeTab === 'register' && styles.authTabBtnActive
                  ]}
                >
                  <Text style={[styles.authTabText, activeTab === 'register' && styles.authTabTextActive]}>Register</Text>
                </Pressable>
              </View>

              <Text style={styles.authHeading}>
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text style={styles.authSubheading}>
                {activeTab === 'login'
                  ? 'Access your unified farming dashboard'
                  : 'Start your data-driven smart farming career'}
              </Text>

              {activeTab === 'login' ? (
                <View style={styles.formContainer}>
                  <AppInput
                    label="Phone Number"
                    placeholder="Enter registered 10-digit number"
                    icon="call-outline"
                    value={loginPhone}
                    onChangeText={setLoginPhone}
                    keyboardType="phone-pad"
                  />
                  <AppInput
                    label="Secret Password"
                    placeholder="Enter your security password"
                    icon="lock-closed-outline"
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry
                    onSubmitEditing={handleLogin}
                    returnKeyType="done"
                  />
                  <AppButton
                    title="Sign In Securely"
                    onPress={handleLogin}
                    loading={loading}
                    icon="log-in-outline"
                    fullWidth
                    style={{ marginTop: spacing.md }}
                  />
                </View>
              ) : (
                <View style={styles.formContainer}>
                  <AppInput
                    label="Farmer Full Name"
                    placeholder="e.g. Ramesh Kumar"
                    icon="person-outline"
                    value={regName}
                    onChangeText={setRegName}
                    autoCapitalize="words"
                  />
                  <AppInput
                    label="Active Phone Number"
                    placeholder="For dashboard bridge & communication"
                    icon="call-outline"
                    value={regPhone}
                    onChangeText={setRegPhone}
                    keyboardType="phone-pad"
                  />
                  <AppInput
                    label="Create Password"
                    placeholder="Minimum 6 characters"
                    icon="lock-closed-outline"
                    value={regPassword}
                    onChangeText={setRegPassword}
                    secureTextEntry
                  />
                  <AppInput
                    label="Confirm Secret Password"
                    placeholder="Re-enter security password"
                    icon="lock-closed-outline"
                    value={regConfirm}
                    onChangeText={setRegConfirm}
                    secureTextEntry
                    onSubmitEditing={handleRegister}
                    returnKeyType="done"
                  />
                  <AppButton
                    title="Register & Launch App"
                    onPress={handleRegister}
                    loading={loading}
                    icon="person-add-outline"
                    fullWidth
                    style={{ marginTop: spacing.md }}
                  />
                </View>
              )}

              <Text style={styles.authTermsText}>
                🔒 256-Bit Encrypted Persistence · Secure Local Sandbox
              </Text>
            </View>
          </Animated.View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Animated Cinematic Neon Hues
  glowCircle1: {
    position: 'absolute',
    top: -80,
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: 'rgba(76, 175, 80, 0.16)',
  },
  glowCircle2: {
    position: 'absolute',
    bottom: -150,
    right: -50,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  gridLinesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 0,
    opacity: 0.05,
    borderColor: '#FFF',
    borderStyle: 'dashed',
  },
  mainScroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  // Glowing concentric rotating ring components
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoInteractiveContainer: {
    width: 104,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  spinningRingOuter: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: '#4CAF50',
    borderBottomColor: '#4CAF50',
    opacity: 0.8,
  },
  spinningRingInner: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderLeftColor: '#81C784',
    borderRightColor: '#81C784',
    opacity: 0.6,
  },
  centerLogoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(16, 26, 18, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  centerEmoji: {
    fontSize: 30,
  },
  logoTextMain: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
    fontWeight: '800',
    fontSize: 34,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#688E75',
    letterSpacing: 2,
    marginTop: 4,
  },
  // Onboarding Slides (Web replication)
  storytellerContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  slideCardOuter: {
    width: width,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  glassSlideCard: {
    backgroundColor: 'rgba(12, 22, 14, 0.6)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.25)',
    padding: spacing.lg,
    height: '100%',
    justifyContent: 'space-between',
  },
  slideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slideBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.25)',
  },
  slideBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#81C784',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: spacing.sm,
  },
  slideDesc: {
    fontSize: 13,
    color: '#A2C2AC',
    lineHeight: 18,
    marginTop: spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  detailPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  detailPillText: {
    fontSize: 10,
    color: '#E8F5EC',
    fontWeight: '500',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: '#4CAF50',
  },
  // CTA actions
  ctaWrapper: {
    width: '100%',
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  ctaButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  versionTag: {
    fontSize: 10,
    color: '#688E75',
    marginTop: 14,
    textAlign: 'center',
  },
  // Auth Form Box
  authContainer: {
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  authGlassBox: {
    backgroundColor: 'rgba(12, 22, 14, 0.75)',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.28)',
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  backLinkText: {
    fontSize: 13,
    color: '#A2C2AC',
    marginLeft: 6,
    fontWeight: '600',
  },
  authTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.15)',
    padding: 3,
    marginBottom: spacing.base,
  },
  authTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  authTabBtnActive: {
    backgroundColor: '#4CAF50',
  },
  authTabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A2C2AC',
  },
  authTabTextActive: {
    color: '#FFFFFF',
  },
  authHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  authSubheading: {
    fontSize: 13,
    color: '#A2C2AC',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  formContainer: {
    width: '100%',
  },
  authTermsText: {
    fontSize: 9,
    color: '#688E75',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
