import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme/useTheme';

type Variant = 'heading' | 'subheading' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
}

export function Text({ variant = 'body', color, style, ...props }: TextProps) {
  const { theme } = useTheme();
  const { typography, colors } = theme;

  const variantStyles: Record<Variant, TextStyle> = {
    heading: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      color: colors.text.primary,
      lineHeight: typography.sizes.xl * typography.lineHeights.tight,
    },
    subheading: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
      color: colors.text.primary,
      lineHeight: typography.sizes.lg * typography.lineHeights.tight,
    },
    body: {
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.regular,
      color: colors.text.primary,
      lineHeight: typography.sizes.base * typography.lineHeights.normal,
    },
    caption: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.regular,
      color: colors.text.muted,
      lineHeight: typography.sizes.sm * typography.lineHeights.normal,
    },
    label: {
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.medium,
      color: colors.text.secondary,
      lineHeight: typography.sizes.sm * typography.lineHeights.normal,
    },
  };

  return (
    <RNText
      style={[variantStyles[variant], color ? { color } : undefined, style]}
      {...props}
    />
  );
}
