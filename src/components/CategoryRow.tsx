import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../theme/useTheme';
import { Text } from './Text';


function fmt(n: number) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function blockBar(pct: number, total: number): [string, string] {
  const filled = Math.round(Math.min(pct, 1) * total);
  return ['█'.repeat(filled), '░'.repeat(total - filled)];
}

export interface CategoryRowProps {
  icon: string;
  label: string;
  value: number;
  total: number;
  color: string;
  onPress?: () => void;
}

export function CategoryRow({ icon, label, value, total, color, onPress }: CategoryRowProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const over = value > total;
  const barColor = over ? colors.status.danger : color;
  const [filled, empty] = blockBar(value / total, 25);

  const inner = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
      {/* Col 1 — icon */}
      <View style={{
        width: 40, height: 40, borderRadius: 1,
        borderWidth: 1, borderColor: color + '40',
        backgroundColor: color + '12',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={25} color={color} />
      </View>

      {/* Col 2 — bar + label/values */}
      <View style={{ flex: 1 }}>
        <Text style={{ marginBottom: spacing.xs }} numberOfLines={1}>
          <Text style={{ color: barColor, fontSize: 10 }}>{filled}</Text>
          <Text style={{ color: colors.text.muted + '55', fontSize: 10 }}>{empty}</Text>
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ flex: 1, fontSize: 16, color: colors.text.primary, letterSpacing: 0.5 }}>
            {label}
          </Text>
          <Text style={{ fontSize: 16, color: over ? colors.status.danger : colors.text.primary, letterSpacing: 0.5 }}>
            {fmt(value)}
            <Text style={{ fontSize: 13, color: colors.text.muted }}> / {fmt(total)}</Text>
          </Text>
          {onPress && (
            <Icon name="chevron-right" size={16} color={colors.text.muted} style={{ marginLeft: 2 }} />
          )}
        </View>
      </View>
    </View>
  );

  return onPress ? (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>{inner}</TouchableOpacity>
  ) : inner;
}
