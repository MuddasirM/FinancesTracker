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
  active?: boolean;
}

export function ListItem({ leftIcon, title, subtitle, rightElement, onPress, showDivider = false, style, active = false }: ListItemProps) {
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
          ...(active && {
            borderLeftWidth: 3,
            borderLeftColor: colors.accent.primary,
          }),
        },
        showDivider && { borderBottomWidth: 1, borderBottomColor: colors.border },
        style,
      ]}>
      {leftIcon ? <View style={{ marginRight: spacing.md }}>{leftIcon}</View> : null}
      <View style={{ flex: 1 }}>
        <Text variant="body">{title}</Text>
        {subtitle ? (
          <Text variant="caption" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightElement ? <View style={{ marginLeft: spacing.sm }}>{rightElement}</View> : null}
    </View>
  );

  return onPress ? (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>{inner}</TouchableOpacity>
  ) : inner;
}
