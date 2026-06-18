import React, { useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
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

function Top10Row({ item, idx, isLast, theme }: {
  item:   Top10Item
  idx:    number
  isLast: boolean
  theme:  ReturnType<typeof useTheme>['theme']
}) {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const fadeAnim  = useRef(new Animated.Value(0)).current
  const activeRef = useRef(false)

  const handleLongPress = () => {
    if (!item.memo) return
    activeRef.current = true
    setTooltipVisible(true)
    Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start()
  }

  const handlePressOut = () => {
    if (!activeRef.current) return
    activeRef.current = false
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setTooltipVisible(false)
    })
  }

  return (
    <View>
      {tooltipVisible && item.memo && (
        <Animated.View style={[ss.tooltip, { backgroundColor: theme.colors.surfaceVariant, opacity: fadeAnim }]}>
          <Text style={[ss.tooltipText, { color: theme.colors.text.secondary }]} numberOfLines={3}>
            {item.memo}
          </Text>
        </Animated.View>
      )}
      <TouchableOpacity
        style={[ss.row, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.divider }]}
        onLongPress={handleLongPress}
        onPressOut={handlePressOut}
        delayLongPress={300}
        activeOpacity={0.7}
      >
        <Text style={[ss.rank, { color: idx < 3 ? theme.colors.primary : theme.colors.text.disabled }]}>
          {idx + 1}
        </Text>

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

        <Text style={[ss.amount, { color: theme.colors.text.primary }]}>
          {item.amount.toLocaleString()}{s.currencyUnit}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default function TopTransactionList({ items, isLoading }: Props) {
  const { theme } = useTheme()

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
        <Top10Row
          key={item.id}
          item={item}
          idx={idx}
          isLast={idx === items.length - 1}
          theme={theme}
        />
      ))}
    </View>
  )
}

const ss = StyleSheet.create({
  wrap:        { borderRadius: 16, padding: 16, marginHorizontal: 16, marginBottom: 12 },
  title:       { fontSize: 13, fontWeight: '600', marginBottom: 12 },
  row:         { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  rank:        { width: 20, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  info:        { flex: 1, gap: 2 },
  nameRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  icon:        { fontSize: 14 },
  merchant:    { fontSize: 14, fontWeight: '500', flexShrink: 1 },
  sub:         { fontSize: 12 },
  amount:      { fontSize: 14, fontWeight: '600' },
  tooltip:     { marginHorizontal: 16, marginBottom: 2, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  tooltipText: { fontSize: 12, lineHeight: 16 },
  skRow:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  skMid:       { flex: 1 },
  skGap:       { marginBottom: 4 },
})
