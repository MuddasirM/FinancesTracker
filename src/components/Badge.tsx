import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

export type BadgeVariant = 'auto' | 'manual' | 'untagged' | 'default' | 'success' | 'danger' | 'warning';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  const bgMap: Record<BadgeVariant, string> = {
    auto: colors.accent.primary + '22',
    manual: colors.status.warning + '22',
    untagged: colors.text.muted + '22',
    default: colors.background.secondary,
    success: colors.status.success + '22',
    danger: colors.status.danger + '22',
    warning: colors.status.warning + '22',
  };

  const textMap: Record<BadgeVariant, string> = {
    auto: colors.accent.primary,
    manual: colors.status.warning,
    untagged: colors.text.muted,
    default: colors.text.secondary,
    success: colors.status.success,
    danger: colors.status.danger,
    warning: colors.status.warning,
  };

  return (
    <View
      style={[
        {
          backgroundColor: bgMap[variant],
          borderRadius: borderRadius.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
          alignSelf: 'flex-start',
        },
        style,
      ]}>
      <Text
        style={{
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.medium,
          color: textMap[variant],
        }}>
        {label}
      </Text>
    </View>
  );
}
