/**
 * BharatFarm Color System
 * Agricultural futuristic aesthetic with dark green gradient theme
 */

export const palette = {
  // Core Greens
  forest: '#0A1A0F',
  forestLight: '#0F2A15',
  emerald: '#10B981',
  emeraldDark: '#059669',
  emeraldLight: '#34D399',
  sage: '#6EE7B7',
  mint: '#A7F3D0',

  // Indian Heritage
  saffron: '#FF9933',
  saffronDark: '#E68A2E',
  saffronLight: '#FFB366',
  gold: '#F59E0B',
  goldLight: '#FCD34D',

  // Earth Tones
  soil: '#78350F',
  soilLight: '#92400E',
  wheat: '#FDE68A',
  clay: '#D97706',

  // Sky & Water
  sky: '#0EA5E9',
  skyDark: '#0284C7',
  skyLight: '#38BDF8',
  water: '#06B6D4',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export const lightTheme = {
  mode: 'light',
  primary: palette.emerald,
  primaryDark: palette.emeraldDark,
  primaryLight: palette.emeraldLight,
  accent: palette.saffron,
  accentDark: palette.saffronDark,
  accentLight: palette.saffronLight,

  background: '#F0FFF4',
  backgroundSecondary: '#ECFDF5',
  surface: palette.white,
  surfaceElevated: palette.white,

  text: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray400,
  textInverse: palette.white,

  border: '#D1FAE5',
  borderSecondary: palette.gray200,
  divider: '#E5E7EB',

  card: palette.white,
  cardBorder: '#D1FAE5',

  navBar: palette.white,
  navBarBorder: '#D1FAE5',
  tabActive: palette.emerald,
  tabInactive: palette.gray400,

  inputBg: palette.white,
  inputBorder: '#D1FAE5',
  inputText: palette.gray900,
  inputPlaceholder: palette.gray400,

  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,

  gradient: {
    primary: [palette.emeraldDark, palette.emerald],
    header: ['#065F46', '#059669', '#10B981'],
    hero: ['#064E3B', '#065F46', '#047857'],
    card: ['rgba(16, 185, 129, 0.05)', 'rgba(16, 185, 129, 0.02)'],
    accent: [palette.saffron, palette.gold],
  },

  shadow: {
    color: 'rgba(0, 0, 0, 0.1)',
    sm: { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
    md: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
    lg: { shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8 },
  },

  glass: {
    background: 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(16, 185, 129, 0.2)',
  },

  xp: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    emerald: '#50C878',
  },
};

export const darkTheme = {
  mode: 'dark',
  primary: '#4CAF50',
  primaryDark: '#2E7D32',
  primaryLight: '#81C784',
  accent: palette.saffron,
  accentDark: palette.saffronDark,
  accentLight: palette.saffronLight,

  background: '#000000', // Cinematic pitch black background
  backgroundSecondary: '#050E09', // Mysterious deep organic forest black
  surface: 'rgba(16, 26, 18, 0.65)', // Semi-transparent glassmorphism
  surfaceElevated: 'rgba(26, 44, 30, 0.85)',

  text: '#E8F5EC',
  textSecondary: '#A2C2AC', // Highly legible muted sage green
  textMuted: '#688E75',
  textInverse: palette.gray900,

  border: 'rgba(76, 175, 80, 0.22)', // Glowing thin green border
  borderSecondary: 'rgba(76, 175, 80, 0.15)',
  divider: 'rgba(76, 175, 80, 0.15)',

  card: 'rgba(12, 22, 14, 0.7)', // Frosted glassmorphism card background
  cardBorder: 'rgba(76, 175, 80, 0.25)', // Elegant glowing card border

  navBar: '#030704', // Deep organic dark nav bar
  navBarBorder: 'rgba(76, 175, 80, 0.15)',
  tabActive: '#4CAF50',
  tabInactive: 'rgba(255, 255, 255, 0.45)',

  inputBg: 'rgba(10, 18, 12, 0.9)',
  inputBorder: 'rgba(76, 175, 80, 0.22)',
  inputText: '#E8F5EC',
  inputPlaceholder: '#688E75',

  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,

  gradient: {
    primary: ['#2E7D32', '#4CAF50'],
    header: ['#000000', 'rgba(5, 14, 9, 0.9)', 'transparent'],
    hero: ['#050E09', '#000000'],
    card: ['rgba(76, 175, 80, 0.15)', 'rgba(76, 175, 80, 0.02)'],
    accent: [palette.saffronDark, palette.gold],
  },

  shadow: {
    color: 'rgba(76, 175, 80, 0.15)', // Green-tinted premium ambient shadows
    sm: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
    md: { shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6 },
    lg: { shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 28, elevation: 10 },
  },

  glass: {
    background: 'rgba(12, 22, 14, 0.65)',
    border: 'rgba(76, 175, 80, 0.25)',
  },

  xp: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    emerald: '#4CAF50',
  },
};
