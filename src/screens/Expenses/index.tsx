import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../../theme/useTheme';
import { Screen } from '../../components/Screen';
import { Text } from '../../components/Text';
import { FAB } from '../../components/FAB';
import { ExpensesScreenProps } from '../../navigation/types';

const FONT = 'VT323-Regular';

const TRANSACTIONS = [
  { id: '1', title: 'Salary',        amount:  4500.00, type: 'income',  icon: 'briefcase-outline',     category: 'Work',          date: 'Today' },
  { id: '2', title: 'Rent',          amount: -1200.00, type: 'expense', icon: 'home-outline',           category: 'Housing',       date: 'Today' },
  { id: '3', title: 'Grocery Store', amount:   -87.40, type: 'expense', icon: 'cart-outline',           category: 'Food',          date: 'Yesterday' },
  { id: '4', title: 'Netflix',       amount:   -15.99, type: 'expense', icon: 'television-play',        category: 'Subscriptions', date: 'Yesterday' },
  { id: '5', title: 'Freelance',     amount:   800.00, type: 'income',  icon: 'laptop',                 category: 'Work',          date: 'Jun 3' },
  { id: '6', title: 'Electricity',   amount:   -92.00, type: 'expense', icon: 'lightning-bolt-outline', category: 'Utilities',     date: 'Jun 3' },
  { id: '7', title: 'Coffee',        amount:    -6.50, type: 'expense', icon: 'coffee-outline',         category: 'Food',          date: 'Jun 3' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Work:          '#C9A87C',
  Housing:       '#9B8EC4',
  Food:          '#C4A054',
  Subscriptions: '#C47A9A',
  Utilities:     '#7A8C9A',
};

function fmt(n: number) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function groupByDate(txns: typeof TRANSACTIONS) {
  const map: Record<string, typeof TRANSACTIONS> = {};
  txns.forEach(t => { if (!map[t.date]) map[t.date] = []; map[t.date].push(t); });
  return Object.entries(map);
}

export function ExpensesScreen() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const route = useRoute<ExpensesScreenProps['route']>();
  const activeCategory = route.params?.category;
  const groups = groupByDate(TRANSACTIONS);

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Header ── */}
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg }}>
          <Text style={{ fontFamily: FONT, fontSize: 14, color: colors.text.muted, letterSpacing: 2, textTransform: 'uppercase' }}>
            {activeCategory ? activeCategory : 'June 2026'}
          </Text>
          <Text style={{ fontFamily: FONT, fontSize: 38, color: colors.text.primary, letterSpacing: 1, lineHeight: 44 }}>
            {activeCategory ? activeCategory : 'Transactions'}
          </Text>
        </View>

        <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg }} />

        {/* ── Grouped transaction list ── */}
        <View style={{ marginTop: spacing.md }}>
          {groups.map(([dateLabel, items]) => (
            <View key={dateLabel} style={{ marginBottom: spacing.sm }}>
              {/* Date group header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.xs, gap: spacing.sm }}>
                <Text style={{ fontFamily: FONT, fontSize: 13, color: colors.text.muted, letterSpacing: 2, textTransform: 'uppercase' }}>
                  {dateLabel}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              </View>

              {items.map(item => {
                const isIncome = item.type === 'income';
                const iconColor = CATEGORY_COLORS[item.category] ?? colors.text.secondary;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.5}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: 10 }}>
                    {/* Icon chip */}
                    <View style={{ width: 40, height: 40, borderRadius: 2, borderWidth: 1, borderColor: iconColor + '40', backgroundColor: iconColor + '12', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                      <Icon name={item.icon} size={19} color={iconColor} />
                    </View>

                    {/* Title + category */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: FONT, fontSize: 18, color: colors.text.primary, letterSpacing: 0.5, lineHeight: 22 }}>
                        {item.title}
                      </Text>
                      <Text style={{ fontFamily: FONT, fontSize: 13, color: colors.text.muted, letterSpacing: 1, textTransform: 'uppercase', lineHeight: 16 }}>
                        {item.category}
                      </Text>
                    </View>

                    {/* Amount */}
                    <Text style={{ fontFamily: FONT, fontSize: 20, color: isIncome ? colors.status.success : colors.text.primary, letterSpacing: 0.5 }}>
                      {isIncome ? '+' : '−'}{fmt(item.amount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

      </ScrollView>

      <FAB onPress={() => {}} iconName="plus" />
    </Screen>
  );
}
