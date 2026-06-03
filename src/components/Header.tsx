import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: { icon: string; onPress: () => void };
  rightElement?: React.ReactNode;
  borderless?: boolean;
  style?: ViewStyle;
}

export function Header({ title, onBack, rightAction, rightElement, borderless = false, style }: HeaderProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

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
            borderBottomWidth: 2,
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
          <Icon name="arrow-left" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 34 }} />
      )}

      <Text
        style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: 'VT323-Regular',
          fontSize: 20,
          color: colors.text.primary,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
        {title}
      </Text>

      {rightAction ? (
        <TouchableOpacity
          onPress={rightAction.onPress}
          style={{ padding: spacing.xs }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name={rightAction.icon} size={20} color={colors.text.primary} />
        </TouchableOpacity>
      ) : rightElement ? (
        <View>{rightElement}</View>
      ) : (
        <View style={{ width: 34 }} />
      )}
    </View>
  );
}
