import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export function HomeScreen() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }} />
  );
}
