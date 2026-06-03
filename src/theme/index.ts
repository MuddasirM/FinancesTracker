export const lightColors = {
  background: {
    primary: '#F8FAFC',
    secondary: '#F1F5F9',
    card: '#FFFFFF',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
  },
  accent: {
    primary: '#06B6D4',
  },
  status: {
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
  },
  border: '#E2E8F0',
  badge: '#EF4444',
};

export const darkColors = {
  background: {
    primary: '#0A0F1E',
    secondary: '#131929',
    card: '#1A2235',
  },
  text: {
    primary: '#F1F5F9',
    secondary: '#94A3B8',
    muted: '#475569',
  },
  accent: {
    primary: '#22D3EE',
  },
  status: {
    success: '#4ADE80',
    danger: '#F87171',
    warning: '#FCD34D',
  },
  border: '#1E2D45',
  badge: '#F87171',
};

export const typography = {
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
};

export const shadows = {
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  elevated: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
};

export type Colors = typeof lightColors;
export type Theme = {
  colors: Colors;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  isDark: boolean;
};

export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  isDark: true,
};
