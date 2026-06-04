import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabParamList, RootStackNavProp, RootStackParamList } from './types';
import { useTheme } from '../theme/useTheme';
import { AppTopBar } from '../components/AppTopBar';
import { SideDrawer } from '../components/SideDrawer';
import { HomeScreen } from '../screens/Home';
import { ExpensesScreen } from '../screens/Expenses';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_CONFIG: Record<keyof TabParamList, { icon: string; label: string }> = {
  Home:     { icon: 'home-outline',   label: 'Home' },
  Expenses: { icon: 'receipt',         label: 'Expenses' },
};

const TAB_ROUTES = new Set<string>(['Home', 'Expenses']);

export function MainNavigator() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState<keyof TabParamList>('Home');
  const tabNavRef = useRef<any>(null);
  const rootNav = useNavigation<RootStackNavProp>();

  function navigateToTab(route: string) {
    setDrawerOpen(false);
    if (TAB_ROUTES.has(route)) {
      tabNavRef.current?.navigate(route);
      setActiveRoute(route as keyof TabParamList);
    } else {
      rootNav.navigate(route as keyof RootStackParamList);
    }
  }

  function RetroTabBar({ state, navigation }: BottomTabBarProps) {
    const { theme } = useTheme();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();

    // Capture tab navigation so the drawer can use it
    tabNavRef.current = navigation;

    return (
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.background.card,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: insets.bottom || spacing.sm,
      }}>
        {state.routes.map((route, index) => {
          const { icon, label } = TAB_CONFIG[route.name as keyof TabParamList];
          const focused = state.index === index;
          const color = focused ? colors.accent.primary : colors.text.muted;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                navigation.navigate(route.name);
                setActiveRoute(route.name as keyof TabParamList);
              }}
              activeOpacity={0.7}
              style={{ flex: 1, alignItems: 'center', paddingTop: spacing.sm, paddingBottom: 4 }}>
              <View style={{
                position: 'absolute',
                top: 0, left: 16, right: 16,
                height: focused ? 2 : 0,
                backgroundColor: colors.accent.primary,
              }} />
              <Icon name={icon} size={22} color={color} />
              <Text style={{
                fontFamily: 'VT323-Regular',
                fontSize: 13,
                color,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginTop: 2,
              }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AppTopBar onMenuPress={() => setDrawerOpen(true)} />

      <Tab.Navigator
        tabBar={props => <RetroTabBar {...props} />}
        screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home"     component={HomeScreen} />
        <Tab.Screen name="Expenses" component={ExpensesScreen} />
      </Tab.Navigator>

      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute={activeRoute}
        onNavigate={navigateToTab}
      />

    </View>
  );
}
