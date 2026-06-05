import React, { useMemo } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { CategoryStatItem } from '@/api/endpoints/stats.api'
import SkeletonBox from '@/components/containers/SkeletonBox'

const s = strings.stats

interface Props {
  total:           number
  byCategory:      CategoryStatItem[]
  prevByCategory?: CategoryStatItem[]
  title?:          string
  isLoading?:      boolean
}

const DONUT_R  = 72
const DONUT_IR = 50
const SCREEN_W = Dimensions.get('window').width

function fmtAmount(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`
  if (n >= 10_000)      return `${Math.floor(n / 10_000)}만`
  return n.toLocaleString()
}

const SKELETON_LEGEND_WIDTHS = [90, 110, 70, 100, 80]

export default function CategoryBreakdown({ total, byCategory, prevByCategory, title, isLoading }: Props) {
  const { theme } = useTheme()

  const prevMap = useMemo(() => {
    if (!prevByCategory) return null
    const map: Record<string, number> = {}
    for (const item of prevByCategory) {
      const key = item.category?.id ?? '__none__'
      map[key] = item.amount
    }
    return map
  }, [prevByCategory])

  function getDiff(item: CategoryStatItem): { text: string; color: string } | null {
    if (!prevMap) return null
    const key  = item.category?.id ?? '__none__'
    const prev = prevMap[key]
    if (prev === undefined) {
      return { text: s.categoryDiffNoPrev, color: theme.colors.text.disabled }
    }
    const diff = item.amount - prev
    if (diff === 0) return { text: s.categoryDiffNone, color: theme.colors.text.disabled }
    if (diff > 0)   return { text: s.categoryDiffFmt('+', diff), color: theme.colors.semantic.error }
    return { text: s.categoryDiffFmt('-', Math.abs(diff)), color: theme.colors.semantic.income }
  }

  if (isLoading) {
    return (
      <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
        {title && <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{title}</Text>}
        <View style={ss.chartRow}>
          <SkeletonBox width={DONUT_R * 2} height={DONUT_R * 2} radius={DONUT_R} />
          <View style={ss.legend}>
            {SKELETON_LEGEND_WIDTHS.map((w, i) => (
              <SkeletonBox key={i} width={w} height={12} />
            ))}
          </View>
        </View>
      </View>
    )
  }

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
                  <Text style={[ss.centerLabel, { color: theme.colors.text.disabled }]}>{strings.stats.currencyUnit}</Text>
                </View>
              )}
            />
            <View style={ss.legend}>
              {byCategory.slice(0, 5).map((item, i) => {
                const diff = getDiff(item)
                return (
                  <View key={item.category?.id ?? i} style={ss.legendRow}>
                    <View style={[ss.dot, { backgroundColor: item.category?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length] }]} />
                    <View style={ss.legendInfo}>
                      <Text style={[ss.legendName, { color: theme.colors.text.primary }]} numberOfLines={1}>
                        {item.category ? `${item.category.icon} ${item.category.name}` : s.other}
                      </Text>
                      {diff !== null && (
                        <Text style={[ss.legendDiff, { color: diff.color }]}>{diff.text}</Text>
                      )}
                    </View>
                    <Text style={[ss.legendPct, { color: theme.colors.text.secondary }]}>{item.ratio}%</Text>
                  </View>
                )
              })}
            </View>
          </View>

          {byCategory.length > 5 && (
            <View style={[ss.moreList, { borderTopColor: theme.colors.divider }]}>
              {byCategory.slice(5).map((item, i) => {
                const diff = getDiff(item)
                return (
                  <View key={item.category?.id ?? i} style={ss.moreRow}>
                    <View style={[ss.dot, { backgroundColor: item.category?.color ?? FALLBACK_COLORS[(i + 5) % FALLBACK_COLORS.length] }]} />
                    <View style={ss.legendInfo}>
                      <Text style={[ss.legendName, { color: theme.colors.text.primary }]} numberOfLines={1}>
                        {item.category ? `${item.category.icon} ${item.category.name}` : s.other}
                      </Text>
                      {diff !== null && (
                        <Text style={[ss.legendDiff, { color: diff.color }]}>{diff.text}</Text>
                      )}
                    </View>
                    <Text style={[ss.legendPct, { color: theme.colors.text.secondary }]}>{item.ratio}%</Text>
                    <Text style={[ss.legendAmount, { color: theme.colors.text.secondary }]}>{item.amount.toLocaleString()}{s.currencyUnit}</Text>
                  </View>
                )
              })}
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
  legendInfo:   { flex: 1 },
  legendName:   { fontSize: 12 },
  legendDiff:   { fontSize: 10, marginTop: 1 },
  legendPct:    { fontSize: 12, minWidth: 36, textAlign: 'right' },
  legendAmount: { fontSize: 11, minWidth: 64, textAlign: 'right' },
  moreList:     { marginTop: 12, paddingTop: 12, borderTopWidth: 1, gap: 8 },
  moreRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
})
