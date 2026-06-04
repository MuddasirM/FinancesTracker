import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  style?: ViewStyle;
}

export function EmptyState({ icon, title, subtitle, ctaLabel, onCta, style }: EmptyStateProps) {
  const { theme } = useTheme();
  const { spacing, colors, borderRadius } = theme;

  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }, style]}>
      {icon ? (
        <View
          style={{
            marginBottom: spacing.lg,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
          }}>
          {icon}
        </View>
      ) : null}

      <Text
        style={{
          textAlign: 'center',
          fontSize: 22,
          color: colors.text.primary,
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: spacing.sm,
        }}>
        {title}
      </Text>

      {subtitle ? (
        <Text
          variant="body"
          style={{ textAlign: 'center', color: colors.text.muted, marginBottom: spacing.lg, lineHeight: 20 }}>
          {subtitle}
        </Text>
      ) : null}

      {/* Decorative rule */}
      <View style={{ width: 32, height: 2, backgroundColor: colors.accent.primary, marginBottom: ctaLabel ? spacing.lg : 0 }} />

      {ctaLabel && onCta ? <Button label={ctaLabel} onPress={onCta} /> : null}
    </View>
  );
}
