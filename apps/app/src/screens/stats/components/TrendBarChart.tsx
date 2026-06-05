import React, { useState, useRef, useMemo, useCallback } from 'react'
import { View, Text, Dimensions, StyleSheet, PanResponder, Animated, Vibration } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import Svg, { Line } from 'react-native-svg'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import SkeletonBox from '@/components/containers/SkeletonBox'

interface BarDataItem {
  value:         number
  label?:        string
  tooltipLabel?: string
}

interface Props {
  data:       BarDataItem[]
  title?:     string
  isLoading?: boolean
}

const SCREEN_W = Dimensions.get('window').width
const Y_AXIS_W = 38
const CHART_W  = SCREEN_W - 64 - Y_AXIS_W
const CHART_H  = 160
const LABEL_H  = 28   // x축 라벨 영역 높이
const SECTIONS = 3

function formatYLabel(val: number): string {
  if (val <= 0) return '0'
  return Math.round(val).toLocaleString()
}

export default function TrendBarChart({ data, title, isLoading }: Props) {
  const { theme } = useTheme()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const lastIndexRef          = useRef<number | null>(null)
  const scrubActiveRef        = useRef(false)
  const scrollOffsetRef       = useRef(0)
  const longPressTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gestureStartXRef      = useRef(0)
  const gestureStartScrollRef = useRef(0)
  const totalBarsWidthRef     = useRef(0)
  const scrollAnimRef         = useRef(new Animated.Value(0))

  const count      = data.length
  const scrollable = count > 30
  const spacing    = count > 20 ? 2 : count > 10 ? 4 : 8
  const barW = scrollable
    ? Math.max(4, Math.floor((CHART_W - spacing * 31) / 30))
    : Math.max(4, Math.floor((CHART_W - spacing * (count + 1)) / count))

  totalBarsWidthRef.current = spacing + count * (barW + spacing)

  const maxVal = useMemo(() => Math.max(...data.map(d => d.value), 1) * 1.2, [data])

  const yAxisLabels = useMemo(() =>
    Array.from({ length: SECTIONS }, (_, i) => ({
      label: formatYLabel(maxVal * (SECTIONS - i) / SECTIONS),
      y:     (i * CHART_H) / SECTIONS,
    })),
  [maxVal])

  const labelWidth = useMemo(() => {
    const firstIdx  = data.findIndex(d => d.label)
    if (firstIdx < 0) return barW
    const secondIdx = data.findIndex((d, i) => i > firstIdx && d.label)
    const step      = secondIdx < 0 ? 1 : secondIdx - firstIdx
    return Math.min(step * (barW + spacing), 40)
  }, [data, barW, spacing])

  const coloredData = useMemo(() => data.map(d => ({
    ...d,
    frontColor: theme.colors.primary,
  })), [data, theme])

  const yAxisTextStyle = useMemo(
    () => ({ color: theme.colors.text.disabled, fontSize: 9 }),
    [theme.colors.text.disabled],
  )

  const formatYAxisLabel = useCallback(
    (val: string) => {
      const n = parseFloat(val)
      if (!n || n <= 0) return '0'
      return Math.round(n).toLocaleString()
    },
    [],
  )

  // y축 배경: 스크롤 시 막대가 y축 아래로 밀려들어오는 것을 덮음
  const yAxisWrapStyle = useMemo(
    () => [ss.yAxisWrap, { backgroundColor: theme.colors.surface }],
    [theme.colors.surface],
  )

  const getBarCenterX = useCallback((idx: number) =>
    Y_AXIS_W + spacing + idx * (barW + spacing) + barW / 2,
  [barW, spacing])

  const getBarTopY = useCallback((value: number) =>
    CHART_H * (1 - value / maxVal),
  [maxVal])

  const handleScrubTouch = useCallback((x: number) => {
    const contentX = x + scrollOffsetRef.current - Y_AXIS_W - spacing
    const idx = Math.max(0, Math.min(count - 1, Math.round(contentX / (barW + spacing))))
    if (idx !== lastIndexRef.current) {
      lastIndexRef.current = idx
      setActiveIndex(idx)
      Vibration.vibrate(10)
    }
  }, [count, barW, spacing])

  // 비스크롤: 터치 즉시 스크럽
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder:        () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder:         () => true,
    onPanResponderGrant:     (e) => handleScrubTouch(e.nativeEvent.locationX),
    onPanResponderMove:      (e) => handleScrubTouch(e.nativeEvent.locationX),
    onPanResponderRelease:   () => { setActiveIndex(null); lastIndexRef.current = null },
    onPanResponderTerminate: () => { setActiveIndex(null); lastIndexRef.current = null },
  }), [handleScrubTouch])

  // 스크롤 모드: 캡처 페이즈에서 선점 → onPanResponderGrant 확실히 호출됨
  // 300ms 유지 → 스크럽, 즉시 드래그 → 수동 스크롤
  const scrollPanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder:        () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder:         () => true,
    onPanResponderGrant: (e) => {
      gestureStartXRef.current      = e.nativeEvent.locationX
      gestureStartScrollRef.current = scrollOffsetRef.current
      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = null
        scrubActiveRef.current    = true
        Vibration.vibrate(40)
        lastIndexRef.current = null  // 반드시 갱신되도록 초기화
        handleScrubTouch(gestureStartXRef.current)
      }, 300)
    },
    onPanResponderMove: (e, gs) => {
      if (scrubActiveRef.current) {
        handleScrubTouch(e.nativeEvent.locationX)
      } else {
        if (Math.abs(gs.dx) > 4 && longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current)
          longPressTimerRef.current = null
        }
        const maxScroll = Math.max(0, totalBarsWidthRef.current - CHART_W)
        const newX = Math.max(0, Math.min(maxScroll, gestureStartScrollRef.current - gs.dx))
        scrollAnimRef.current.setValue(-newX)
        scrollOffsetRef.current = newX
      }
    },
    onPanResponderRelease: () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
      scrubActiveRef.current = false
      setActiveIndex(null)
      lastIndexRef.current   = null
    },
    onPanResponderTerminate: () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }
      scrubActiveRef.current = false
      setActiveIndex(null)
      lastIndexRef.current   = null
    },
  }), [handleScrubTouch])

  if (isLoading) {
    return (
      <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
        {title && <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{title}</Text>}
        <SkeletonBox height={CHART_H} radius={8} />
      </View>
    )
  }

  const hasData = data.some(d => d.value > 0)

  if (!hasData) {
    return (
      <View style={ss.emptyWrap}>
        <Text style={[ss.emptyText, { color: theme.colors.text.disabled }]}>
          {strings.stats.noData}
        </Text>
      </View>
    )
  }

  const activeItem   = activeIndex !== null ? data[activeIndex] : null
  const scrollOffset = scrollable ? scrollOffsetRef.current : 0
  const crossX       = activeIndex !== null ? getBarCenterX(activeIndex) - scrollOffset : 0
  const crossY       = activeItem ? getBarTopY(activeItem.value) : 0

  const baseChartProps = {
    data:                coloredData,
    barWidth:            barW,
    spacing,
    initialSpacing:      spacing,
    barBorderRadius:     3,
    noOfSections:        SECTIONS,
    maxValue:            maxVal,
    height:              CHART_H,
    hideRules:           true,
    xAxisThickness:      0,
    yAxisThickness:      0,
    labelWidth,
    xAxisLabelTextStyle: { color: theme.colors.text.disabled, fontSize: 11 },
    isAnimated:          false,
    disableScroll:       true,
  }

  const crosshair = activeIndex !== null ? (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={Y_AXIS_W + CHART_W} height={CHART_H}>
        <Line
          x1={crossX} y1={0} x2={crossX} y2={CHART_H}
          stroke={theme.colors.text.secondary} strokeWidth={1} strokeDasharray="3 3"
        />
        <Line
          x1={Y_AXIS_W} y1={crossY} x2={Y_AXIS_W + CHART_W} y2={crossY}
          stroke={theme.colors.text.secondary} strokeWidth={1} strokeDasharray="3 3"
        />
      </Svg>
    </View>
  ) : null

  return (
    <View style={[ss.wrap, { backgroundColor: theme.colors.surface }]}>
      <View style={ss.header}>
        {title && (
          <Text style={[ss.title, { color: theme.colors.text.secondary }]}>{title}</Text>
        )}
        {activeItem && (
          <Text style={[ss.activeLabel, { color: theme.colors.text.primary }]}>
            {activeItem.tooltipLabel ?? activeItem.label ?? ''}{' '}
            <Text style={ss.activeAmount}>
              {activeItem.value.toLocaleString()}{strings.stats.currencyUnit}
            </Text>
          </Text>
        )}
      </View>

      {scrollable ? (
        <View {...scrollPanResponder.panHandlers} style={ss.chartWrap}>
          <View style={ss.scrollRow}>
            {/* y축: zIndex 로 막대 오버플로우 위에 렌더링, backgroundColor 로 가림 */}
            <View style={yAxisWrapStyle}>
              {yAxisLabels.map(({ label, y }) => (
                <Text
                  key={y}
                  style={[ss.yAxisText, { top: y, color: theme.colors.text.disabled }]}
                >
                  {label}
                </Text>
              ))}
            </View>
            {/* Animated.View로 막대 이동 — ScrollView 미사용으로 터치 충돌 없음 */}
            <View style={ss.barsClip}>
              <Animated.View style={{ transform: [{ translateX: scrollAnimRef.current }] }}>
                <BarChart
                  {...baseChartProps}
                  width={totalBarsWidthRef.current}
                  yAxisLabelWidth={0}
                />
              </Animated.View>
            </View>
          </View>
          {crosshair}
        </View>
      ) : (
        <View {...panResponder.panHandlers} style={ss.chartWrap}>
          <BarChart
            {...baseChartProps}
            width={CHART_W}
            yAxisLabelWidth={Y_AXIS_W}
            yAxisTextStyle={yAxisTextStyle}
            formatYLabel={formatYAxisLabel}
          />
          {crosshair}
        </View>
      )}
    </View>
  )
}

const ss = StyleSheet.create({
  wrap:         { borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title:        { fontSize: 13, fontWeight: '600' },
  activeLabel:  { fontSize: 12 },
  activeAmount: { fontWeight: '700' },
  chartWrap:    { position: 'relative' },
  scrollRow:    { flexDirection: 'row' },
  yAxisWrap:    { width: Y_AXIS_W, height: CHART_H + LABEL_H, zIndex: 1 },
  yAxisText:    { position: 'absolute', right: 4, fontSize: 9 },
  barsClip:     { width: CHART_W, height: CHART_H + LABEL_H },
  emptyWrap:    { height: 80, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16 },
  emptyText:    { fontSize: 13 },
})
