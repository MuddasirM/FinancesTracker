import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
  elevated?: boolean;
}

export function Card({
  children,
  style,
  padding = true,
  elevated = false,
}: CardProps) {
  const { theme } = useTheme();
  const { colors, borderRadius, spacing, shadows } = theme;

  return (
    <View
      style={[
        {
          backgroundColor: colors.background.card,
          borderRadius: borderRadius.lg,
          ...(padding && { padding: spacing.md }),
          ...(elevated ? shadows.elevated : shadows.card),
        },
        style,
      ]}>
      {children}
    </View>
  );
}
