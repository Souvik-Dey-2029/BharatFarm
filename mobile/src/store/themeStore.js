/**
 * BharatFarm Theme Store (Zustand)
 * Handles dark/light theme persistence with AsyncStorage
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../theme/colors';

const THEME_KEY = 'bharatfarm_theme_mode';

export const useThemeStore = create((set, get) => ({
  mode: 'dark',
  theme: darkTheme,
  isLoaded: false,

  loadTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      const mode = saved || 'dark';
      set({
        mode,
        theme: mode === 'dark' ? darkTheme : lightTheme,
        isLoaded: true,
      });
    } catch (e) {
      set({ isLoaded: true });
    }
  },

  toggleTheme: async () => {
    const newMode = get().mode === 'dark' ? 'light' : 'dark';
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
    set({
      mode: newMode,
      theme: newMode === 'dark' ? darkTheme : lightTheme,
    });
  },

  setTheme: async (mode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
    set({
      mode,
      theme: mode === 'dark' ? darkTheme : lightTheme,
    });
  },
}));
