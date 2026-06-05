import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '@/theme'
import type { StatsDateTab } from '../types'
import { formatDateLabel } from '../utils'

interface Props {
  dateTab: StatsDateTab
  date:    Date
  onPrev:  () => void
  onNext:  () => void
}

export default function DateNavigator({ dateTab, date, onPrev, onNext }: Props) {
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
      <Text style={[ss.label, { color: theme.colors.text.primary }]}>
        {formatDateLabel(dateTab, date)}
      </Text>
      <TouchableOpacity onPress={onNext} style={ss.arrowBtn} activeOpacity={0.6} disabled={isToday}>
        <Text style={[ss.arrow, { color: isToday ? theme.colors.text.disabled : theme.colors.text.secondary }]}>›</Text>
      </TouchableOpacity>
    </View>
  )
}

const ss = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  arrowBtn: { paddingHorizontal: 20, paddingVertical: 4 },
  arrow:    { fontSize: 28, lineHeight: 32 },
  label:    { fontSize: 16, fontWeight: '600', minWidth: 140, textAlign: 'center' },
})
