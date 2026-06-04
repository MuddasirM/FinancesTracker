import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export function DashedDivider() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  return (
    <View style={{
      marginHorizontal: spacing.md,
      borderTopWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.border + '80',
    }} />
  );
}
