import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { CategoryStatItem } from '@/api/endpoints/stats.api'
import type { StatsDateTab } from '../types'
import SkeletonBox from '@/components/containers/SkeletonBox'

const s = strings.stats

interface Props {
  total:           number
  byCategory:      CategoryStatItem[]
  prevByCategory?: CategoryStatItem[]
  dateTab?:        StatsDateTab
  title?:          string
  isLoading?:      boolean
}

const DONUT_R  = 72
const DONUT_IR = 50

function fmtAmount(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`
  if (n >= 10_000)      return `${Math.floor(n / 10_000)}만`
  return n.toLocaleString()
}

const FALLBACK_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6']

const SKELETON_ROWS = [100, 130, 80, 110, 70, 90]

export default function CategoryBreakdown({ total, byCategory, prevByCategory, dateTab, title, isLoading }: Props) {
  const { theme } = useTheme()

  const prevMap = useMemo(() => {
    if (!prevByCategory) return null
    const map: Record<string, number> = {}
    for (const item of prevByCategory) {
      map[item.category?.id ?? '__none__'] = item.amount
    }
    return map
  }, [prevByCategory])

  const period = dateTab ?? ''

  function getDiff(item: CategoryStatItem): { text: string; color: string } | null {
    if (!prevMap) return null
    const key  = item.category?.id ?? '__none__'
    const prev = prevMap[key]
    if (prev === undefined) {
      return { text: s.vsPrevNone(period), color: theme.colors.text.disabled }
    }
    const diff = item.amount - prev
    if (diff === 0) return { text: s.vsPrevSame(period), color: theme.colors.text.disabled }
    if (diff > 0)   return { text: s.categoryDiffFmt(period, '+', diff),        color: theme.colors.semantic.error }
    return { text: s.categoryDiffFmt(period, '-', Math.abs(diff)), color: theme.colors.semantic.income }
  }

  if (isLoading) {
    return (
      <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
        {title && <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{title}</Text>}
        <View style={ss.donutWrap}>
          <SkeletonBox width={DONUT_R * 2} height={DONUT_R * 2} radius={DONUT_R} />
        </View>
        <View style={ss.list}>
          {SKELETON_ROWS.map((w, i) => (
            <View key={i} style={ss.row}>
              <SkeletonBox width={8} height={8} radius={4} />
              <SkeletonBox width={w} height={11} radius={4} style={ss.skName} />
              <SkeletonBox width={56} height={11} radius={4} />
              <SkeletonBox width={28} height={11} radius={4} />
            </View>
          ))}
        </View>
      </View>
    )
  }

  const hasData = byCategory.length > 0 && total > 0

  const pieData = byCategory.slice(0, 8).map((item, i) => ({
    value: item.amount,
    color: item.category?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    text:  item.category?.icon ?? '',
  }))

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      {title && <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{title}</Text>}

      {!hasData ? (
        <View style={ss.emptyWrap}>
          <Text style={[ss.emptyText, { color: theme.colors.text.disabled }]}>{s.noData}</Text>
        </View>
      ) : (
        <>
          <View style={ss.donutWrap}>
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
                  <Text style={[ss.centerLabel, { color: theme.colors.text.disabled }]}>{s.currencyUnit}</Text>
                </View>
              )}
            />
          </View>

          <View style={ss.list}>
            {byCategory.map((item, i) => {
              const diff  = getDiff(item)
              const color = item.category?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length]
              return (
                <React.Fragment key={item.category?.id ?? i}>
                  {i > 0 && <View style={[ss.sep, { backgroundColor: theme.colors.divider }]} />}
                  <View style={ss.row}>
                    <View style={[ss.dot, { backgroundColor: color }]} />
                    <Text style={[ss.name, { color: theme.colors.text.primary }]} numberOfLines={1}>
                      {item.category ? `${item.category.icon} ${item.category.name}` : s.other}
                    </Text>
                    {diff !== null && (
                      <Text style={[ss.diff, { color: diff.color }]}>{diff.text}</Text>
                    )}
                    <Text style={[ss.pct, { color: theme.colors.text.secondary }]}>{item.ratio}%</Text>
                  </View>
                </React.Fragment>
              )
            })}
          </View>
        </>
      )}
    </View>
  )
}

const ss = StyleSheet.create({
  wrap:         { borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  title:        { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  emptyWrap:    { height: 80, alignItems: 'center', justifyContent: 'center' },
  emptyText:    { fontSize: 13 },
  donutWrap:    { alignItems: 'center', marginBottom: 16 },
  center:       { alignItems: 'center' },
  centerAmount: { fontSize: 16, fontWeight: '700' },
  centerLabel:  { fontSize: 11 },
  list:         { marginTop: 4 },
  sep:          { height: StyleSheet.hairlineWidth },
  row:          { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  dot:          { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  name:         { flex: 1, fontSize: 13 },
  diff:         { fontSize: 12, minWidth: 88, textAlign: 'right' },
  pct:          { fontSize: 13, minWidth: 36, textAlign: 'right' },
  skName:       { flex: 1 },
})
