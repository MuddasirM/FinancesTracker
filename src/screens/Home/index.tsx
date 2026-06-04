import React from 'react';
import { View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/types';
import { useTheme } from '../../theme/useTheme';
import { Screen } from '../../components/Screen';
import { Text } from '../../components/Text';
import { CategoryRow } from '../../components/CategoryRow';

const FONT = 'VT323-Regular';

const TOTAL_BALANCE    = 12480.35;
const MONTHLY_INCOME   = 5300.00;
const MONTHLY_EXPENSES = 1401.89;
const SPENT_PERCENT    = MONTHLY_EXPENSES / MONTHLY_INCOME;

// Each category gets its own distinct terminal-palette color
const CATEGORIES = [
  { label: 'Housing',       amount: 1200.00, budget: 1400.00, color: '#8B7EC8', icon: 'home-outline' },
  { label: 'Food',          amount:   93.90, budget:  200.00, color: '#C9A87C', icon: 'cart-outline' },
  { label: 'Utilities',     amount:   92.00, budget:  150.00, color: '#5FA8A0', icon: 'lightning-bolt-outline' },
  { label: 'Subscriptions', amount:   15.99, budget:  100.00, color: '#C47A9A', icon: 'television-play' },
];

const BLOCK_FULL  = '█';
const BLOCK_EMPTY = '░';

function fmt(n: number) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function blockBar(pct: number, total: number): [string, string] {
  const filled = Math.round(Math.min(pct, 1) * total);
  return [BLOCK_FULL.repeat(filled), BLOCK_EMPTY.repeat(total - filled)];
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


export function HomeScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  const spentBlocks  = 20;
  const [spentFill, spentEmpty] = blockBar(SPENT_PERCENT, spentBlocks);

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

        {/* ── Monthly spend bar (block style) ── */}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.lg }}>
          <Text style={{ fontFamily: FONT, fontSize: 15, letterSpacing: 0 }}>
            <Text style={{ color: colors.accent.primary }}>{spentFill}</Text>
            <Text style={{ color: colors.text.muted + '55' }}>{spentEmpty}</Text>
          </Text>
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
