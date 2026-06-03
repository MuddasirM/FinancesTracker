import React from 'react';
import { View, ScrollView, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function Screen({ children, style, contentStyle }: ScreenProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background.primary }, style]}
      edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

export function ScrollScreen({ children, style, contentStyle }: ScreenProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.background.primary }, style]}
      edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[{ flexGrow: 1 }, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
