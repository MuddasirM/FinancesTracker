import React, { useState } from 'react';
import { View, TextInput, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  large?: boolean;
}

export function Input({
  label,
  error,
  rightIcon,
  leftIcon,
  containerStyle,
  style,
  large = false,
  ...props
}: InputProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.status.danger
    : focused
    ? colors.accent.primary
    : colors.border;

  const borderWidth = focused || error ? 2 : 1;

  return (
    <View style={[{ marginBottom: spacing.md }, containerStyle]}>
      {label && (
        <Text variant="label" style={{ marginBottom: spacing.sm }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth,
          borderColor,
          borderRadius: borderRadius.md,
          backgroundColor: colors.background.card,
          paddingHorizontal: spacing.md,
          // Left accent stripe on focus
          ...(focused && !error && {
            borderLeftWidth: 3,
            borderLeftColor: colors.accent.primary,
          }),
        }}>
        {leftIcon && (
          <View style={{ marginRight: spacing.sm }}>{leftIcon}</View>
        )}
        <TextInput
          style={[
            {
              flex: 1,
              paddingVertical: large ? spacing.md : spacing.sm + 4,
              fontSize: large ? typography.sizes.xxl : typography.sizes.base,
              fontWeight: large ? typography.weights.bold : typography.weights.regular,
              color: colors.text.primary,
              fontVariant: ['tabular-nums'],
            },
            style,
          ]}
          placeholderTextColor={colors.text.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <View style={{ marginLeft: spacing.sm }}>{rightIcon}</View>
        )}
      </View>
      {error ? (
        <Text
          variant="caption"
          style={{ color: colors.status.danger, marginTop: spacing.xs, letterSpacing: 0.5 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
