import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'

const s = strings.stats

interface Props {
  total:     number
  prevTotal: number
}

export default function SummaryCard({ total, prevTotal }: Props) {
  const { theme } = useTheme()

  const diff = total - prevTotal
  const pct  = prevTotal > 0 ? Math.round(Math.abs(diff) / prevTotal * 100) : null

  let trendText: string = s.vsPrevSame
  let trendColor = theme.colors.text.secondary
  if (diff > 0 && pct !== null) {
    trendText  = s.vsPrev('+', pct)
    trendColor = theme.colors.semantic.error
  } else if (diff < 0 && pct !== null) {
    trendText  = s.vsPrev('-', pct)
    trendColor = theme.colors.semantic.income
  }

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      <Text style={[ss.label, { color: theme.colors.text.secondary }]}>{s.totalExpense}</Text>
      <Text style={[ss.amount, { color: theme.colors.text.primary }]}>
        {total.toLocaleString()}<Text style={ss.unit}>원</Text>
      </Text>
      {prevTotal > 0 || total > 0 ? (
        <Text style={[ss.trend, { color: trendColor }]}>{trendText}</Text>
      ) : null}
    </View>
  )
}

const ss = StyleSheet.create({
  wrap:   { borderRadius: 16, padding: 20, marginHorizontal: 16, marginBottom: 12 },
  label:  { fontSize: 13, marginBottom: 6 },
  amount: { fontSize: 28, fontWeight: '700' },
  unit:   { fontSize: 16, fontWeight: '400' },
  trend:  { fontSize: 13, marginTop: 4 },
})
