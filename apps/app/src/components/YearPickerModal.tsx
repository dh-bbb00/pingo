import React, { useEffect, useMemo, useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { makeStyles } from './YearPickerModal.styles'

const PAGE_SIZE = 12

function pageStart(year: number) {
  return Math.floor(year / PAGE_SIZE) * PAGE_SIZE
}

interface Props {
  visible:      boolean
  selectedYear: number
  onSelect:     (year: number) => void
  onClose:      () => void
}

export default function YearPickerModal({ visible, selectedYear, onSelect, onClose }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [viewStart, setViewStart] = useState(pageStart(selectedYear))

  useEffect(() => {
    if (visible) setViewStart(pageStart(selectedYear))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const today   = new Date()
  const years   = Array.from({ length: PAGE_SIZE }, (_, i) => viewStart + i)
  const viewEnd = viewStart + PAGE_SIZE - 1

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.navBtn} onPress={() => setViewStart(s => s - PAGE_SIZE)} activeOpacity={0.6}>
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.rangeLabel}>{viewStart} – {viewEnd}</Text>
            <TouchableOpacity style={styles.navBtn} onPress={() => setViewStart(s => s + PAGE_SIZE)} activeOpacity={0.6}>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {years.map(year => {
              const isSelected = year === selectedYear
              const isCurrent  = year === today.getFullYear()
              return (
                <TouchableOpacity
                  key={year}
                  style={styles.cell}
                  onPress={() => { onSelect(year); onClose() }}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.yearCircle,
                    isSelected && styles.yearCircleSelected,
                    !isSelected && isCurrent && styles.yearCircleToday,
                  ]}>
                    <Text style={[
                      styles.yearText,
                      isSelected  && styles.yearTextSelected,
                      !isSelected && isCurrent && styles.yearTextToday,
                    ]}>
                      {year}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>
    </Modal>
  )
}
