import React from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

interface AppTopBarProps {
  onMenuPress: () => void;
}

export function AppTopBar({ onMenuPress }: AppTopBarProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: colors.background.primary,
        paddingTop: insets.top,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
      }}>
        {/* Left — hamburger */}
        <TouchableOpacity
          onPress={onMenuPress}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ width: 34, alignItems: 'flex-start', justifyContent: 'center' }}>
          <Icon name="menu" size={22} color={colors.text.secondary} />
        </TouchableOpacity>

        {/* Centre — logo wordmark placeholder */}
        <View style={{
          borderWidth: 1,
          borderColor: colors.accent.primary,
          paddingHorizontal: spacing.md,
          paddingVertical: 2,
        }}>
          <Text style={{
            fontFamily: 'VT323-Regular',
            fontSize: 18,
            color: colors.accent.primary,
            letterSpacing: 4,
          }}>
            FINTRACK
          </Text>
        </View>

        {/* Right — bell */}
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ width: 34, alignItems: 'flex-end', justifyContent: 'center' }}>
          <Icon name="bell-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
