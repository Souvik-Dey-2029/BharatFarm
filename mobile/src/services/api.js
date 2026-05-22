/**
 * BharatFarm API Service Layer
 * All backend communication in one place.
 * Compatible with existing Node.js server (server.js).
 */

import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_API_BASE = 'bharatfarm_custom_api_base';

const getDevApiBase = () => {
  // Try to find the hostUri (e.g. "192.168.1.15:8081") from Expo Config
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      console.log(`[API Config] Dynamic Metro LAN IP detected: ${ip}. Using http://${ip}:5000`);
      return `http://${ip}:5000`;
    }
  }
  return 'http://192.168.1.100:5000'; // fallback
};

class ApiService {
  constructor() {
    this.baseUrl = __DEV__ ? getDevApiBase() : 'https://your-production-server.com';
    this.timeout = 30000;
    this.init();
  }

  async init() {
    try {
      const savedUrl = await AsyncStorage.getItem(STORAGE_KEY_API_BASE);
      if (savedUrl) {
        this.baseUrl = savedUrl;
        console.log(`[API Config] Loaded saved base URL: ${savedUrl}`);
      }
    } catch (e) {
      console.error('[API Config] Failed to load saved API base URL from storage:', e.message);
    }
  }

  async setBaseUrl(url) {
    if (!url) return;
    this.baseUrl = url;
    try {
      await AsyncStorage.setItem(STORAGE_KEY_API_BASE, url);
      console.log(`[API Config] Base URL updated and saved: ${url}`);
    } catch (e) {
      console.error('[API Config] Failed to save custom API base URL:', e.message);
    }
  }

  async resetBaseUrl() {
    this.baseUrl = __DEV__ ? getDevApiBase() : 'https://your-production-server.com';
    try {
      await AsyncStorage.removeItem(STORAGE_KEY_API_BASE);
      console.log(`[API Config] Base URL reset to default: ${this.baseUrl}`);
    } catch (e) {
      console.error('[API Config] Failed to reset custom API base URL:', e.message);
    }
  }

  async _fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    console.log(`[API Request] ${options.method || 'GET'} ${url}`);
    if (options.body && options.body.length) {
      console.log(`[API Payload snippet] ${options.body.substring(0, 200)}...`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timer);
      console.log(`[API Response] ${response.status} for ${endpoint}`);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${errorBody || response.statusText}`);
      }

      const resJson = await response.json();
      return resJson;
    } catch (error) {
      clearTimeout(timer);
      console.warn(`[API Error] Failed ${options.method || 'GET'} ${endpoint}:`, error.message);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection.');
      }
      throw error;
    }
  }

  // ── Health Check ───────────────────────────────────────
  async healthCheck() {
    return this._fetch('/api/health');
  }

  // ── KrishiBot Chat ─────────────────────────────────────
  async sendChat({ text, language = 'en', history = [] }) {
    return this._fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ text, language, history }),
    });
  }

  // ── Generic AI Call (proxy to OpenRouter) ──────────────
  async aiCall({ messages, model, temperature = 0.7, max_tokens = 800 }) {
    return this._fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, model, temperature, max_tokens }),
    });
  }

  // ── Leaf Disease Analysis ──────────────────────────────
  async analyzeLeaf({ base64Image, mimeType = 'image/jpeg' }) {
    return this._fetch('/api/analyze-leaf', {
      method: 'POST',
      body: JSON.stringify({ base64Image, mimeType }),
    });
  }

  // ── Government Schemes ─────────────────────────────────
  async getSchemes({ landSize, state, crop }) {
    return this._fetch('/api/schemes', {
      method: 'POST',
      body: JSON.stringify({ landSize, state, crop }),
    });
  }

  // ── Wiki / Disease Database ────────────────────────────
  async getWikiDiseases(query = '', crop = '') {
    let url = '/api/wiki';
    if (crop) url += `/${encodeURIComponent(crop)}`;
    if (query) url += `?q=${encodeURIComponent(query)}`;
    return this._fetch(url);
  }

  async getWikiDisease(id) {
    return this._fetch(`/api/wiki/disease/${id}`);
  }

  // ── Quizzes ────────────────────────────────────────────
  async getQuizzes() {
    return this._fetch('/api/quizzes');
  }

  // ── Leaderboard ────────────────────────────────────────
  async getLeaderboard() {
    return this._fetch('/api/leaderboard');
  }

  // ── Achievements ───────────────────────────────────────
  async getAchievements() {
    return this._fetch('/api/achievements');
  }
}

export const apiService = new ApiService();
export default apiService;
