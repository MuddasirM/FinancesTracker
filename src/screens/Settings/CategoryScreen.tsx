import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/useTheme';
import { Screen } from '../../components/Screen';
import { Header } from '../../components/Header';
import { Text } from '../../components/Text';
import { ListItem } from '../../components/ListItem';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BottomSheet } from '../../components/BottomSheet';
import { getCategoryWithSettings, setSetting } from '../../db/repositories/settingsRepository';
import { Setting, SettingCategory, SettingInputType } from '../../db/types';
import { RootStackParamList } from '../../navigation/types';
import { ThemeMode } from '../../theme/ThemeContext';
import { SettingRow } from './SettingRow';

type RouteProps = RouteProp<RootStackParamList, 'SettingsCategory'>;

interface EditingSheet {
  key: string
  inputType: SettingInputType
  value: string
  options: string[] | null
}

export function CategoryScreen() {
  const { theme, setThemeMode } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const { colors, spacing } = theme;
  const { categoryKey } = route.params;

  const [category, setCategory]       = useState<SettingCategory | null>(null);
  const [settings, setSettings]       = useState<Setting[]>([]);
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [editing, setEditing]         = useState<EditingSheet | null>(null);

  useEffect(() => {
    getCategoryWithSettings(categoryKey).then(data => {
      setCategory(data.category);
      setSettings(data.settings);
      const vals: Record<string, string> = {};
      for (const s of data.settings) vals[s.key] = s.value;
      setLocalValues(vals);
    });
  }, [categoryKey]);

  async function handleChange(key: string, value: string) {
    await setSetting(key, value);
    setLocalValues(prev => ({ ...prev, [key]: value }));
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
    if (key === 'theme') setThemeMode(value as ThemeMode);
  }

  function openEditor(setting: Setting) {
    if (!setting.is_editable) return;
    const options = setting.options ? (JSON.parse(setting.options) as string[]) : null;
    setEditing({
      key:       setting.key,
      inputType: setting.input_type,
      value:     localValues[setting.key] ?? setting.value,
      options,
    });
  }

  function renderEditSheet() {
    if (!editing) return null;

    if (editing.inputType === 'select') {
      const options = editing.options ?? [];
      return (
        <BottomSheet
          visible
          onDismiss={() => setEditing(null)}
          snapHeight={Math.min(96 + options.length * 56, 520)}
          scrollable>
          <View style={{ paddingTop: spacing.sm }}>
            <Text variant="caption" style={{ letterSpacing: 2, color: colors.text.muted, paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
              SELECT OPTION
            </Text>
            {options.map((opt, i) => (
              <ListItem
                key={opt}
                leftIcon={
                  <Icon
                    name={opt === editing.value ? 'check' : 'minus'}
                    size={16}
                    color={opt === editing.value ? colors.accent.primary : colors.text.secondary}
                  />
                }
                title={opt.toUpperCase()}
                active={opt === editing.value}
                onPress={() => { handleChange(editing.key, opt); setEditing(null); }}
                showDivider={i < options.length - 1}
              />
            ))}
          </View>
        </BottomSheet>
      );
    }

    const isTime   = editing.inputType === 'time_picker';
    const isNumber = editing.inputType === 'number';
    const kbType   = isNumber ? 'numeric' : 'default';
    const sheetLabel =
      isTime   ? 'SET TIME (HH:MM)' :
      isNumber ? 'ENTER VALUE'      : 'EDIT VALUE';

    return (
      <BottomSheet
        visible
        onDismiss={() => setEditing(null)}
        snapHeight={300}>
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
          <Text variant="caption" style={{ letterSpacing: 2, color: colors.text.muted, marginBottom: spacing.md }}>
            {sheetLabel}
          </Text>
          <Input
            value={editing.value}
            onChangeText={v => setEditing(prev => prev ? { ...prev, value: v } : null)}
            keyboardType={kbType as 'default' | 'numeric'}
            placeholder={isTime ? 'HH:MM' : undefined}
            autoFocus
          />
          <Button
            label="Save"
            onPress={() => { handleChange(editing.key, editing.value); setEditing(null); }}
            style={{ marginTop: spacing.sm }}
            fullWidth
          />
        </View>
      </BottomSheet>
    );
  }

  if (!category) return <Screen><Header title="" onBack={() => navigation.goBack()} borderless /></Screen>;

  return (
    <Screen>
      <Header title="" onBack={() => navigation.goBack()} borderless />

      <View style={{ alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Icon name={category.icon} size={26} color={colors.accent.primary} />
        <Text style={{ fontSize: 11, letterSpacing: 2, color: colors.text.muted, textTransform: 'uppercase', marginTop: 4 }}>
          {category.label}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        {settings.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl }}>
            <Text style={{ fontSize: 18, color: colors.text.muted, letterSpacing: 2 }}>
              NO SETTINGS FOUND
            </Text>
          </View>
        ) : (
          <View style={{ paddingTop: spacing.sm }}>
            {settings.map((s, i) => (
              <SettingRow
                key={s.key}
                setting={s}
                value={localValues[s.key] ?? s.value}
                isLast={i === settings.length - 1}
                onToggle={handleChange}
                onOpenEditor={openEditor}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {renderEditSheet()}
    </Screen>
  );
}
