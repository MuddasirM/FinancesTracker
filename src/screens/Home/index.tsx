import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/types';
import { useTheme } from '../../theme/useTheme';
import { Screen } from '../../components/Screen';
import { Text } from '../../components/Text';

const FONT = 'VT323-Regular';

const TOTAL_BALANCE    = 12480.35;
const MONTHLY_INCOME   = 5300.00;
const MONTHLY_EXPENSES = 1401.89;
const SPENT_PERCENT    = MONTHLY_EXPENSES / MONTHLY_INCOME;

const CATEGORIES = [
  { label: 'Housing',       amount: 1200.00, budget: 1400.00, color: '#9B8EC4', icon: 'home-outline' },
  { label: 'Food',          amount:   93.90, budget:  200.00, color: '#C4A054', icon: 'cart-outline' },
  { label: 'Utilities',     amount:   92.00, budget:  150.00, color: '#7A8C9A', icon: 'lightning-bolt-outline' },
  { label: 'Subscriptions', amount:   15.99, budget:  100.00, color: '#C47A9A', icon: 'television-play' },
];

function fmt(n: number) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function StatsRow() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  const stats = [
    { label: 'Income',   value: fmt(MONTHLY_INCOME),                    color: colors.text.primary },
    { label: 'Expenses', value: fmt(MONTHLY_EXPENSES),                  color: colors.text.primary },
    { label: 'Saved',    value: fmt(MONTHLY_INCOME - MONTHLY_EXPENSES), color: colors.status.success },
  ];

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: FONT, fontSize: 12, color: colors.text.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
              {stat.label}
            </Text>
            <Text style={{ fontFamily: FONT, fontSize: 18, color: stat.color, marginTop: 1, letterSpacing: 0.5 }}>
              {stat.value}
            </Text>
          </View>
          {i < stats.length - 1 && (
            <View style={{ width: 1, backgroundColor: colors.border, marginHorizontal: spacing.sm }} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

interface CategoryRowProps {
  icon: string;
  label: string;
  value: number;
  total: number;
  color: string;
  onPress?: () => void;
}

function CategoryRow({ icon, label, value, total, color, onPress }: CategoryRowProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const pct = Math.min(value / total, 1);
  const over = value > total;

  const content = (
    <View style={{ marginBottom: spacing.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs, gap: spacing.sm }}>
        <View style={{ width: 32, height: 32, borderRadius: 2, borderWidth: 1, borderColor: color + '40', backgroundColor: color + '12', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={16} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: FONT, fontSize: 16, color: colors.text.primary, letterSpacing: 0.5 }}>{label}</Text>
        </View>
        <Text style={{ fontFamily: FONT, fontSize: 16, color: over ? colors.status.danger : colors.text.primary, letterSpacing: 0.5 }}>
          {fmt(value)}
          <Text style={{ fontFamily: FONT, fontSize: 13, color: colors.text.muted }}> / {fmt(total)}</Text>
        </Text>
        {onPress && (
          <Icon name="chevron-right" size={16} color={colors.text.muted} style={{ marginLeft: 2 }} />
        )}
      </View>
      <View style={{ height: 3, backgroundColor: colors.background.secondary, marginLeft: 44 }}>
        <View style={{ height: 3, width: `${pct * 100}%`, backgroundColor: over ? colors.status.danger : color }} />
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

export function HomeScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Balance ── */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}>
          <Text style={{ fontFamily: FONT, fontSize: 14, color: colors.text.muted, letterSpacing: 2, textTransform: 'uppercase' }}>
            Net Worth · June 2026
          </Text>
          <Text style={{ fontFamily: FONT, fontSize: 62, color: colors.text.primary, letterSpacing: 2, lineHeight: 68, marginTop: 2 }}>
            ${TOTAL_BALANCE.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.status.success + '50', paddingHorizontal: 8, paddingVertical: 2, gap: 4 }}>
              <Icon name="trending-up" size={11} color={colors.status.success} />
              <Text style={{ fontFamily: FONT, fontSize: 14, color: colors.status.success, letterSpacing: 1 }}>+$320 this month</Text>
            </View>
          </View>
        </View>

        {/* ── Stats row ── */}
        <StatsRow />

        {/* ── Monthly spend bar ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <View style={{ height: 3, backgroundColor: colors.background.secondary }}>
            <View style={{ height: 3, width: `${Math.min(SPENT_PERCENT * 100, 100)}%`, backgroundColor: colors.accent.primary }} />
          </View>
          <Text style={{ fontFamily: FONT, fontSize: 13, color: colors.text.muted, letterSpacing: 1, marginTop: spacing.xs, textTransform: 'uppercase' }}>
            {Math.round(SPENT_PERCENT * 100)}% of income spent
          </Text>
        </View>

        {/* ── Divider ── */}
        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg, marginTop: spacing.xl }} />

        {/* ── Category breakdown ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Text style={{ fontFamily: FONT, fontSize: 22, color: colors.text.primary, letterSpacing: 2, marginBottom: spacing.md }}>
            Spending by Category
          </Text>

          {CATEGORIES.map(cat => (
            <CategoryRow
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              value={cat.amount}
              total={cat.budget}
              color={cat.color}
              onPress={() => navigation.navigate('Expenses', { category: cat.label })}
            />
          ))}
        </View>

      </ScrollView>
    </Screen>
  );
}
