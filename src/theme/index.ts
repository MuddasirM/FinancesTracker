export const lightColors = {
  background: {
    primary:   '#FDFAF6',  // warm cream
    secondary: '#F5EFE6',  // slightly deeper cream
    card:      '#FFFFFF',
  },
  text: {
    primary:   '#1A1410',  // near-black, warm
    secondary: '#6B5E50',  // warm brown-grey
    muted:     '#A0948A',  // muted warm
  },
  accent: {
    primary: '#9A7450',    // deep beige — enough contrast on cream
  },
  status: {
    success: '#4A9B6F',
    danger:  '#C05050',
    warning: '#B07820',
  },
  border: '#E8E0D4',       // warm border
  badge:  '#C05050',
};

export const darkColors = {
  background: {
    primary:   '#0D0B08',  // black with a breath of beige
    secondary: '#151210',  // warm surface
    card:      '#1C1916',  // warm card
  },
  text: {
    primary:   '#F0EAE0',  // warm off-white
    secondary: '#8A7E72',  // warm grey
    muted:     '#504844',  // very muted
  },
  accent: {
    primary: '#C9A87C',    // warm beige
  },
  status: {
    success: '#7DB87A',    // muted sage green
    danger:  '#C47A7A',    // muted terracotta red
    warning: '#C4A054',    // muted amber (close to beige)
  },
  border: '#222222',       // barely-there separator
  badge:  '#C47A7A',
};

export const typography = {
  fonts: {
    retro: 'VT323-Regular',  // pixel terminal font — use for display/headings
    system: undefined,        // falls back to system font
  },
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
  sm: 0,   // square
  md: 2,   // nearly square
  lg: 4,   // subtle — used only on large containers
  full: 9999,
};

export const shadows = {
  card: {
    elevation: 3,
    shadowColor: '#C9A87C',  // accent-tinted hard shadow
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
  },
  elevated: {
    elevation: 6,
    shadowColor: '#C9A87C',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 0,
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
