import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useTheme } from '../theme/useTheme';
import { BiometricLockScreen } from '../screens/BiometricLock';
import { HomeScreen } from '../screens/Home';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { theme } = useTheme();

  const navTheme = theme.isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: theme.colors.background.primary,
          card: theme.colors.background.card,
          border: theme.colors.border,
          text: theme.colors.text.primary,
          primary: theme.colors.accent.primary,
          notification: theme.colors.badge,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.background.primary,
          card: theme.colors.background.card,
          border: theme.colors.border,
          text: theme.colors.text.primary,
          primary: theme.colors.accent.primary,
          notification: theme.colors.badge,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="BiometricLock" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BiometricLock" component={BiometricLockScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
