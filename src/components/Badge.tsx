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
  const { colors, spacing } = theme;

  const colorMap: Record<BadgeVariant, string> = {
    auto:     colors.accent.primary,
    manual:   colors.status.warning,
    untagged: colors.text.muted,
    default:  colors.text.secondary,
    success:  colors.status.success,
    danger:   colors.status.danger,
    warning:  colors.status.warning,
  };

  const c = colorMap[variant];

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: c,
          paddingHorizontal: spacing.sm,
          paddingVertical: 2,
          alignSelf: 'flex-start',
          // borderRadius: 0 (from theme.borderRadius.sm)
        },
        style,
      ]}>
      <Text
        style={{
          fontFamily: 'VT323-Regular',
          fontSize: 13,
          color: c,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
        {label}
      </Text>
    </View>
  );
}
