import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

interface ListItemProps {
  leftIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showDivider?: boolean;
  style?: ViewStyle;
}

export function ListItem({
  leftIcon,
  title,
  subtitle,
  rightElement,
  onPress,
  showDivider = false,
  style,
}: ListItemProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  const inner = (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.background.card,
        },
        showDivider && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        style,
      ]}>
      {leftIcon ? (
        <View style={{ marginRight: spacing.md }}>{leftIcon}</View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text variant="body">{title}</Text>
        {subtitle ? (
          <Text variant="caption" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightElement ? (
        <View style={{ marginLeft: spacing.sm }}>{rightElement}</View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
}
