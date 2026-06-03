import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  rightElement?: React.ReactNode;
  borderless?: boolean;
  style?: ViewStyle;
}

export function Header({
  title,
  onBack,
  rightAction,
  rightElement,
  borderless = false,
  style,
}: HeaderProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
          backgroundColor: colors.background.primary,
          ...(!borderless && {
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }),
        },
        style,
      ]}>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={{ padding: spacing.xs, marginRight: spacing.sm }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon
            name="arrow-left"
            size={22}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 38 }} />
      )}

      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: typography.sizes.md,
          fontWeight: typography.weights.semibold,
          color: colors.text.primary,
        }}>
        {title}
      </Text>

      {rightAction ? (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={{ padding: spacing.xs }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon
            name={rightAction.icon}
            size={22}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      ) : rightElement ? (
        <View>{rightElement}</View>
      ) : (
        <View style={{ width: 38 }} />
      )}
    </View>
  );
}
