/**
 * BharatFarm Gamification Store (Zustand)
 * XP system, levels, badges, streaks - mirrors web GamificationEngine
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const G_STORAGE_KEY = 'bharatfarm_gamification_state';

const ACHIEVEMENTS = [
  { id: 'first_scan', title: 'Plant Doctor', description: 'Diagnosed a plant using the AI Leaf Scanner.', icon: 'camera', xp_reward: 100, tier: 'bronze' },
  { id: 'quiz_beginner', title: 'Knowledge Seeker', description: 'Completed your first agricultural quiz.', icon: 'book-open', xp_reward: 50, tier: 'bronze' },
  { id: 'quiz_master', title: 'Agri-Scholar', description: 'Completed all available quizzes.', icon: 'award', xp_reward: 500, tier: 'gold' },
  { id: 'streak_3', title: 'Consistent Cultivator', description: 'Logged in for 3 consecutive days.', icon: 'zap', xp_reward: 150, tier: 'silver' },
  { id: 'streak_7', title: 'Dedicated Farmer', description: 'Logged in for 7 consecutive days.', icon: 'sun', xp_reward: 400, tier: 'gold' },
  { id: 'chatbot_first', title: 'Digital Converser', description: 'Asked a question to KrishiBot.', icon: 'message-circle', xp_reward: 50, tier: 'bronze' },
  { id: 'weather_check', title: 'Weather Watcher', description: 'Checked the weather dashboard.', icon: 'cloud', xp_reward: 30, tier: 'bronze' },
  { id: 'market_first', title: 'Market Explorer', description: 'Browsed the marketplace.', icon: 'shopping-bag', xp_reward: 40, tier: 'bronze' },
];

const SIMULATED_FARMERS = [
  { name: 'Ramesh Kumar', xp: 1820 },
  { name: 'Sunita Devi', xp: 1540 },
  { name: 'Arjun Patel', xp: 1360 },
  { name: 'Lakshmi Bai', xp: 1100 },
  { name: 'Mahesh Singh', xp: 980 },
  { name: 'Priya Sharma', xp: 840 },
  { name: 'Vikram Yadav', xp: 720 },
  { name: 'Anita Reddy', xp: 650 },
  { name: 'Rajesh Verma', xp: 530 },
  { name: 'Kavita Nair', xp: 410 },
  { name: 'Suresh Gupta', xp: 350 },
  { name: 'Deepa Joshi', xp: 280 },
  { name: 'Bhaskar Das', xp: 220 },
  { name: 'Meena Kumari', xp: 150 },
  { name: 'Gopal Mishra', xp: 90 },
];

function getXPForNextLevel(level) {
  if (level === 1) return 100;
  if (level === 2) return 300;
  if (level === 3) return 600;
  if (level === 4) return 1000;
  if (level === 5) return 1500;
  return level * 400;
}

function getLevelTitle(level) {
  if (level <= 1) return 'Seedling';
  if (level <= 3) return 'Sprout';
  if (level <= 5) return 'Cultivator';
  if (level <= 8) return 'Harvester';
  if (level <= 12) return 'Master Farmer';
  return 'Krishi Legend';
}

const DEFAULT_STATE = {
  level: 1,
  xp: 0,
  badges: [],
  completed_quizzes: [],
  streak_days: 1,
  last_active: new Date().toISOString().split('T')[0],
  total_scans: 0,
  total_chat_msgs: 0,
};

export const useGamificationStore = create((set, get) => ({
  ...DEFAULT_STATE,
  achievements: ACHIEVEMENTS,
  pendingToasts: [],
  pendingLevelUp: null,
  pendingBadge: null,

  // Load from storage
  loadState: async () => {
    try {
      const stored = await AsyncStorage.getItem(G_STORAGE_KEY);
      if (stored) {
        const parsed = { ...DEFAULT_STATE, ...JSON.parse(stored) };
        delete parsed.coins;
        set(parsed);
        // Check streak
        get().checkStreak();
      }
    } catch (e) {
      console.warn('Gamification load error:', e);
    }
  },

  saveState: async () => {
    const state = get();
    const toSave = {
      level: state.level,
      xp: state.xp,
      badges: state.badges,
      completed_quizzes: state.completed_quizzes,
      streak_days: state.streak_days,
      last_active: state.last_active,
      total_scans: state.total_scans,
      total_chat_msgs: state.total_chat_msgs,
    };
    try {
      await AsyncStorage.setItem(G_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.warn('Gamification save error:', e);
    }
  },

  checkStreak: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    if (today !== state.last_active) {
      const todayDate = new Date(today);
      const lastDate = new Date(state.last_active);
      const diffDays = Math.ceil(Math.abs(todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        set({ streak_days: state.streak_days + 1, last_active: today });
        get().addXP(25, 'Daily Login Streak 🔥');
      } else if (diffDays > 1) {
        set({ streak_days: 1, last_active: today });
      }
      get().saveState();
      get().checkStreakAchievements();
    }
  },

  addXP: (amount, reason = 'Action') => {
    if (amount <= 0) return;
    set(state => {
      const newXP = state.xp + amount;
      return {
        xp: newXP,
        pendingToasts: [...state.pendingToasts, { type: 'xp', amount, reason, id: Date.now() }],
      };
    });
    get().checkLevelUp();
    get().saveState();
  },

  checkLevelUp: () => {
    const state = get();
    let level = state.level;
    let xp = state.xp;
    let leveledUp = false;

    while (xp >= getXPForNextLevel(level)) {
      level += 1;
      leveledUp = true;
    }

    if (leveledUp) {
      set({ level, pendingLevelUp: { level, title: getLevelTitle(level) } });
      get().saveState();
    }
  },

  unlockBadge: (badgeId) => {
    const state = get();
    if (state.badges.includes(badgeId)) return;

    const badgeDef = ACHIEVEMENTS.find(b => b.id === badgeId);
    set(s => ({ badges: [...s.badges, badgeId] }));

    if (badgeDef) {
      set({ pendingBadge: badgeDef });
      get().addXP(badgeDef.xp_reward, `Badge: ${badgeDef.title}`);
    }
    get().saveState();
  },

  trackScan: () => {
    set(s => ({ total_scans: s.total_scans + 1 }));
    get().addXP(10, 'Leaf Scan Analysis 🔬');
    const state = get();
    if (state.total_scans === 1) get().unlockBadge('first_scan');
    get().saveState();
  },

  trackChat: () => {
    set(s => ({ total_chat_msgs: s.total_chat_msgs + 1 }));
    const state = get();
    if (state.total_chat_msgs === 1) {
      get().unlockBadge('chatbot_first');
      get().addXP(20, 'First AI Chat 🤖');
    }
    get().saveState();
  },

  checkStreakAchievements: () => {
    const state = get();
    if (state.streak_days >= 3) get().unlockBadge('streak_3');
    if (state.streak_days >= 7) get().unlockBadge('streak_7');
  },

  clearToast: (id) => {
    set(s => ({ pendingToasts: s.pendingToasts.filter(t => t.id !== id) }));
  },

  clearLevelUp: () => set({ pendingLevelUp: null }),
  clearBadge: () => set({ pendingBadge: null }),

  getLeaderboard: (userName = 'You') => {
    const state = get();
    const allEntries = [
      ...SIMULATED_FARMERS.map(f => ({ name: f.name, xp: f.xp, isUser: false })),
      { name: userName, xp: state.xp, isUser: true },
    ];
    allEntries.sort((a, b) => b.xp - a.xp);
    allEntries.forEach((entry, idx) => { entry.rank = idx + 1; });
    return allEntries;
  },

  getXPForNextLevel,
  getLevelTitle,
  getProgress: () => {
    const state = get();
    const needed = getXPForNextLevel(state.level);
    const prevNeeded = state.level <= 1 ? 0 : getXPForNextLevel(state.level - 1);
    const range = needed - prevNeeded;
    const current = state.xp - prevNeeded;
    return Math.min(1, Math.max(0, current / range));
  },
}));
