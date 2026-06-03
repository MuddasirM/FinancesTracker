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

  return (
    <View style={[{ marginBottom: spacing.md }, containerStyle]}>
      {label && (
        <Text
          variant="label"
          style={{ marginBottom: spacing.xs }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor,
          borderRadius: borderRadius.md,
          backgroundColor: colors.background.card,
          paddingHorizontal: spacing.md,
        }}>
        {leftIcon && (
          <View style={{ marginRight: spacing.xs }}>{leftIcon}</View>
        )}
        <TextInput
          style={[
            {
              flex: 1,
              paddingVertical: large ? spacing.md : spacing.sm + 2,
              fontSize: large ? typography.sizes.xxl : typography.sizes.base,
              fontWeight: large ? typography.weights.bold : typography.weights.regular,
              color: colors.text.primary,
            },
            style,
          ]}
          placeholderTextColor={colors.text.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <View style={{ marginLeft: spacing.xs }}>{rightIcon}</View>
        )}
      </View>
      {error ? (
        <Text
          variant="caption"
          style={{ color: colors.status.danger, marginTop: spacing.xs }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
