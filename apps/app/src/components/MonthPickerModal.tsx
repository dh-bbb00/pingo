import React, { useEffect, useMemo, useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles } from './MonthPickerModal.styles'

const dp = strings.datePicker

interface Props {
  visible:        boolean
  selectedYear:   number
  selectedMonth:  number   // 0-indexed
  hasSelection?:  boolean  // false = 선택 없음 (강조 없음)
  onSelect:       (year: number, month: number) => void
  onClose:        () => void
  onClear?:       () => void  // 제공 시 "전체 기간" 버튼 표시
}

export default function MonthPickerModal({ visible, selectedYear, selectedMonth, hasSelection = true, onSelect, onClose, onClear }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [viewYear, setViewYear] = useState(selectedYear)

  useEffect(() => {
    if (visible) setViewYear(selectedYear)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const today = new Date()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.navBtn} onPress={() => setViewYear(y => y - 1)} activeOpacity={0.6}>
              <Text style={styles.arrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.yearLabel}>{dp.yearFormat(viewYear)}</Text>
            <TouchableOpacity style={styles.navBtn} onPress={() => setViewYear(y => y + 1)} activeOpacity={0.6}>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {dp.months.map((name, i) => {
              const isSelected = hasSelection && viewYear === selectedYear && i === selectedMonth
              const isCurrent  = viewYear === today.getFullYear() && i === today.getMonth()
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.cell}
                  onPress={() => { onSelect(viewYear, i); onClose() }}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.monthCircle,
                    isSelected && styles.monthCircleSelected,
                    !isSelected && isCurrent && styles.monthCircleToday,
                  ]}>
                    <Text style={[
                      styles.monthText,
                      isSelected  && styles.monthTextSelected,
                      !isSelected && isCurrent && styles.monthTextToday,
                    ]}>
                      {name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>

          {onClear && (
            <TouchableOpacity style={styles.clearBtn} onPress={() => { onClear(); onClose() }} activeOpacity={0.7}>
              <Text style={styles.clearBtnText}>{dp.allPeriod}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  )
}
