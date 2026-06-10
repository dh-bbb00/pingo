import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import SkeletonBox from '@/components/containers/SkeletonBox'

const s = strings.stats

import type { StatsDateTab } from '@/api/endpoints/stats.api'

const PERIOD_LABEL: Record<StatsDateTab, string> = {
  [s.tabDay]:   s.tabDay,
  [s.tabMonth]:   s.tabMonth,
  [s.tabYear]:   s.tabYear,
  [s.tabRange]: s.tabRange,
}

const WARN_PCT = 80
const OVER_PCT = 100

interface Props {
  total:      number
  prevTotal:  number
  dateTab:    StatsDateTab
  budget?:    number | null
  isLoading?: boolean
}

export default function SummaryCard({ total, prevTotal, dateTab, budget, isLoading }: Props) {
  const { theme } = useTheme()

  if (isLoading) {
    return (
      <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
        <SkeletonBox width={72}  height={12} style={ss.skGap1} />
        <SkeletonBox width={160} height={34} radius={6} style={ss.skGap2} />
        <SkeletonBox width={100} height={12} />
      </View>
    )
  }

  const period = PERIOD_LABEL[dateTab]

  const diff = total - prevTotal
  const pct  = prevTotal > 0 ? Math.round(Math.abs(diff) / prevTotal * 100) : null

  let trendText: string = s.vsPrevSame(period)
  let trendColor = theme.colors.text.secondary
  if (diff > 0 && pct !== null) {
    trendText  = s.vsPrev(period, '+', pct)
    trendColor = theme.colors.semantic.error
  } else if (diff > 0 && prevTotal === 0) {
    // 전기간 지출이 0이었으나 이번에 지출 발생
    trendText  = s.vsPrevNone(period)
    trendColor = theme.colors.semantic.error
  } else if (diff < 0 && pct !== null) {
    trendText  = s.vsPrev(period, '-', pct)
    trendColor = theme.colors.semantic.income
  }

  const budgetPct   = budget && budget > 0 ? Math.round((total / budget) * 100) : null
  const isOver      = budgetPct !== null && budgetPct >= OVER_PCT
  const isWarn      = budgetPct !== null && budgetPct >= WARN_PCT && !isOver
  const barColor    = isOver ? theme.colors.semantic.error : isWarn ? theme.colors.semantic.warning : theme.colors.primary
  const barWidth    = budgetPct !== null ? `${Math.min(budgetPct, 100)}%` : '0%'

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      <Text style={[ss.label, { color: theme.colors.text.secondary }]}>{s.totalExpense}</Text>
      <Text style={[ss.amount, { color: theme.colors.text.primary }]}>
        {total.toLocaleString()}<Text style={ss.unit}>{s.currencyUnit}</Text>
      </Text>
      {prevTotal > 0 || total > 0 ? (
        <Text style={[ss.trend, { color: trendColor }]}>{trendText}</Text>
      ) : null}

      {budget != null && budget > 0 && (
        <View style={ss.budgetWrap}>
          <View style={[ss.budgetBarTrack, { backgroundColor: theme.colors.surfaceVariant }]}>
            <View style={[ss.budgetBar, { width: barWidth as any, backgroundColor: barColor }]} />
          </View>
          <View style={ss.budgetMeta}>
            <Text style={[ss.budgetLabel, { color: theme.colors.text.secondary }]}>
              {s.budgetLabel(budget)}
            </Text>
            <Text style={[ss.budgetPct, { color: isOver ? theme.colors.semantic.error : isWarn ? theme.colors.semantic.warning : theme.colors.text.secondary }]}>
              {isOver ? s.budgetOver : s.budgetPct(budgetPct!)}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

const ss = StyleSheet.create({
  wrap:           { borderRadius: 16, padding: 20, marginHorizontal: 16, marginBottom: 12 },
  skGap1:         { marginBottom: 10 },
  skGap2:         { marginBottom: 8 },
  label:          { fontSize: 13, marginBottom: 6 },
  amount:         { fontSize: 28, fontWeight: '700' },
  unit:           { fontSize: 16, fontWeight: '400' },
  trend:          { fontSize: 13, marginTop: 4 },
  budgetWrap:     { marginTop: 16 },
  budgetBarTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  budgetBar:      { height: 6, borderRadius: 3 },
  budgetMeta:     { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  budgetLabel:    { fontSize: 12 },
  budgetPct:      { fontSize: 12, fontWeight: '600' },
})
