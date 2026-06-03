import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps } from 'react-native';
import { useTheme } from '../theme/useTheme';

type Variant = 'heading' | 'subheading' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  variant?: Variant;
  color?: string;
}

const FONT = 'VT323-Regular';

export function Text({ variant = 'body', color, style, ...props }: TextProps) {
  const { theme } = useTheme();
  const { typography, colors } = theme;

  const variantStyles: Record<Variant, TextStyle> = {
    heading: {
      fontFamily: FONT,
      fontSize: 32,
      color: colors.text.primary,
      letterSpacing: 1.5,
      lineHeight: 36,
    },
    subheading: {
      fontFamily: FONT,
      fontSize: 24,
      color: colors.text.primary,
      letterSpacing: 1,
      lineHeight: 28,
    },
    body: {
      fontFamily: FONT,
      fontSize: 18,
      color: colors.text.primary,
      letterSpacing: 0.5,
      lineHeight: 24,
    },
    caption: {
      fontFamily: FONT,
      fontSize: 14,
      color: colors.text.muted,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      lineHeight: 18,
    },
    label: {
      fontFamily: FONT,
      fontSize: 14,
      color: colors.text.secondary,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      lineHeight: 18,
    },
  };

  return (
    <RNText
      style={[variantStyles[variant], color ? { color } : undefined, style]}
      {...props}
    />
  );
}
