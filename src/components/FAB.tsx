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

export function FAB({
  onPress,
  style,
  iconName = 'plus',
  bottom = 24,
  right = 20,
}: FABProps) {
  const { theme } = useTheme();
  const { colors, shadows } = theme;
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
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
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          right,
          bottom,
          transform: [{ scale }],
        },
        style,
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.accent.primary,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadows.elevated,
        }}>
        <Icon name={iconName} size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}
