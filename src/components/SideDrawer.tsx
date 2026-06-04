import React, { useEffect, useRef } from 'react';
import { View, Animated, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';

const WIDTH = Dimensions.get('window').width * 0.72;

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
  activeRoute?: string;
  onNavigate: (route: string) => void;
}

const NAV_ITEMS: { icon: string; label: string; route: string }[] = [
  { icon: 'home-outline', label: 'Home',     route: 'Home' },
  { icon: 'receipt',      label: 'Expenses', route: 'Expenses' },
];

const SETTINGS_ITEMS: { icon: string; label: string; route: string }[] = [
  { icon: 'tune', label: 'Settings', route: 'Settings' },
];

export function SideDrawer({ visible, onClose, activeRoute, onNavigate }: SideDrawerProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const insets = useSafeAreaInsets();

  const translateX = useRef(new Animated.Value(-WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, { toValue: -WIDTH, duration: 180, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, translateX, backdropOpacity]);

  if (!visible) return null;

  const renderItem = (item: { icon: string; label: string; route: string }) => {
    const active = activeRoute === item.route;
    return (
      <TouchableOpacity
        key={item.route}
        onPress={() => { onNavigate(item.route); onClose(); }}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.sm + 4,
          paddingHorizontal: spacing.lg,
          borderLeftWidth: active ? 3 : 0,
          borderLeftColor: colors.accent.primary,
          backgroundColor: active ? colors.accent.primary + '10' : 'transparent',
        }}>
        <Icon name={item.icon} size={18} color={active ? colors.accent.primary : colors.text.secondary} />
        <Text
          style={{
            fontSize: 20,
            color: active ? colors.accent.primary : colors.text.primary,
            letterSpacing: 1.5,
            marginLeft: spacing.md,
          }}>
          {item.label.toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', opacity: backdropOpacity }} />
      </TouchableWithoutFeedback>

      {/* Drawer panel */}
      <Animated.View style={{
        position: 'absolute',
        top: 0, left: 0, bottom: 0,
        width: WIDTH,
        backgroundColor: colors.background.card,
        borderRightWidth: 1,
        borderRightColor: colors.border,
        transform: [{ translateX }],
        paddingTop: insets.top,
      }}>
        {/* Logo header */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <View style={{ borderWidth: 1, borderColor: colors.accent.primary, alignSelf: 'flex-start', paddingHorizontal: spacing.sm + 4, paddingVertical: 2 }}>
            <Text style={{ fontSize: 22, color: colors.accent.primary, letterSpacing: 4 }}>COFFER</Text>
          </View>
          <Text variant="caption" style={{ marginTop: spacing.xs }}>Personal Finance</Text>
        </View>

        {/* Nav links */}
        <View style={{ marginTop: spacing.sm }}>
          {NAV_ITEMS.map(renderItem)}
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg, marginVertical: spacing.md }} />

        {/* Settings */}
        <View>
          {SETTINGS_ITEMS.map(renderItem)}
        </View>

        {/* Version */}
        <View style={{ position: 'absolute', bottom: insets.bottom + spacing.md, left: spacing.lg }}>
          <Text variant="caption">V 0.1.0</Text>
        </View>
      </Animated.View>
    </View>
  );
}
