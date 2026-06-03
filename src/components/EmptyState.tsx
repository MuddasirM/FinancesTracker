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

export function EmptyState({
  icon,
  title,
  subtitle,
  ctaLabel,
  onCta,
  style,
}: EmptyStateProps) {
  const { theme } = useTheme();
  const { spacing, colors } = theme;

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
        },
        style,
      ]}>
      {icon ? (
        <View style={{ marginBottom: spacing.lg }}>{icon}</View>
      ) : null}
      <Text
        variant="subheading"
        style={{ textAlign: 'center', marginBottom: spacing.sm }}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          variant="body"
          style={{
            textAlign: 'center',
            color: colors.text.muted,
            marginBottom: spacing.lg,
          }}>
          {subtitle}
        </Text>
      ) : null}
      {ctaLabel && onCta ? (
        <Button label={ctaLabel} onPress={onCta} />
      ) : null}
    </View>
  );
}
