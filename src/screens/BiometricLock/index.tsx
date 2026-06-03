import React from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../../components/Text';
import { RootStackNavProp } from '../../navigation/types';

export function BiometricLockScreen() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;
  const navigation = useNavigation<RootStackNavProp>();

  const handleUnlock = () => {
    navigation.replace('Main');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background.primary,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 80,
        paddingBottom: 60,
      }}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* Logo / App Name */}
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            backgroundColor: colors.accent.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.lg,
          }}>
          <Icon name="chart-line" size={38} color="#FFFFFF" />
        </View>
        <Text
          style={{
            fontSize: typography.sizes.xxl,
            fontWeight: typography.weights.bold,
            color: colors.text.primary,
            letterSpacing: -0.5,
          }}>
          FinanceTracker
        </Text>
        <Text variant="caption" style={{ marginTop: spacing.xs }}>
          Your money, your way
        </Text>
      </View>

      {/* Fingerprint Icon */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={handleUnlock}
          activeOpacity={0.7}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.accent.primary + '18',
            borderWidth: 1.5,
            borderColor: colors.accent.primary + '44',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="fingerprint" size={56} color={colors.accent.primary} />
        </TouchableOpacity>
        <Text
          variant="body"
          style={{
            marginTop: spacing.lg,
            color: colors.text.secondary,
          }}>
          Touch to unlock
        </Text>
      </View>

      {/* PIN fallback */}
      <TouchableOpacity onPress={handleUnlock} activeOpacity={0.6}>
        <Text
          style={{
            fontSize: typography.sizes.base,
            color: colors.text.muted,
            textDecorationLine: 'underline',
          }}>
          Use PIN instead
        </Text>
      </TouchableOpacity>
    </View>
  );
}
