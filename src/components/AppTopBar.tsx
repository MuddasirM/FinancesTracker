import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StatusBar, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

interface AppTopBarProps {
  onMenuPress: () => void;
}

function useLogoJitter() {
  const shiftX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      timer = setTimeout(() => {
        Animated.sequence([
          Animated.timing(shiftX, { toValue: 3,  duration: 20, useNativeDriver: true }),
          Animated.timing(shiftX, { toValue: -2, duration: 20, useNativeDriver: true }),
          Animated.timing(shiftX, { toValue: 1,  duration: 15, useNativeDriver: true }),
          Animated.timing(shiftX, { toValue: 0,  duration: 15, useNativeDriver: true }),
        ]).start(() => scheduleNext());
      }, 7000 + Math.random() * 9000);
    }

    scheduleNext();
    return () => clearTimeout(timer);
  }, [shiftX]);

  return shiftX;
}

export function AppTopBar({ onMenuPress }: AppTopBarProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();
  const shiftX = useLogoJitter();

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

        {/* Centre — logo wordmark with CRT jitter */}
        <View style={{
          borderWidth: 1,
          borderColor: colors.accent.primary,
          paddingHorizontal: spacing.md,
          paddingVertical: 2,
        }}>
          <Animated.View style={{ transform: [{ translateX: shiftX }] }}>
            <Text style={{ fontSize: 18, color: colors.accent.primary, letterSpacing: 4 }}>
              COFFER
            </Text>
          </Animated.View>
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
