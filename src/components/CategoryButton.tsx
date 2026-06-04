import React, { useEffect, useRef } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

function useJitter() {
  const shiftX = useSharedValue(0);
  // Each instance gets a different random start delay so they don't all fire together
  const initialDelay = useRef(1000 + Math.random() * 4000).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let active = true;

    function fire() {
      if (!active) return;
      shiftX.value = withSequence(
        withTiming(3,  { duration: 20 }),
        withTiming(-2, { duration: 20 }),
        withTiming(1,  { duration: 15 }),
        withTiming(0,  { duration: 15 }),
      );
      timer = setTimeout(fire, 7000 + Math.random() * 9000);
    }

    timer = setTimeout(fire, initialDelay);
    return () => { active = false; clearTimeout(timer); };
  }, [shiftX, initialDelay]);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: shiftX.value }],
  }));
}

interface CategoryButtonProps {
  label: string;
  icon: string;
  size: number;
  onPress: () => void;
}

export function CategoryButton({ label, icon, size, onPress }: CategoryButtonProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const scale          = useSharedValue(1);
  const opacity        = useSharedValue(1);
  const borderProgress = useSharedValue(0);
  const jitterStyle    = useJitter();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    borderColor: interpolateColor(
      borderProgress.value,
      [0, 1],
      [colors.border, colors.accent.primary]
    ),
  }));

  function handlePress() {
    scale.value = withSequence(
      withTiming(0.95, { duration: 20 }),
      withTiming(1.0,  { duration: 160 })
    );
    borderProgress.value = withSequence(
      withTiming(1, { duration: 20 }),
      withTiming(0, { duration: 160 })
    );
    opacity.value = withSequence(
      withTiming(0.5, { duration: 30 }),
      withTiming(1.0, { duration: 30 }),
      withTiming(0.7, { duration: 30 }),
      withTiming(1.0, { duration: 90 }, (finished) => {
        if (finished) runOnJS(onPress)();
      })
    );
  }

  const iconSize = Math.round(size * 0.22);

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderWidth: 1,
          backgroundColor: colors.background.card,
          overflow: 'hidden',
        },
        animatedStyle,
      ]}>
      <Pressable
        onPress={handlePress}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flex: 55, width: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 6 }}>
          <Icon name={icon} size={iconSize} color={colors.text.secondary} />
        </View>
        <View style={{ flex: 45, width: '100%', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 4, paddingHorizontal: 8 }}>
          <Animated.View style={jitterStyle}>
            <Text style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', color: colors.text.primary }}>
              {label}
            </Text>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
