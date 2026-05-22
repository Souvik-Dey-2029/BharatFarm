/**
 * KrishiBot AI Screen
 * Real-time multilingual chat with optional text-to-speech voice output and speech-to-text instructions.
 * Beautiful chat bubble UI with historical session support.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, KeyboardAvoidingView,
  Platform, TextInput, Pressable, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import ScreenHeader from '../../components/ScreenHeader';
import { useThemeStore } from '../../store/themeStore';
import { useGamificationStore } from '../../store/gamificationStore';
import apiService from '../../services/api';
import { typography, spacing, borderRadius } from '../../theme';

export default function KrishiBotScreen({ navigation }) {
  const theme = useThemeStore(s => s.theme);
  const trackChat = useGamificationStore(s => s.trackChat);

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

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

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

      // Optional: Auto speak AI response if needed
      // speakText(replyText, aiMsg.id);

    } catch (e) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: "Error connecting to server. Please check your Node.js backend configuration.",
        sender: 'ai',
        timestamp: new Date(),
        isError: true
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
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>🤖</Text>
          </View>
        )}
        <View style={[
          styles.bubble,
          isAi ? { backgroundColor: theme.surfaceElevated, borderColor: theme.border } : { backgroundColor: theme.primary },
          item.isError && { borderColor: theme.danger, borderWidth: 1 }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isAi ? theme.text : '#FFFFFF' }
          ]}>
            {item.text}
          </Text>
          {isAi && !item.isError && (
            <Pressable
              onPress={() => speakText(item.text, item.id)}
              style={styles.speakBtn}
            >
              <Ionicons
                name={speakingMsgId === item.id ? "stop-circle-outline" : "volume-medium-outline"}
                size={18}
                color={theme.primary}
              />
              <Text style={[typography.caption, { color: theme.primary, marginLeft: 4 }]}>
                {speakingMsgId === item.id ? "Stop Listening" : "Listen"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader
        title="KrishiBot AI"
        subtitle="Voice-first intelligent assistant"
        onBack={() => navigation.goBack()}
      />

      {/* Language Selector */}
      <View style={[styles.langBar, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
        <Text style={[typography.caption, { color: theme.textSecondary }]}>Preferred Language:</Text>
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
                { borderColor: theme.border },
                language === lang.code && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
            >
              <Text style={[
                styles.langText,
                { color: language === lang.code ? '#FFFFFF' : theme.textSecondary }
              ]}>{lang.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

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
        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.inputBg, borderColor: theme.border }]}
            placeholder={language === 'hi' ? 'अपना प्रश्न पूछें...' : language === 'bn' ? 'আপনার প্রশ্ন জিজ্ঞাসা করুন...' : 'Ask KrishiBot a question...'}
            placeholderTextColor={theme.inputPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          {loading ? (
            <View style={styles.sendBtn}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : (
            <Pressable
              onPress={handleSend}
              style={[styles.sendBtn, { backgroundColor: theme.primary }]}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
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
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  langButtons: {
    flexDirection: 'row',
  },
  langBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginLeft: 4,
  },
  langText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.base,
    alignItems: 'flex-end',
  },
  rowAi: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  messageText: {
    ...typography.bodySmall,
    lineHeight: 20,
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(16, 185, 129, 0.2)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.sm,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginRight: spacing.sm,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 15,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
