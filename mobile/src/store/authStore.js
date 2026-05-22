/**
 * BharatFarm Auth Store (Zustand)
 * Handles user authentication with AsyncStorage persistence
 * Mirrors the web app's localStorage-based auth system
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'bharatfarm_users';
const CURRENT_USER_KEY = 'bharatfarm_current_user';

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isLoading: true,
  isAuthenticated: false,
  hasOnboarded: false,

  // Load saved session
  loadSession: async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        set({
          currentUser: user,
          isAuthenticated: true,
          isLoading: false,
          hasOnboarded: !!user.onboarded,
        });
        return;
      }
    } catch (e) {
      console.warn('Session load error:', e);
    }
    set({ isLoading: false });
  },

  // Login
  login: async (phone, password) => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      const user = users.find(u => u.phone === phone && u.password === password);

      if (!user) {
        throw new Error('Invalid phone number or password');
      }

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      set({
        currentUser: user,
        isAuthenticated: true,
        hasOnboarded: !!user.onboarded,
      });
      return user;
    } catch (e) {
      throw e;
    }
  },

  // Register
  register: async ({ name, phone, password }) => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];

      if (users.find(u => u.phone === phone)) {
        throw new Error('Phone number already registered');
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        phone,
        password,
        createdAt: new Date().toISOString(),
        onboarded: false,
        state: '',
        crops: [],
        landSize: '',
        avatar: null,
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      set({
        currentUser: newUser,
        isAuthenticated: true,
        hasOnboarded: false,
      });
      return newUser;
    } catch (e) {
      throw e;
    }
  },

  // Complete Onboarding
  completeOnboarding: async (profileData) => {
    try {
      const user = { ...get().currentUser, ...profileData, onboarded: true };

      // Update in users list
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) users[idx] = user;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

      set({ currentUser: user, hasOnboarded: true });
    } catch (e) {
      throw e;
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const user = { ...get().currentUser, ...updates };
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      const idx = users.findIndex(u => u.id === user.id);
      if (idx >= 0) users[idx] = user;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      set({ currentUser: user });
    } catch (e) {
      throw e;
    }
  },

  // Logout
  logout: async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      console.warn('Logout error:', e);
    }
    set({ currentUser: null, isAuthenticated: false, hasOnboarded: false });
  },

  // Reset password
  resetPassword: async (phone, newPassword) => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      const idx = users.findIndex(u => u.phone === phone);

      if (idx === -1) throw new Error('Phone number not found');

      users[idx].password = newPassword;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (e) {
      throw e;
    }
  },
}));
