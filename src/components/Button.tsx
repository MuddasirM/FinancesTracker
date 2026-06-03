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

  // Retro press-down effect: button shifts 2px on press, shadow collapses
  const translate = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(translate, {
      toValue: 2,
      duration: 60,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(translate, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    ...(variant === 'primary' && {
      backgroundColor: colors.accent.primary,
      borderColor: colors.accent.primary,
    }),
    ...(variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderColor: colors.accent.primary,
    }),
    ...(variant === 'ghost' && {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    }),
    ...(variant === 'danger' && {
      backgroundColor: colors.status.danger,
      borderColor: colors.status.danger,
    }),
    ...(disabled && { opacity: 0.4 }),
    ...(fullWidth && { alignSelf: 'stretch' }),
  };

  const textColor =
    variant === 'primary' || variant === 'danger'
      ? colors.background.primary
      : variant === 'secondary'
      ? colors.accent.primary
      : colors.text.secondary;

  // Hard offset shadow wrapper (primary only)
  const shadowStyle: ViewStyle =
    variant === 'primary' && !disabled
      ? {
          shadowColor: colors.accent.primary,
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.35,
          shadowRadius: 0,
          elevation: 4,
        }
      : {};

  return (
    <Animated.View
      style={[
        shadowStyle,
        { transform: [{ translateX: translate }, { translateY: translate }] },
        style,
      ]}>
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
            {icon && <View style={{ marginRight: spacing.xs }}>{icon}</View>}
            <Text
              style={{
                fontFamily: 'VT323-Regular',
                fontSize: 18,
                color: textColor,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
              {label}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
