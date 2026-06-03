import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Animated,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    ...(variant === 'primary' && { backgroundColor: colors.accent.primary }),
    ...(variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.accent.primary,
    }),
    ...(variant === 'ghost' && { backgroundColor: 'transparent' }),
    ...(variant === 'danger' && { backgroundColor: colors.status.danger }),
    ...(disabled && { opacity: 0.5 }),
    ...(fullWidth && { alignSelf: 'stretch' }),
  };

  const textColor =
    variant === 'primary' || variant === 'danger'
      ? '#FFFFFF'
      : variant === 'secondary'
      ? colors.accent.primary
      : colors.text.secondary;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={containerStyle}>
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {icon && (
              <View style={{ marginRight: spacing.xs }}>{icon}</View>
            )}
            <Text
              style={{
                fontSize: typography.sizes.base,
                fontWeight: typography.weights.semibold,
                color: textColor,
              }}>
              {label}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
