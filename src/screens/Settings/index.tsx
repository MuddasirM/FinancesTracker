import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/useTheme';
import { Screen } from '../../components/Screen';
import { Header } from '../../components/Header';
import { Text } from '../../components/Text';
import { RootStackNavProp } from '../../navigation/types';

export function SettingsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavProp>();

  return (
    <Screen>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="heading" style={{ color: theme.colors.text.muted }}>Coming Soon</Text>
      </View>
    </Screen>
  );
}
