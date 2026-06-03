import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
  elevated?: boolean;
  accent?: boolean;  // left accent border stripe
}

export function Card({ children, style, padding = true, elevated = false, accent = false }: CardProps) {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing, shadows } = theme;

  return (
    <View
      style={[
        {
          backgroundColor: colors.background.card,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          ...(padding && { padding: spacing.md }),
          ...(elevated ? shadows.elevated : shadows.card),
          ...(accent && {
            borderLeftWidth: 3,
            borderLeftColor: colors.accent.primary,
          }),
        },
        style,
      ]}>
      {children}
    </View>
  );
}
