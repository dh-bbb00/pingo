import React, { useEffect, useMemo, useState } from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from '@/theme'
import { strings } from '@/constants/strings'
import { makeStyles } from './DatePickerModal.styles'

const dp = strings.datePicker

interface Props {
  visible:      boolean
  selectedDate: Date
  onSelect:     (date: Date) => void
  onClose:      () => void
}

export default function DatePickerModal({ visible, selectedDate, onSelect, onClose }: Props) {
  const { theme } = useTheme()
  const styles = useMemo(() => makeStyles(theme), [theme])

  const [viewYear,  setViewYear]  = useState(selectedDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth())

  // 모달이 열릴 때마다 선택된 날짜의 월로 초기화
  useEffect(() => {
    if (visible) {
      setViewYear(selectedDate.getFullYear())
      setViewMonth(selectedDate.getMonth())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const today  = new Date()
  const todayY = today.getFullYear()
  const todayM = today.getMonth()
  const todayD = today.getDate()

  const selY = selectedDate.getFullYear()
  const selM = selectedDate.getMonth()
  const selD = selectedDate.getDate()

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay() // 0=일

  // 달력 셀: null=빈 셀, number=날짜
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const handleSelect = (day: number) => {
    onSelect(new Date(viewYear, viewMonth, day))
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

        <View style={styles.sheet}>
          {/* 월 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.monthBtn} onPress={prevMonth} activeOpacity={0.6}>
              <Text style={styles.monthArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>{dp.monthFormat(viewYear, viewMonth + 1)}</Text>
            <TouchableOpacity style={styles.monthBtn} onPress={nextMonth} activeOpacity={0.6}>
              <Text style={styles.monthArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={styles.weekRow}>
            {dp.weekdays.map(d => (
              <Text key={d} style={styles.weekday}>{d}</Text>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={styles.grid}>
            {cells.map((day, i) => {
              if (!day) return <View key={i} style={styles.cell} />
              const isSelected = viewYear === selY && viewMonth === selM && day === selD
              const isToday    = viewYear === todayY && viewMonth === todayM && day === todayD
              return (
                <TouchableOpacity key={i} style={styles.cell} onPress={() => handleSelect(day)} activeOpacity={0.7}>
                  <View style={[
                    styles.dayCircle,
                    isSelected && styles.dayCircleSelected,
                    !isSelected && isToday && styles.dayCircleToday,
                  ]}>
                    <Text style={[
                      styles.dayText,
                      isSelected  && styles.dayTextSelected,
                      !isSelected && isToday && styles.dayTextToday,
                    ]}>
                      {day}
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
