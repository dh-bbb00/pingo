import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import type { StatsDateTab } from '../types'
import { formatDateLabel } from '../utils'

interface Props {
  dateTab:  StatsDateTab
  date:     Date
  onPrev:   () => void
  onNext:   () => void
  onPress?: () => void
}

export default function DateNavigator({ dateTab, date, onPrev, onNext, onPress }: Props) {
  const { theme } = useTheme()
  const isToday = (() => {
    const now = new Date()
    if (dateTab === '일') return date.toDateString() === now.toDateString()
    if (dateTab === '월') return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    return date.getFullYear() === now.getFullYear()
  })()

  return (
    <View style={ss.row}>
      <TouchableOpacity onPress={onPrev} style={ss.arrowBtn} activeOpacity={0.6}>
        <Text style={[ss.arrow, { color: theme.colors.text.secondary }]}>‹</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={!onPress} style={ss.labelBtn}>
        <Text style={[ss.label, { color: theme.colors.text.primary }]}>
          {formatDateLabel(dateTab, date)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext} style={ss.arrowBtn} activeOpacity={0.6} disabled={isToday}>
        <Text style={[ss.arrow, { color: isToday ? theme.colors.text.disabled : theme.colors.text.secondary }]}>›</Text>
      </TouchableOpacity>
    </View>
  )
}

const ss = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12 },
  arrowBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  arrow:    { fontSize: 28, lineHeight: 32 },
  labelBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label:    { fontSize: 16, fontWeight: '600', textAlign: 'center' },
})
