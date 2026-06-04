import React from 'react';
import { View, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/useTheme';
import { Text } from '../../components/Text';
import { ListItem } from '../../components/ListItem';
import { Setting } from '../../db/types';
import { DashedDivider } from './DashedDivider';

interface SettingRowProps {
  setting: Setting;
  value: string;
  isLast: boolean;
  onToggle: (key: string, value: string) => void;
  onOpenEditor: (setting: Setting) => void;
}

export function SettingRow({ setting, value, isLast, onToggle, onOpenEditor }: SettingRowProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const editable = setting.is_editable === 1;

  const label = (
    <View style={{ flex: 1, paddingRight: spacing.sm }}>
      <Text style={{ fontSize: 16, color: editable ? colors.text.primary : colors.text.muted, letterSpacing: 0.5 }}>
        {setting.label}
      </Text>
      {setting.description ? (
        <Text style={{ fontSize: 13, color: colors.text.muted, letterSpacing: 0.3, marginTop: 2, lineHeight: 17 }}>
          {setting.description}
        </Text>
      ) : null}
    </View>
  );

  let row: React.ReactNode;

  if (setting.input_type === 'toggle') {
    const on = value === 'true';
    row = (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md }}>
        {label}
        <Switch
          value={on}
          onValueChange={v => editable && onToggle(setting.key, String(v))}
          disabled={!editable}
          trackColor={{ false: colors.border, true: colors.accent.primary + '80' }}
          thumbColor={on ? colors.accent.primary : colors.text.muted}
        />
      </View>
    );
  } else if (setting.input_type === 'info') {
    row = (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md, opacity: 0.5 }}>
        {label}
      </View>
    );
  } else {
    const displayValue = setting.input_type === 'select' ? value.toUpperCase() : value || '—';
    row = (
      <ListItem
        title={setting.label}
        subtitle={setting.description ?? undefined}
        rightElement={
          editable ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text variant="caption" style={{ color: colors.accent.primary }}>
                {displayValue}
              </Text>
              <Icon name="chevron-right" size={16} color={colors.text.muted} />
            </View>
          ) : (
            <Text variant="caption" style={{ color: colors.text.muted }}>
              {displayValue}
            </Text>
          )
        }
        onPress={editable ? () => onOpenEditor(setting) : undefined}
        style={editable ? undefined : { opacity: 0.4 }}
      />
    );
  }

  return (
    <>
      {row}
      {!isLast && <DashedDivider />}
    </>
  );
}
