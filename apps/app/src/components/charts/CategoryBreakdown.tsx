import React, { useMemo, useState, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, Animated, Vibration, PanResponder } from 'react-native'
import { PieChart } from 'react-native-gifted-charts'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import type { CategoryStatItem } from '@/api/endpoints/stats.api'
import SkeletonBox from '@/components/containers/SkeletonBox'

type StatsDateTab = '일' | '월' | '년' | '기간'

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

const s = strings.stats

export default function CategoryBreakdown({ total, byCategory, prevByCategory, dateTab, title, isLoading }: Props) {
  const { theme } = useTheme()

  const [selectedIndex, setSelectedIndex]   = useState<number | null>(null)
  const fadeAnim                            = useRef(new Animated.Value(0)).current

  const scrubActiveRef    = useRef(false)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastIndexRef      = useRef<number | null>(null)
  const gestureStartXRef  = useRef(0)
  const gestureStartYRef  = useRef(0)
  const donutWrapWidthRef = useRef(0)

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

  const pieData = useMemo(() =>
    byCategory.slice(0, 8).map((item, i) => ({
      value: item.amount,
      color: item.category?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      text:  item.category?.icon ?? '',
    })),
  [byCategory])

  // 각 슬라이스의 시작/끝 각도 (0° = 12시 방향, 시계 방향 증가)
  const sliceAngles = useMemo(() => {
    const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0)
    if (pieTotal === 0) return []
    let cum = 0
    return pieData.map(d => {
      const start = cum
      const span  = (d.value / pieTotal) * 360
      cum += span
      return { start, end: cum }
    })
  }, [pieData])

  const getSliceIndex = useCallback((angle: number) => {
    for (let i = 0; i < sliceAngles.length; i++) {
      if (angle >= sliceAngles[i].start && angle < sliceAngles[i].end) return i
    }
    return sliceAngles.length - 1
  }, [sliceAngles])

  const handleScrubTouch = useCallback((x: number, y: number) => {
    const cx = donutWrapWidthRef.current / 2
    const cy = DONUT_R
    const dx = x - cx
    const dy = y - cy
    // 12시 방향 0°, 시계 방향
    let angle = Math.atan2(dx, -dy) * 180 / Math.PI
    if (angle < 0) angle += 360

    const idx = getSliceIndex(angle)
    if (idx !== lastIndexRef.current && idx < byCategory.length) {
      lastIndexRef.current = idx
      setSelectedIndex(idx)
      Vibration.vibrate(10)
      Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }).start()
    }
  }, [getSliceIndex, byCategory.length, fadeAnim])

  const exitScrub = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
    scrubActiveRef.current = false
    lastIndexRef.current   = null
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setSelectedIndex(null)
    })
  }, [fadeAnim])

  const donutPanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder:        () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder:         () => true,
    onPanResponderGrant: (e) => {
      gestureStartXRef.current = e.nativeEvent.locationX
      gestureStartYRef.current = e.nativeEvent.locationY
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null
        scrubActiveRef.current    = true
        Vibration.vibrate(40)
        lastIndexRef.current = null
        handleScrubTouch(gestureStartXRef.current, gestureStartYRef.current)
      }, 300)
    },
    onPanResponderMove: (e) => {
      if (scrubActiveRef.current) {
        handleScrubTouch(e.nativeEvent.locationX, e.nativeEvent.locationY)
      }
    },
    onPanResponderRelease:   exitScrub,
    onPanResponderTerminate: exitScrub,
  }), [handleScrubTouch, exitScrub])

  const selectedItem  = selectedIndex !== null ? byCategory[selectedIndex] : null
  const selectedColor = selectedIndex !== null
    ? (byCategory[selectedIndex]?.category?.color ?? FALLBACK_COLORS[selectedIndex % FALLBACK_COLORS.length])
    : undefined

  const defaultOpacity = fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })

  const centerLabel = useCallback(() => (
    <View style={ss.center}>
      {/* 기본: 합계 */}
      <Animated.View style={[StyleSheet.absoluteFill, ss.centerInner, { opacity: defaultOpacity }]} pointerEvents="none">
        <Text style={[ss.centerAmount, { color: theme.colors.text.primary }]}>{fmtAmount(total)}</Text>
        <Text style={[ss.centerUnit,   { color: theme.colors.text.disabled }]}>{s.currencyUnit}</Text>
      </Animated.View>
      {/* 선택된 슬라이스 */}
      <Animated.View style={[StyleSheet.absoluteFill, ss.centerInner, { opacity: fadeAnim }]} pointerEvents="none">
        {selectedItem && (
          <>
            <Text style={[ss.centerCatName, { color: selectedColor ?? theme.colors.text.primary }]} numberOfLines={1}>
              {selectedItem.category ? `${selectedItem.category.icon} ${selectedItem.category.name}` : s.other}
            </Text>
            <Text style={[ss.centerSelAmount, { color: theme.colors.text.primary }]}>
              {fmtAmount(selectedItem.amount)}
            </Text>
            <Text style={[ss.centerSelPct, { color: theme.colors.text.secondary }]}>
              {selectedItem.ratio}%
            </Text>
          </>
        )}
      </Animated.View>
    </View>
  ), [defaultOpacity, fadeAnim, selectedItem, selectedColor, total, theme])

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

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      {title && <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{title}</Text>}

      {!hasData ? (
        <View style={ss.emptyWrap}>
          <Text style={[ss.emptyText, { color: theme.colors.text.disabled }]}>{s.noData}</Text>
        </View>
      ) : (
        <>
          <View
            style={ss.donutWrap}
            onLayout={(e) => { donutWrapWidthRef.current = e.nativeEvent.layout.width }}
          >
            <PieChart
              data={pieData}
              donut
              radius={DONUT_R}
              innerRadius={DONUT_IR}
              innerCircleColor={theme.colors.surface}
              centerLabelComponent={centerLabel}
            />
            <View {...donutPanResponder.panHandlers} style={StyleSheet.absoluteFill} />
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
  wrap:           { borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  title:          { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  emptyWrap:      { height: 80, alignItems: 'center', justifyContent: 'center' },
  emptyText:      { fontSize: 13 },
  donutWrap:      { alignItems: 'center', marginBottom: 16 },

  center:         { width: DONUT_IR * 2, height: DONUT_IR * 2 },
  centerInner:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  centerAmount:   { fontSize: 16, fontWeight: '700' },
  centerUnit:     { fontSize: 11 },
  centerCatName:  { fontSize: 10, fontWeight: '600', textAlign: 'center', maxWidth: DONUT_IR * 2 - 4 },
  centerSelAmount:{ fontSize: 14, fontWeight: '700', textAlign: 'center' },
  centerSelPct:   { fontSize: 11, textAlign: 'center' },

  list:           { marginTop: 4 },
  sep:            { height: StyleSheet.hairlineWidth },
  row:            { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  dot:            { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  name:           { flex: 1, fontSize: 13 },
  diff:           { fontSize: 12, minWidth: 88, textAlign: 'right' },
  pct:            { fontSize: 13, minWidth: 36, textAlign: 'right' },
  skName:         { flex: 1 },
})
