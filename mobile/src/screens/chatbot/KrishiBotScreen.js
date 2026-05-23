/**
 * KrishiBot AI Screen
 * Voice-first multi-dialect smart farming assistant.
 * Upgraded to high-fidelity dark glassmorphic styling, glowing buttons, and talking waveforms.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, KeyboardAvoidingView,
  Platform, TextInput, Pressable, ActivityIndicator, Animated, Easing, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import ScreenHeader from '../../components/ScreenHeader';
import { useThemeStore } from '../../store/themeStore';
import { useGamificationStore } from '../../store/gamificationStore';
import apiService from '../../services/api';
import { typography, spacing, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

export default function KrishiBotScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const trackChat = useGamificationStore(s => s.trackChat);
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Namaskar! I am KrishiBot, your AI smart farming assistant. How can I help you today? You can ask me in English, Hindi, or Bengali!',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'bn'
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const flatListRef = useRef(null);

  // Pulsing mic animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Waveform heights
  const waveHeights = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  useEffect(() => {
    if (isSpeaking) {
      startSpeechAnimations();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      Speech.stop();
    };
  }, [isSpeaking]);

  const startSpeechAnimations = () => {
    // Pulse circle loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Waveform bars loop
    const waves = waveHeights.map((anim, idx) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 2.0 + Math.random() * 2,
            duration: 350 + idx * 60,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1.0,
            duration: 350 + idx * 60,
            useNativeDriver: true,
          })
        ])
      );
    });
    Animated.parallel(waves).start();
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Scroll to bottom
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));

      const res = await apiService.sendChat({
        text: userMsg.text,
        language,
        history,
      });

      const replyText = res.response || "I am currently offline or unable to reach the smart assistant service.";

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
      trackChat(); // Add XP & unlock badge for chat usage

    } catch (e) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: "I'm in offline demo mode right now, but I can still help with crops, weather, schemes, and scanner guidance.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const speakText = async (text, id) => {
    if (isSpeaking && speakingMsgId === id) {
      Speech.stop();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      return;
    }

    Speech.stop();
    setIsSpeaking(true);
    setSpeakingMsgId(id);

    let langCode = 'en-US';
    if (language === 'hi') langCode = 'hi-IN';
    if (language === 'bn') langCode = 'bn-IN';

    Speech.speak(text, {
      language: langCode,
      pitch: 1.0,
      rate: 0.95,
      onDone: () => {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      },
      onError: (err) => {
        console.warn('Text-to-speech error:', err);
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      }
    });
  };

  const renderItem = ({ item }) => {
    const isAi = item.sender === 'ai';
    return (
      <View style={[styles.messageRow, isAi ? styles.rowAi : styles.rowUser]}>
        {isAi && (
          <View style={styles.avatarGlowCircle}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        <View style={[
          styles.bubble,
          isAi
            ? { backgroundColor: 'rgba(16, 26, 18, 0.75)', borderColor: 'rgba(76, 175, 80, 0.28)' }
            : { backgroundColor: '#4CAF50', borderColor: 'transparent' },
          item.isError && { borderColor: theme.danger, borderWidth: 1 }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isAi ? '#E8F5EC' : '#FFFFFF' }
          ]}>
            {item.text}
          </Text>
          {isAi && !item.isError && (
            <Pressable
              onPress={() => speakText(item.text, item.id)}
              style={styles.speakBtn}
            >
              <View style={styles.speakIconWrapper}>
                <Ionicons
                  name={speakingMsgId === item.id ? "stop-circle" : "volume-medium"}
                  size={16}
                  color="#4CAF50"
                />
              </View>
              <Text style={[typography.caption, { color: '#81C784', fontWeight: '700', marginLeft: 6 }]}>
                {speakingMsgId === item.id ? "Stop Listening" : "Listen Response"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000000' }]}>
      {/* Background ambient lighting */}
      <View style={styles.chatbotAmbientGlow} />

      <ScreenHeader
        title="KrishiBot AI"
        subtitle="Voice-first intelligent assistant"
        onBack={() => navigation.goBack()}
      />

      {/* Language Selector Bar (Premium frosted layout) */}
      <View style={styles.langBarGlass}>
        <Text style={styles.langBarText}>Target Dialect:</Text>
        <View style={styles.langButtons}>
          {[
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिंदी' },
            { code: 'bn', label: 'বাংলা' }
          ].map(lang => (
            <Pressable
              key={lang.code}
              onPress={() => setLanguage(lang.code)}
              style={[
                styles.langBtn,
                language === lang.code && styles.langBtnActive
              ]}
            >
              <Text style={[
                styles.langText,
                { color: language === lang.code ? '#000000' : '#A2C2AC' }
              ]}>{lang.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Speech Mode Bar */}
      {isSpeaking && (
        <View style={styles.speechFeedbackBar}>
          <Text style={styles.speechFeedbackText}>Speaking Assistant Response...</Text>
          <View style={styles.waveRow}>
            {waveHeights.map((anim, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.waveBar,
                  { transform: [{ scaleY: anim }] }
                ]}
              />
            ))}
          </View>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainerGlass}>
          <TextInput
            style={styles.inputStyle}
            placeholder={
              language === 'hi'
                ? 'अपना प्रश्न पूछें...'
                : language === 'bn'
                  ? 'আপনার প্রশ্ন জিজ্ঞাসা করুন...'
                  : 'Ask KrishiBot about crops, weather, seeds...'
            }
            placeholderTextColor="#688E75"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          {loading ? (
            <View style={styles.sendBtnWrapper}>
              <ActivityIndicator size="small" color="#4CAF50" />
            </View>
          ) : (
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [
                styles.sendBtnWrapper,
                { backgroundColor: '#4CAF50' },
                pressed && { opacity: 0.9, transform: [{ scale: 0.95 }] }
              ]}
            >
              <Ionicons name="send" size={16} color="#000000" />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatbotAmbientGlow: {
    position: 'absolute',
    top: 100,
    right: -100,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  langBarGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(12, 22, 14, 0.65)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.15)',
  },
  langBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#688E75',
    textTransform: 'uppercase',
  },
  langButtons: {
    flexDirection: 'row',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.15)',
    marginLeft: 6,
    backgroundColor: 'transparent',
  },
  langBtnActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  rowAi: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  avatarGlowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(76, 175, 80, 0.25)',
  },
  speakIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speechFeedbackBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 175, 80, 0.28)',
  },
  speechFeedbackText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#81C784',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveBar: {
    width: 2,
    height: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 1,
  },
  inputContainerGlass: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(12, 22, 14, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(76, 175, 80, 0.22)',
  },
  inputStyle: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.22)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    color: '#E8F5EC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    minHeight: 44,
    fontSize: 14,
  },
  sendBtnWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
});
