import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import SkeletonBox from '@/components/containers/SkeletonBox'
import type { Top10Item } from '@/api/endpoints/stats.api'

const s = strings.stats

interface Props {
  items:      Top10Item[]
  isLoading?: boolean
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function TopTransactionList({ items, isLoading }: Props) {
  const { theme } = useTheme()

  const rowDividerStyle = useMemo(
    () => ({ borderBottomWidth: 1 as const, borderBottomColor: theme.colors.divider }),
    [theme.colors.divider],
  )

  if (isLoading) {
    return (
      <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
        <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{s.top10Title}</Text>
        {Array.from({ length: 5 }, (_, i) => (
          <View key={i} style={ss.skRow}>
            <SkeletonBox width={20} height={12} radius={4} />
            <View style={ss.skMid}>
              <SkeletonBox width={120} height={12} radius={4} style={ss.skGap} />
              <SkeletonBox width={60}  height={10} radius={4} />
            </View>
            <SkeletonBox width={70} height={12} radius={4} />
          </View>
        ))}
      </View>
    )
  }

  if (!items.length) return null

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{s.top10Title}</Text>

      {items.map((item, idx) => (
        <View
          key={item.id}
          style={[ss.row, idx < items.length - 1 && rowDividerStyle]}
        >
          {/* 순위 */}
          <Text style={[ss.rank, { color: idx < 3 ? theme.colors.primary : theme.colors.text.disabled }]}>
            {idx + 1}
          </Text>

          {/* 아이콘 + 가맹점/날짜 */}
          <View style={ss.info}>
            <View style={ss.nameRow}>
              {item.category?.icon ? (
                <Text style={ss.icon}>{item.category.icon}</Text>
              ) : null}
              <Text style={[ss.merchant, { color: theme.colors.text.primary }]} numberOfLines={1}>
                {item.merchantName}
              </Text>
            </View>
            <Text style={[ss.sub, { color: theme.colors.text.disabled }]}>
              {item.category?.name ?? s.other}
              {'  ·  '}
              {formatDate(item.transactionDate)}
            </Text>
          </View>

          {/* 금액 */}
          <Text style={[ss.amount, { color: theme.colors.text.primary }]}>
            {item.amount.toLocaleString()}{s.currencyUnit}
          </Text>
        </View>
      ))}
    </View>
  )
}

const ss = StyleSheet.create({
  wrap:    { borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  title:   { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  row:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  rank:    { width: 20, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  info:    { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  icon:    { fontSize: 14 },
  merchant:{ fontSize: 14, fontWeight: '500', flexShrink: 1 },
  sub:     { fontSize: 12 },
  amount:  { fontSize: 14, fontWeight: '600' },
  skRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  skMid:   { flex: 1 },
  skGap:   { marginBottom: 4 },
})
