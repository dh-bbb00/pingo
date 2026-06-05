import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { CategoryStatItem } from '@/api/endpoints/stats.api'

interface Props {
  total:      number
  byCategory: CategoryStatItem[]
  title?:     string
}

const DONUT_R  = 72
const DONUT_IR = 50
const SCREEN_W = Dimensions.get('window').width

function fmtAmount(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`
  if (n >= 10_000)      return `${Math.floor(n / 10_000)}만`
  return n.toLocaleString()
}

export default function CategoryBreakdown({ total, byCategory, title }: Props) {
  const { theme } = useTheme()

  const hasData = byCategory.length > 0 && total > 0

  const pieData = byCategory.slice(0, 8).map((item, i) => ({
    value:      item.amount,
    color:      item.category?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    text:       item.category?.icon ?? '',
  }))

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      {title && <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{title}</Text>}

      {!hasData ? (
        <View style={ss.emptyWrap}>
          <Text style={[ss.emptyText, { color: theme.colors.text.disabled }]}>{strings.stats.noData}</Text>
        </View>
      ) : (
        <>
          <View style={ss.chartRow}>
            <PieChart
              data={pieData}
              donut
              radius={DONUT_R}
              innerRadius={DONUT_IR}
              centerLabelComponent={() => (
                <View style={ss.center}>
                  <Text style={[ss.centerAmount, { color: theme.colors.text.primary }]}>
                    {fmtAmount(total)}
                  </Text>
                  <Text style={[ss.centerLabel, { color: theme.colors.text.disabled }]}>원</Text>
                </View>
              )}
            />
            <View style={ss.legend}>
              {byCategory.slice(0, 5).map((item, i) => (
                <View key={item.category?.id ?? i} style={ss.legendRow}>
                  <View style={[ss.dot, { backgroundColor: item.category?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length] }]} />
                  <Text style={[ss.legendName, { color: theme.colors.text.primary }]} numberOfLines={1}>
                    {item.category ? `${item.category.icon} ${item.category.name}` : '기타'}
                  </Text>
                  <Text style={[ss.legendPct, { color: theme.colors.text.secondary }]}>{item.ratio}%</Text>
                </View>
              ))}
            </View>
          </View>

          {byCategory.length > 5 && (
            <View style={[ss.moreList, { borderTopColor: theme.colors.divider }]}>
              {byCategory.slice(5).map((item, i) => (
                <View key={item.category?.id ?? i} style={ss.moreRow}>
                  <View style={[ss.dot, { backgroundColor: item.category?.color ?? FALLBACK_COLORS[(i + 5) % FALLBACK_COLORS.length] }]} />
                  <Text style={[ss.legendName, { color: theme.colors.text.primary }]} numberOfLines={1}>
                    {item.category ? `${item.category.icon} ${item.category.name}` : '기타'}
                  </Text>
                  <Text style={[ss.legendPct, { color: theme.colors.text.secondary }]}>{item.ratio}%</Text>
                  <Text style={[ss.legendAmount, { color: theme.colors.text.secondary }]}>{item.amount.toLocaleString()}원</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  )
}

const FALLBACK_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

const ss = StyleSheet.create({
  wrap:         { borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  title:        { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  emptyWrap:    { height: 80, alignItems: 'center', justifyContent: 'center' },
  emptyText:    { fontSize: 13 },
  chartRow:     { flexDirection: 'row', alignItems: 'center', gap: 16 },
  center:       { alignItems: 'center' },
  centerAmount: { fontSize: 16, fontWeight: '700' },
  centerLabel:  { fontSize: 11 },
  legend:       { flex: 1, gap: 6 },
  legendRow:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:          { width: 8, height: 8, borderRadius: 4 },
  legendName:   { flex: 1, fontSize: 12 },
  legendPct:    { fontSize: 12, minWidth: 36, textAlign: 'right' },
  legendAmount: { fontSize: 11, minWidth: 64, textAlign: 'right' },
  moreList:     { marginTop: 12, paddingTop: 12, borderTopWidth: 1, gap: 8 },
  moreRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
})
