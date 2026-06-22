import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { ByMonthResult } from '@/api/endpoints/stats.api'
import SkeletonBox from '@/components/containers/SkeletonBox'

const s = strings.stats

interface Props {
  data:      ByMonthResult[]
  isLoading: boolean
}

export default function MonthlyComparisonCard({ data, isLoading }: Props) {
  const { theme } = useTheme()

  if (isLoading) {
    return (
      <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
        <SkeletonBox width={100} height={12} style={{ marginBottom: 14 }} />
        {[0, 1, 2].map(i => (
          <View key={i} style={[ss.row, i < 2 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.divider }]}>
            <SkeletonBox width={28} height={13} />
            <SkeletonBox width={100} height={15} style={{ marginLeft: 8 }} />
            <SkeletonBox width={72} height={12} />
          </View>
        ))}
      </View>
    )
  }

  const sorted = [...data].sort((a, b) => a.month.localeCompare(b.month))
  // 마지막 3개월 표시, 그 이전 달은 첫 번째 행의 비교 기준
  const displayItems = sorted.slice(-3)
  const baseline     = sorted.length > 3 ? sorted[sorted.length - 4] : null

  const rows = displayItems.map((item, i) => {
    const prev   = i === 0 ? baseline : displayItems[i - 1]
    const diff   = prev != null ? item.amount - prev.amount : null
    const month  = new Date(item.month).getMonth() + 1
    return { item, month, diff }
  })

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{s.monthlyComparison}</Text>
      {rows.map(({ item, month, diff }, i) => {
        const diffColor = diff === null
          ? theme.colors.text.disabled
          : diff > 0 ? theme.colors.semantic.error
          : diff < 0 ? theme.colors.semantic.income
          : theme.colors.text.secondary

        const diffLabel = diff === null ? null
          : diff > 0   ? s.diffMore(diff)
          : diff < 0   ? s.diffLess(Math.abs(diff))
          : s.diffSame

        return (
          <View
            key={item.month}
            style={[
              ss.row,
              i < rows.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.divider },
            ]}
          >
            <Text style={[ss.month, { color: theme.colors.text.secondary }]}>{s.monthFmt(month)}</Text>
            <Text style={[ss.amount, { color: theme.colors.text.primary }]}>
              {item.amount > 0 ? `${item.amount.toLocaleString()}${s.currencyUnit}` : '-'}
            </Text>
            {diffLabel != null && (
              <Text style={[ss.diff, { color: diffColor }]}>{diffLabel}</Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

const ss = StyleSheet.create({
  wrap:   { borderRadius: 16, padding: 20, marginHorizontal: 16, marginBottom: 12 },
  title:  { fontSize: 12, marginBottom: 6 },
  row:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  month:  { fontSize: 13, width: 32 },
  amount: { fontSize: 15, fontWeight: '700', flex: 1 },
  diff:   { fontSize: 12 },
})
