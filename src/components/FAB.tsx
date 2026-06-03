import React, { useRef } from 'react';
import { TouchableOpacity, Animated, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/useTheme';

interface FABProps {
  onPress: () => void;
  style?: ViewStyle;
  iconName?: string;
  bottom?: number;
  right?: number;
}

export function FAB({ onPress, style, iconName = 'plus', bottom = 24, right = 20 }: FABProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const translate = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(translate, { toValue: 3, duration: 60, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(translate, { toValue: 0, duration: 100, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          right,
          bottom,
          // Hard retro shadow — collapses on press via translate
          shadowColor: colors.accent.primary,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 0,
          elevation: 6,
          transform: [{ translateX: translate }, { translateY: translate }],
        },
        style,
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: 52,
          height: 52,
          borderRadius: 4,            // retro square-ish
          backgroundColor: colors.accent.primary,
          borderWidth: 1,
          borderColor: colors.accent.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={iconName} size={24} color={colors.background.primary} />
      </TouchableOpacity>
    </Animated.View>
  );
}
