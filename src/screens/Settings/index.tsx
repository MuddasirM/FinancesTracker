import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../theme/useTheme';
import { Screen } from '../../components/Screen';
import { Text } from '../../components/Text';
import { CategoryButton } from '../../components/CategoryButton';
import { getCategories } from '../../db/repositories/settingsRepository';
import { SettingCategory } from '../../db/types';
import { RootStackNavProp } from '../../navigation/types';

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  return `${d} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function SettingsScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavProp>();
  const { colors, spacing } = theme;

  const [categories, setCategories] = useState<SettingCategory[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const cardSize    = Math.floor((screenWidth - spacing.md * 2 - spacing.sm) / 2);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}>

        {/* ── Terminal header ── */}
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg }}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 16 }}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Icon name="arrow-left" size={14} color={colors.text.muted} />
            <Text style={{ fontSize: 13, letterSpacing: 2, color: colors.text.muted, marginLeft: 6 }}>
              BACK
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 42, letterSpacing: 4, color: colors.text.primary, textTransform: 'uppercase', lineHeight: 46 }}>
            Settings
          </Text>
          <Text style={{ fontSize: 14, letterSpacing: 2, color: colors.text.muted, marginTop: 4 }}>
            {formatDate(new Date())}
          </Text>
          <View style={{ height: 1, backgroundColor: colors.border, marginTop: spacing.md }} />
        </View>

        {/* ── 2-column category grid ── */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
        }}>
          {categories.map(cat => (
            <CategoryButton
              key={cat.key}
              label={cat.label}
              icon={cat.icon}
              size={cardSize}
              onPress={() => navigation.navigate('SettingsCategory', { categoryKey: cat.key })}
            />
          ))}
        </View>

      </ScrollView>
    </Screen>
  );
}
